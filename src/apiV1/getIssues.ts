import { Middleware } from "koa";

import { knex } from "../db";

import { Issue, IssuesQueryParams } from "./validators";

export const getIssues: Middleware = async (ctx) => {
  const issuesQuery = knex("issues").select("*");

  const query: IssuesQueryParams = ctx.query;
  if (query.status) {
    issuesQuery.where({ status: query.status });
  }
  if (query.agentId) {
    issuesQuery.where({ agentId: query.agentId });
  }
  const issues: Issue[] = await issuesQuery;
  ctx.body = issues;
};
