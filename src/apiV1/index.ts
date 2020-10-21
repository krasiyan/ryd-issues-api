import router from "koa-joi-router";

import { createIssue } from "./createIssue";
import { resolveIssue } from "./resolveIssue";
import { getIssues } from "./getIssues";
import { getAgents } from "./getAgents";

import * as validators from "./validators";

const apiv1 = router();

apiv1.route({
  method: "get",
  path: "/ping",
  validate: {
    output: {
      200: {
        body: validators.PingResponse,
      },
    },
  },
  handler: (ctx) => (ctx.body = { response: "pong" }),
});

apiv1.route({
  method: "post",
  path: "/issues",
  validate: {
    type: "json",
    body: validators.NewIssueRequest,
    output: {
      200: {
        body: validators.Issue,
      },
    },
  },
  handler: createIssue,
});

apiv1.route({
  method: "post",
  path: "/issues/:id/resolve",
  validate: {
    type: "json",
    params: {
      id: validators.IssueId,
    },
    output: { 200: { body: validators.AgentResolveIssueResponse } },
  },
  handler: resolveIssue,
});

apiv1.route({
  method: "get",
  path: "/issues",
  validate: {
    query: validators.IssuesQueryParams,
    output: {
      200: {
        body: validators.Issues,
      },
    },
  },
  handler: getIssues,
});

apiv1.route({
  method: "get",
  path: "/agents",
  validate: {
    output: { 200: { body: validators.Agents } },
  },
  handler: getAgents,
});

export const apiV1Router = apiv1.prefix("/apiv1");
