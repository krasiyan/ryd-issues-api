import { Middleware } from "koa";
import { NewIssueRequest, Issue } from "./validators";

export const createIssue: Middleware = (ctx) => {
  const mockIssue = <NewIssueRequest>ctx.request.body;

  const mockAssignedIssue: Issue = {
    ...mockIssue,
    id: 4,
    status: "new",
  };

  ctx.body = mockAssignedIssue;
};
