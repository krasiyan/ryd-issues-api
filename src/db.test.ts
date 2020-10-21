import { knex } from "./db";
import { seedAgentsCount } from "./seeds/01_agents";

describe("knex db connector", () => {
  afterAll(() => knex.destroy());

  test("migrates up", async () => {
    await knex.migrate.latest();
  });

  test("seeds the db (agents)", async () => {
    await knex.seed.run();
    const seedAgents = await knex("agents").select("*");
    expect(seedAgents.length).toEqual(seedAgentsCount);
  });

  test("migrates down", async () => {
    await knex.migrate.rollback();
  });

  test("migrates up and down (pass 2)", async () => {
    await knex.migrate.latest();
    await knex.migrate.rollback();
  });
});
