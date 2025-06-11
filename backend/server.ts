// server.ts

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const pg = require("./lib/pool");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");

const app = express();

// Set up cors
// NOTE: origin url should be changed for production
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Setup store
const sessionStore = new pgSession({
  pool: pg,
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
app.use(passport.initialize());
app.use(passport.session());

// MOCK LOCAL STRATEGY
// TODO: Remove later in development
const mockStrategy = require("./utils/passport-local-strategy").default;

passport.use(mockStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pg.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Trust first proxy for production (when deploying database on PaaS)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Currently setting up a test route
app.get("/test", (req, res) => {
  res.send("This was sent from the server.");
});

// Start server on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
