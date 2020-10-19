import { Middleware } from "koa";

export const getAgents: Middleware = (ctx) => {
  ctx.body = [];
};
