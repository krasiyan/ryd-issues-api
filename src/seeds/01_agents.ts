import * as Knex from "knex";
import { name as fakeName } from "faker";

export const seedAgentsCount = 3;

export const seed = async (knex: Knex): Promise<void> => {
  await knex("issues").del();
  await knex("agents").del();
  await Promise.all(
    Array(seedAgentsCount)
      .fill(undefined)
      .map(() =>
        knex
          .insert({
            name: fakeName.findName(),
          })
          .into("agents")
      )
  );
};
