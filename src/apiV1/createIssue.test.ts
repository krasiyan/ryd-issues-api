import request from "supertest";
import mockKnex, { Tracker } from "mock-knex";

import { knex } from "../db";
import { app } from "../server";

import * as validators from "./validators";

describe("createIssue - POST /apiv1/issues", () => {
  const tracker: Tracker = mockKnex.getTracker();

  const mockIssueReq: validators.NewIssueRequest = {
    title: "test title",
    description: "test desc",
  };
  const mockIssue: validators.Issue = {
    ...mockIssueReq,
    id: 1,
    status: "new",
  };

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

  test("api handles request body validation", () => {
    tracker.on("query", () => {
      throw new Error("DB query should not be fired with invalid query params");
    });
    return request(app.callback())
      .post("/apiv1/issues")
      .send({
        title: 123,
        body: -1,
      })
      .expect(400);
  });

  test("user creates new unassigned issue", () => {
    tracker.on("query", (query) => {
      expect(query.transacting).toEqual(true);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      if ((query as any)?.step === 1) {
        expect(query.sql).toEqual("BEGIN;");
        query.response("BEGIN");
      } else if ((query as any)?.step === 2) {
        expect(query.sql).toEqual(
          "select * from `agents` where not exists (select `id` from `issues` where agents.id = issues.\"agentId\" AND issues.status = 'assigned')"
        );
        query.response([]);
      } else if ((query as any)?.step === 3) {
        expect(query.sql).toEqual(
          "insert into `issues` (`description`, `status`, `title`) values (?, ?, ?)"
        );
        expect(query.bindings).toEqual(["test desc", "new", "test title"]);
        query.response([mockIssue]);
      } else if ((query as any)?.step === 4) {
        expect(query.sql).toEqual("COMMIT;");
        query.response("COMMIT");
      } else {
        throw new Error("unexpected SQL query");
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });
    return request(app.callback())
      .post("/apiv1/issues")
      .send(mockIssueReq)
      .expect(200, mockIssue);
  });

  test("user creates new issue and it is assigned to an available agent", () => {
    const mockIssueWithAgent: validators.Issue = {
      ...mockIssue,
      status: "assigned",
      agentId: 1,
      agentName: "Available Agent",
    };

    tracker.on("query", (query) => {
      expect(query.transacting).toEqual(true);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      if ((query as any)?.step === 1) {
        expect(query.sql).toEqual("BEGIN;");
        query.response("BEGIN");
      } else if ((query as any)?.step === 2) {
        expect(query.sql).toEqual(
          "select * from `agents` where not exists (select `id` from `issues` where agents.id = issues.\"agentId\" AND issues.status = 'assigned')"
        );
        query.response([
          {
            id: 1,
            name: "Available Agent",
          },
        ]);
      } else if ((query as any)?.step === 3) {
        expect(query.sql).toEqual(
          "insert into `issues` (`agentId`, `agentName`, `description`, `status`, `title`) values (?, ?, ?, ?, ?)"
        );
        expect(query.bindings).toEqual([
          1,
          "Available Agent",
          "test desc",
          "assigned",
          "test title",
        ]);
        query.response([mockIssueWithAgent]);
      } else if ((query as any)?.step === 4) {
        expect(query.sql).toEqual("COMMIT;");
        query.response("COMMIT");
      } else {
        throw new Error("unexpected SQL query");
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });
    return request(app.callback())
      .post("/apiv1/issues")
      .send(mockIssueReq)
      .expect(200, mockIssueWithAgent);
  });
});
