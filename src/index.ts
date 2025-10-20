import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";
import z from "zod";
import { env } from "./env";

const app = new Elysia({ name: "elysia-template" })
  .use(logixlysia({
    config: {
      showStartupMessage: true,
      startupMessageFormat: 'simple',
      timestamp: {
        translateTime: 'yyyy-mm-dd HH:MM:ss'
      },
      ip: true,
      customLogFormat:
        '🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}',
      logFilter: {
        level: ['ERROR', 'WARNING'],
        status: [500, 404],
        method: 'GET'
      }
    }
  }))
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
    })
  )
  .use(
    openapi({
      path: "/docs",
      references: fromTypes(),
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    })
  )
  .get("/", () => "OK")
  .get("/health", () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))
  .listen(env.PORT);

export default app;
