import { Middleware } from "koa";

import { knex } from "../db";

import { NewIssueRequest, Issue } from "./validators";

export const createIssue: Middleware = async (ctx) => {
  const issue = <NewIssueRequest>ctx.request.body;

  const [dbIssue]: Issue[] = await knex
    .insert({ ...issue, status: "new" })
    .into("issues")
    .returning("*");

  // TODO: assign issue to agent (if available)
  ctx.body = dbIssue;
};
