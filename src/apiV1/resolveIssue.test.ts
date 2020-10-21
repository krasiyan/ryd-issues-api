import request from "supertest";
import mockKnex, { Tracker } from "mock-knex";

import { knex } from "../db";
import { app } from "../server";

import * as validators from "./validators";

describe("resolveIssue - POST /apiv1/issues/:id/resolve", () => {
  const tracker: Tracker = mockKnex.getTracker();

  const mockIssue: validators.Issue = {
    title: "test title",
    description: "test desc",
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

  test("api handles request URL params validation", () => {
    tracker.on("query", () => {
      throw new Error("DB query should not be fired with invalid query params");
    });
    return request(app.callback())
      .post("/apiv1/issues/not-an-id/resolve")
      .send({})
      .expect(400);
  });

  test("agent tries to resolve non existing issue / issue with a non-assigned status", () => {
    tracker.on("query", (query) => {
      expect(query.transacting).toEqual(true);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      if ((query as any)?.step === 1) {
        expect(query.sql).toEqual("BEGIN;");
        query.response("BEGIN");
      } else if ((query as any)?.step === 2) {
        expect(query.sql).toEqual(
          "update `issues` set `status` = ? where `id` = ? and `status` = ?"
        );
        expect(query.bindings).toEqual(["resolved", 12345, "assigned"]);
        query.response([]);
      } else if ((query as any)?.step === 3) {
        expect(query.sql).toEqual("COMMIT;");
        query.response("COMMIT");
      } else {
        throw new Error("unexpected SQL query");
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });
    return request(app.callback())
      .post("/apiv1/issues/12345/resolve")
      .send({})
      .expect(404);
  });

  test("agent resolves assigned issue with no followup issue", () => {
    tracker.on("query", (query) => {
      expect(query.transacting).toEqual(true);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      if ((query as any)?.step === 1) {
        expect(query.sql).toEqual("BEGIN;");
        query.response("BEGIN");
      } else if ((query as any)?.step === 2) {
        expect(query.sql).toEqual(
          "update `issues` set `status` = ? where `id` = ? and `status` = ?"
        );
        expect(query.bindings).toEqual(["resolved", 1, "assigned"]);
        query.response([{ ...mockIssue, status: "resolved" }]);
      } else if ((query as any)?.step === 3) {
        expect(query.sql).toEqual(
          "select `id` from `issues` where `status` = ? order by `id` asc limit ?"
        );
        expect(query.bindings).toEqual(["new", 1]);
        query.response([null]);
      } else if ((query as any)?.step === 4) {
        expect(query.sql).toEqual("COMMIT;");
        query.response("COMMIT");
      } else {
        throw new Error("unexpected SQL query");
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });
    return request(app.callback())
      .post("/apiv1/issues/1/resolve")
      .send({})
      .expect(200, {
        ...mockIssue,
        status: "resolved",
        nextAssignedIssueId: null,
      });
  });

  test("agent resolves assigned issue and gets assigned a followup issue", () => {
    const mockAssignedIssue: validators.Issue = {
      ...mockIssue,
      status: "resolved",
      agentId: 1,
      agentName: "some agent",
    };
    const mockNextIssue: validators.Issue = {
      id: 2,
      title: "issue2",
      description: "issue2",
      status: "new",
    };

    tracker.on("query", (query) => {
      expect(query.transacting).toEqual(true);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      if ((query as any)?.step === 1) {
        expect(query.sql).toEqual("BEGIN;");
        query.response("BEGIN");
      } else if ((query as any)?.step === 2) {
        expect(query.sql).toEqual(
          "update `issues` set `status` = ? where `id` = ? and `status` = ?"
        );
        expect(query.bindings).toEqual(["resolved", 1, "assigned"]);
        query.response([mockAssignedIssue]);
      } else if ((query as any)?.step === 3) {
        expect(query.sql).toEqual(
          "select `id` from `issues` where `status` = ? order by `id` asc limit ?"
        );
        expect(query.bindings).toEqual(["new", 1]);
        query.response([mockNextIssue]);
      } else if ((query as any)?.step === 4) {
        expect(query.sql).toEqual(
          "update `issues` set `status` = ?, `agentId` = ?, `agentName` = ? where `id` = ?"
        );
        expect(query.bindings).toEqual(["assigned", 1, "some agent", 2]);
        query.response([
          {
            ...mockNextIssue,
            status: "assigned",
            agentId: 1,
            agentName: "some agent",
          },
        ]);
      } else if ((query as any)?.step === 5) {
        expect(query.sql).toEqual("COMMIT;");
        query.response("COMMIT");
      } else {
        throw new Error("unexpected SQL query");
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });
    return request(app.callback())
      .post("/apiv1/issues/1/resolve")
      .send({})
      .expect(200, {
        ...mockAssignedIssue,
        status: "resolved",
        nextAssignedIssueId: 2,
      });
  });
});
