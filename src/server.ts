import koa from "koa";
import koaLogger from "koa-logger";

import { apiV1Router } from "./apiV1";

const app = new koa();
app.use(koaLogger());
app.use(apiV1Router.middleware());

export { app };
