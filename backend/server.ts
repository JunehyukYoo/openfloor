// server.ts
const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const cors = require("cors");
const pool = require("./lib/pool").default;
const session = require("express-session");
const poolSession = require("connect-pg-simple")(session);
const passport = require("passport");
import { Request, Response, NextFunction } from "express";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(`✅ Loaded environment from ${envFile}`);

// Setup app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Setup store
const sessionStore = new poolSession({
  pool: pool,
  createTableIfMissing: true,
});

// Set up current session
// NOTE: secret should be changed for production
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production", // only over HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Initialize passport and its sessions
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Trust first proxy for production (when deploying database on PaaS)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Import and use routers
const indexRouter = require("./routes/indexRouter").default;
const uploadRouter = require("./routes/uploadRouter").default;
const profileRouter = require("./routes/profileRouter").default;
const analyticsRouter = require("./routes/analyticsRouter").default;
const debateRouter = require("./routes/debateRouter").default;
const topicRouter = require("./routes/topicRouter").default;
app.use("/api", indexRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/profile", profileRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/debates", debateRouter);
app.use("/api/topics", topicRouter);

// Handle uncaught errors
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error details:", err);
  res.status(500).json({
    message: "Unhandled Error",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

// Start server on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
