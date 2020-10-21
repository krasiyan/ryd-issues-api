import request from "supertest";
import mockKnex, { Tracker } from "mock-knex";

import { knex } from "../db";
import { app } from "../server";

import * as validators from "./validators";

describe("getIssues - GET /apiv1/issues", () => {
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

  const mockIssues: validators.Issues = [
    { id: 1, title: "mock", description: "mock desc", status: "new" },
    {
      id: 2,
      title: "test",
      description: "test desc",
      status: "resolved",
      agentId: 1,
      agentName: "test agent",
    },
    {
      id: 3,
      title: "test",
      description: "test desc",
      status: "assigned",
      agentId: 1,
      agentName: "test agent",
    },
  ];

  test("returns a list of issues", () => {
    tracker.on("query", (query) => {
      expect(query.sql).toEqual("select * from `issues`");
      query.response(mockIssues);
    });
    return request(app.callback()).get("/apiv1/issues").expect(200, mockIssues);
  });

  test("returns a list of issues (filtered by status)", async () => {
    tracker.on("query", (query) => {
      expect(query.sql).toEqual("select * from `issues` where `status` = ?");
      query.response([mockIssues[0]]);
    });

    await request(app.callback())
      .get("/apiv1/issues?status=new")
      .expect(200, [mockIssues[0]]);
  });

  test("returns a list of issues (filtered by agentId)", async () => {
    tracker.on("query", (query) => {
      expect(query.sql).toEqual("select * from `issues` where `agentId` = ?");
      query.response([mockIssues[2]]);
    });
    await request(app.callback())
      .get("/apiv1/issues?agentId=1")
      .expect(200, [mockIssues[2]]);
  });

  test("validates query params", async () => {
    tracker.on("query", () => {
      throw new Error("DB query should not be fired with invalid query params");
    });
    await request(app.callback())
      .get("/apiv1/issues?agentId=nonAnId")
      .expect(400);
  });
});
