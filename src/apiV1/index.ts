import router from "koa-joi-router";
import { createIssue } from "./createIssue";
import { resolveIssue } from "./resolveIssue";
import { getIssues } from "./getIssues";
import { getAgents } from "./getAgents";

const apiv1 = router();

apiv1.route({
  method: "get",
  path: "/ping",
  validate: {},
  handler: (ctx) => (ctx.body = "pong"),
});
apiv1.route({
  method: "post",
  path: "/issues",
  validate: {},
  handler: createIssue,
});
apiv1.route({
  method: "post",
  path: "/issues/:id/resolve",
  validate: {},
  handler: resolveIssue,
});
apiv1.route({
  method: "get",
  path: "/issues",
  validate: {},
  handler: getIssues,
});
apiv1.route({
  method: "get",
  path: "/agents",
  validate: {},
  handler: getAgents,
});

export const apiV1Router = apiv1.prefix("/apiv1");
