import koa, { Middleware } from "koa";
import koaLogger from "koa-logger";

import { apiV1Router } from "./apiV1";

const errorMiddleware: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // handle Joi validation error
    if (err.isJoi) {
      ctx.status = err.statusCode;
      ctx.body = {
        name: err.name,
        details: err.details,
        msg: err.msg,
      };
      return;
    }

    // handle misc bad request errors (i.e. invalid JSON req. body)
    if (err?.statusCode === 400 && err.msg) {
      ctx.status = err.statusCode;
      ctx.body = {
        msg: err.msg,
      };
      return;
    }

    console.error("unexpected API error", err);
    ctx.status = 500;
  }
};

const app = new koa();
app.use(koaLogger());
app.use(errorMiddleware);
app.use(apiV1Router.middleware());

export { app };
