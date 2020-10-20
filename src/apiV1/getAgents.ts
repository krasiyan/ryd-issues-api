import { Middleware } from "koa";
import { Agent } from "./validators";

export const getAgents: Middleware = (ctx) => {
  const mockAgents: Agent[] = [
    {
      id: 1,
      name: "Test Agent",
    },
  ];
  ctx.body = mockAgents;
};
