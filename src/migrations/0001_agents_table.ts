import * as Knex from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("agents", (table: Knex.TableBuilder) => {
    table.increments("id");
    table.string("name", 255).notNullable();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("agents");
