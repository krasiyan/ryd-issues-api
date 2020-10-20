import { Middleware } from "koa";

import { knex } from "../db";

import { AgentResolveIssueResponse } from "./validators";

export const resolveIssue: Middleware = async (ctx) => {
  // id is guaranteed to be a number by the Joi params validator
  const { id } = (ctx.request.params as unknown) as { id: number };

  const [issue]: AgentResolveIssueResponse[] = await knex("issues")
    .update({ status: "resolved" }, "*")
    .where({ id, status: "assigned" });

  if (!issue) {
    ctx.status = 404;
    return;
  }

  // TODO: assign agent to next issue (if present)
  issue.nextAssignedIssueId = 1;

  ctx.body = issue;
};
