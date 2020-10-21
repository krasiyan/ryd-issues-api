import request from "supertest";
import mockKnex, { Tracker } from "mock-knex";

import { knex } from "../db";
import { app } from "../server";

import * as validators from "./validators";

describe("getAgents - /apiv1/agents", () => {
  const tracker: Tracker = mockKnex.getTracker();

  beforeAll(() => {
    mockKnex.mock(knex);
  });
  beforeEach(() => {
    tracker.install();
  });
  afterEach(() => {
    tracker.uninstall();
  });
  afterAll(() => {
    mockKnex.unmock(knex);
  });

  test("returns a list of agents", () => {
    const mockAgents: validators.Agents = [
      { id: 1, name: "mock" },
      { id: 2, name: "test" },
    ];
    tracker.on("query", (query) => {
      expect(query.sql).toEqual("select * from `agents`");
      query.response(mockAgents);
    });
    return request(app.callback()).get("/apiv1/agents").expect(200, mockAgents);
  });
});
