// passport.ts
require("dotenv").config();
import prisma from "../lib/prisma";
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

// Local strategy with password encryption using bcrypt
const strategyWithEncryption = new LocalStrategy(
  customFields,
  async (email: string, password: string, done: DoneFunction) => {
    console.log("Using strategy with encryption");
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return done(null, false, { message: "Incorrect email/username" });
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
      const user = await prisma.user.findUnique({ where: { username } });
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

passport.use(strategyWithEncryption);

passport.serializeUser((user: any, done: any) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
