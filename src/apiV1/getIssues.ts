import { Middleware } from "koa";

import { knex } from "../db";

import { Issue } from "./validators";

export const getIssues: Middleware = async (ctx) => {
  const issues: Issue[] = await knex("issues").select("*");
  ctx.body = issues;
};
