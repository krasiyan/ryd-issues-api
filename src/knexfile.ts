import { Config } from "knex";

import { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME } from "./config";

const devConfig: Config = {
  client: "postgresql",
  connection: {
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
  },
  migrations: {
    directory: "./migrations",
    tableName: "KnexMigrations",
  },
  seeds: {
    directory: "./seeds",
  },
} as const;

const testConfig: Config = {
  client: "sqlite3",
  connection: {
    filename: ":memory:",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./src/migrations",
    tableName: "KnexMigrations",
  },
  seeds: {
    directory: "./src/seeds",
  },
} as const;

interface KnexConfig {
  [key: string]: Config;
}

const config: KnexConfig = {
  development: devConfig,
  test: testConfig,
};

export default config;
