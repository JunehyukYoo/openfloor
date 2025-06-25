// indexRouter.ts
import express from "express";
import passport from "passport";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { User } from "../types/index";

const router = express.Router();

// PING
router.get("/ping", (_req, res, next) => {
  res.status(200).json({ message: "Server alive!" });
});

// REGISTER
router.post("/register", async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingEmail) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    if (existingUsername) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicture =
      process.env.CDN_DOMAIN_NAME + "/profile-pictures/default.png";
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profilePicture: profilePicture,
      },
    });
    const { password: _, ...publicUser } = user;
    res.status(201).json({ message: "User created", user: publicUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration error" });
  }
});

// LOGIN;
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: any, user: User | false, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Auth failed
        const msg = info?.message ?? "Login failed";
        return res.status(401).json({ message: msg });
      }
      // Success path—establish session
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        const { password: _, ...publicUser } = user as any;
        return res.json({ user: publicUser, message: "Login successful." });
      });
    }
  )(req, res, next);
});

// LOGOUT
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Logout failed" });
    } else {
      res.json({ message: "Logout successful" });
    }
  });
});

// QUOTE (for debates page)
let cachedQuote: any = null;
let cachedAt: number | null = null;
router.get("/quote", async (req, res) => {
  try {
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (cachedQuote && cachedAt && now - cachedAt < ONE_DAY) {
      res.json(cachedQuote);
      return;
    }

    const response = await fetch(
      "https://thequoteshub.com/api/tags/knowledge?page=1&page_size=50&format=json"
    );
    const data = await response.json();
    const randomQuote =
      data.quotes[Math.floor(Math.random() * data.quotes.length)];

    cachedQuote = randomQuote;
    cachedAt = now;

    res.json(randomQuote);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

// AUTH & PROFILE ROUTES

// Check if user is logged in
router.get("/me", (req, res, next) => {
  if (req.user) {
    const { password, ...safeUser } = req.user as User;
    res.status(200).json({ user: safeUser });
  } else {
    res.status(401).json({ user: null });
  }
});

// Raw session data
router.get("/session", (req, res, next) => {
  res.json({ session: req.session });
});

export default router;
