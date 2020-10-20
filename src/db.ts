import Knex from "knex";

import config from "./knexfile";

const env = process.env.NODE_ENV || "development";

if (!(env in config)) {
  throw new Error(`missing DB config for environment ${env}`);
}

export const knex = Knex(config[env]);
