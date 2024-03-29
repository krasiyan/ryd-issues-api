import request from "supertest";
import { app } from "./server";

describe("http server", () => {
  test("GET /apiv1/ping", () =>
    request(app.callback())
      .get("/apiv1/ping")
      .expect("Content-Type", /json/)
      .expect(200, { response: "pong" }));
});
