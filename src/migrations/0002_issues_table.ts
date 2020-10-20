import * as Knex from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("issues", (table: Knex.TableBuilder) => {
    table.increments("id");
    table.string("title", 255).notNullable();
    table.string("description", 10000).notNullable();
    table.enu("status", ["new", "assigned", "resolved"]);
    table.integer("agentId").unsigned().nullable();
    table.string("agentName", 255);

    table.foreign("agentId").references("id").inTable("agents");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("issues");
