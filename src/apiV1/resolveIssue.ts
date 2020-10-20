import { Middleware } from "koa";

import { knex } from "../db";

import { AgentResolveIssueResponse } from "./validators";

export const resolveIssue: Middleware = async (ctx) => {
  const [issue]: AgentResolveIssueResponse[] = await knex("issues")
    .update({ status: "resolved" }, "*")
    .where({ id: 3, status: "assigned" });

  if (!issue) {
    ctx.status = 404;
    return;
  }

  // TODO: assign agent to next issue (if present)
  issue.nextAssignedIssueId = 1;

  ctx.body = issue;
};
