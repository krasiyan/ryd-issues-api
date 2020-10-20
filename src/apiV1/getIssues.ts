import { Middleware } from "koa";
import { Issue } from "./validators";

export const getIssues: Middleware = (ctx) => {
  const mockIssues: Issue[] = [
    {
      title: "Resolved Issue",
      description: "mock",
      id: 1,
      status: "resolved",
      agentId: 1,
      agentName: "Test Agent",
    },
    {
      title: "Unresolved Issue",
      description: "mock",
      id: 2,
      status: "resolved",
      agentId: 1,
      agentName: "Test Agent",
    },
    {
      title: "Unassigned Issue",
      description: "mock",
      id: 3,
      status: "new",
    },
  ];
  ctx.body = mockIssues;
};
