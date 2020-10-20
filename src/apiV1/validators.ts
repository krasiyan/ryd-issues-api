import Joi from "@hapi/joi";
import "joi-extract-type";

export const UserIssue = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});
export type UserIssue = Joi.extractType<typeof UserIssue>;

export const IssueStatus = Joi.string()
  .valid("new", "assigned", "resolved")
  .required();
export type IssueStatus = Joi.extractType<typeof IssueStatus>;

export const SupportAgentIssue = UserIssue.keys({
  status: IssueStatus,
  agentId: Joi.number(),
  agentName: Joi.string(),
});
export type SupportAgentIssue = Joi.extractType<typeof SupportAgentIssue>;

export const SupportAgentIssues = Joi.array().items(SupportAgentIssue);
export type SupportAgentIssues = Joi.extractType<typeof SupportAgentIssues>;

export const SupportAgentResolveIssue = SupportAgentIssue.keys({
  status: Joi.string().valid("resolved").required(),
  nextAssignedIssueId: Joi.number().required(),
});
export type SupportAgentResolveIssue = Joi.extractType<
  typeof SupportAgentResolveIssue
>;

export const Agent = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
});
export type Agent = Joi.extractType<typeof Agent>;

export const Agents = Joi.array().items(Agent);
export type Agents = Joi.extractType<typeof Agents>;
