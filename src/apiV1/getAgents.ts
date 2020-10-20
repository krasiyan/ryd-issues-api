import { Middleware } from "koa";

import { knex } from "../db";

import { Agent } from "./validators";

export const getAgents: Middleware = async (ctx) => {
  const agents: Agent[] = await knex("agents").select("*");
  ctx.body = agents;
};
