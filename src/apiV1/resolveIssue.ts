import { Middleware } from "koa";

import { knex } from "../db";

import { HTTPError, Issue, AgentResolveIssueResponse } from "./validators";

const resolveAndAssignNext = async (id: number) => {
  let resolvedIssue: AgentResolveIssueResponse | undefined;
  await knex.transaction(async (trx) => {
    const issue: Issue = await trx("issues").select("*").where({ id }).first();

    if (!issue) {
      return;
    }
    if (issue.status !== "assigned") {
      const error: HTTPError = new Error("issue not currently assigned");
      error.statusCode = 409; // conflict
      throw error;
    }

    const [updatedIssue]: AgentResolveIssueResponse[] = await trx("issues")
      .update({ status: "resolved" }, "*")
      .where({ id, status: "assigned" });
    if (!updatedIssue) {
      return;
    }
    resolvedIssue = updatedIssue;
    resolvedIssue.nextAssignedIssueId = null;

    const nextUnassignedIssue = await trx("issues")
      .select("id")
      .where({
        status: "new",
      })
      .orderBy("id", "asc")
      .first();

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
    // re-throw already constructed HTTP errors
    if (err.statusCode) {
      throw err;
    }
    ctx.status = 500;
  }
};
