import { Elysia } from "elysia";
import { webhookController } from "./controller/controller";
import openapi from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .get("/webhook", webhookController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
