import { Middleware } from "koa";

import { knex } from "../db";

import { NewIssueRequest, Issue, Agent } from "./validators";

const getRandomAgent = (agents: Agent[]): Agent =>
  agents[Math.floor(Math.random() * agents.length)];

export const createIssue: Middleware = async (ctx) => {
  const reqData = <NewIssueRequest>ctx.request.body;

  try {
    await knex.transaction(async (trx) => {
      const availableAgents: Agent[] = await trx("agents")
        .select("*")
        .from("agents")
        .whereNotExists(
          trx
            .from("issues")
            .select("id")
            .whereRaw(
              "agents.id = issues.\"agentId\" AND issues.status = 'assigned'"
            )
        );

      const issue: Omit<Issue, "id"> = {
        ...reqData,
        status: "new",
      };

      if (availableAgents.length > 0) {
        const randomAgent = getRandomAgent(availableAgents);
        issue.status = "assigned";
        issue.agentId = randomAgent.id;
        issue.agentName = randomAgent.name;
      }
      const [createdIssue]: Issue[] = await trx
        .insert(issue)
        .into("issues")
        .returning("*");

      ctx.body = createdIssue;
    });
  } catch (err) {
    console.error("createIssue DB transaction error", err);
    ctx.status = 500;
  }
};
