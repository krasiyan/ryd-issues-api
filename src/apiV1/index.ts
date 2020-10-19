import router from "koa-joi-router";

const apiV1Router = router().prefix("/apiv1");

apiV1Router.get("/ping", (ctx) => (ctx.body = "pong"));

export { apiV1Router };
