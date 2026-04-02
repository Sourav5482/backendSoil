import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { soilRouter } from "./routes/soil.routes.js";

const app = express();

app.use(cors({ origin: env.clientAppOrigin === "*" ? true : env.clientAppOrigin }));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "soil-monitoring-backend" });
});

app.use("/api", soilRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
