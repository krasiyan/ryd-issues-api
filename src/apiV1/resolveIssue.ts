import { Middleware } from "koa";

import { knex } from "../db";

import { AgentResolveIssueResponse } from "./validators";

const resolveAndAssignNext = async (id: number) => {
  let resolvedIssue: AgentResolveIssueResponse | undefined;
  await knex.transaction(async (trx) => {
    const [updatedIssue]: AgentResolveIssueResponse[] = await trx("issues")
      .update({ status: "resolved" }, "*")
      .where({ id, status: "assigned" });
    if (!updatedIssue) {
      return;
    }
    resolvedIssue = updatedIssue;

    const nextUnassignedIssue = await trx("issues")
      .select("id")
      .where({
        status: "new",
      })
      .orderBy("id", "asc")
      .first("id");

    if (nextUnassignedIssue?.id) {
      const nextUnassignedIssueId = nextUnassignedIssue.id;
      await trx("issues")
        .update({
          status: "assigned",
          agentId: resolvedIssue.agentId,
          // NOTE: if the agent names are mutable then this
          // de-normalized value could be stale so it should be refreshed
          agentName: resolvedIssue.agentName,
        })
        .where({ id: nextUnassignedIssueId });
      resolvedIssue.nextAssignedIssueId = nextUnassignedIssueId;
    }
  });
  return resolvedIssue;
};

export const resolveIssue: Middleware = async (ctx) => {
  // id is guaranteed to be a number by the Joi params validator
  const { id } = (ctx.request.params as unknown) as { id: number };

  try {
    ctx.body = await resolveAndAssignNext(id);
    if (!ctx.body) {
      ctx.status = 404;
    }
  } catch (err) {
    console.error("resolveIssue DB transaction error", err);
    ctx.status = 500;
  }
};
