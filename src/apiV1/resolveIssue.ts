import { Middleware } from "koa";
import { AgentResolveIssueResponse } from "./validators";

export const resolveIssue: Middleware = (ctx) => {
  const mockResolvedIssue: AgentResolveIssueResponse = {
    title: "Unresolved Issue (now resolved)",
    description: "test description",
    id: 2,
    status: "resolved",
    agentId: 1,
    agentName: "Test Agent",
    nextAssignedIssueId: 3,
  };
  ctx.body = mockResolvedIssue;
};
