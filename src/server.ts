import koa from "koa";

import { apiV1Router } from "./apiV1";

const app = new koa();
app.use(apiV1Router.middleware());

export { app };
