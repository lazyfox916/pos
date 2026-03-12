import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import { router } from "./routes.js";

dotenv.config();

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json());

// Baseline rate limiting (MemoryStore in dev; Redis store can be plugged in later)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

const configuredCorsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);

      if (configuredCorsOrigin) {
        return cb(null, origin === configuredCorsOrigin);
      }

      const isLocalhost =
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
      return cb(null, isLocalhost);
    },
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(router);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not Found", path: req.path });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

