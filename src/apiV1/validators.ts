import Joi from "@hapi/joi";
import "joi-extract-type";

export const PingResponse = Joi.object({
  response: Joi.string().required(),
});

export const IssueId = Joi.number().required();
export type IssueId = Joi.extractType<typeof IssueId>;

export const NewIssueRequest = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(10000).required(),
});
export type NewIssueRequest = Joi.extractType<typeof NewIssueRequest>;

export const IssueStatus = Joi.string()
  .valid("new", "assigned", "resolved")
  .required();
export type IssueStatus = Joi.extractType<typeof IssueStatus>;

export const Issue = NewIssueRequest.keys({
  id: Joi.number().required(),
  status: IssueStatus,
  agentId: Joi.number(),
  agentName: Joi.string().max(255),
});
export type Issue = Joi.extractType<typeof Issue>;

export const Issues = Joi.array().items(Issue);
export type Issues = Joi.extractType<typeof Issues>;

export const AgentResolveIssueResponse = Issue.keys({
  status: Joi.string().valid("resolved").required(),
  nextAssignedIssueId: Joi.number().required(),
});
export type AgentResolveIssueResponse = Joi.extractType<
  typeof AgentResolveIssueResponse
>;

export const Agent = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().max(255).required(),
});
export type Agent = Joi.extractType<typeof Agent>;

export const Agents = Joi.array().items(Agent);
export type Agents = Joi.extractType<typeof Agents>;
