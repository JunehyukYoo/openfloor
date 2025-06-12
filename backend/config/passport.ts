// passport.ts
require("dotenv").config();
const pool = require("../lib/pool").default;
import passport from "passport";
const LocalStrategy = require("passport-local").Strategy;
import bcrypt from "bcryptjs";
import type { User } from "../types/index";

interface DoneFunction {
  (error: any, user?: User | false, options?: { message: string }): void;
}

const customFields = {
  usernameField: "email",
};

const strategyWithEncryption = new LocalStrategy(
  customFields,
  async (username: string, password: string, done: DoneFunction) => {
    try {
      const { rows }: { rows: User[] } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// Simple local strategy without password encryption
// NOTE: This is for testing purposes only and should not be used in production
const mockStrategy = new LocalStrategy(
  customFields,
  async (username: string, password: string, done: DoneFunction) => {
    console.log("Using mock local strategy without encryption");
    console.log("Username:", username);
    console.log("Password:", password);
    try {
      const { rows }: { rows: User[] } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [username]
      );
      const user: User | undefined = rows[0];
      console.log("Found user in strategy:", user);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

passport.use(mockStrategy);

passport.serializeUser((user: any, done: any) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  console.log("Deserializing user with ID:", id);
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
