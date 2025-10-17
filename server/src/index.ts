import { Elysia } from "elysia";
import { webhookController } from "./controller/controller";
import openapi from "@elysiajs/openapi";
import type { Server } from "elysia/universal";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

const app = new Elysia()
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .get("/webhook", webhookController)
  .listen(PORT, (server: Server) => {
    const { hostname, port } = server;
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
