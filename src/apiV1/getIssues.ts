import { Middleware } from "koa";

export const getIssues: Middleware = (ctx) => {
  ctx.body = [];
};
