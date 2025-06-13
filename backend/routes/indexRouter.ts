import express from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { User } from "../types/index";

const indexRouter = express.Router();

// PING
indexRouter.get("/ping", (_req, res, next) => {
  res.status(200).json({ message: "Server alive!" });
});

// REGISTER
indexRouter.post("/register", async (req, res, next) => {
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
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
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
indexRouter.post("/login", passport.authenticate("local"), (req, res, next) => {
  const { password: _, ...publicUser } = req.user as User;
  res.json({ user: publicUser, message: "Login successful." });
});

// LOGOUT
indexRouter.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Logout failed" });
    } else {
      res.json({ message: "Logout successful" });
    }
  });
});

// TESTING ROUTES

// Check if user is logged in
indexRouter.get("/me", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Raw session data
indexRouter.get("/session", (req, res, next) => {
  res.json({ session: req.session });
});

// Alias for current user
indexRouter.get("/user", (req, res, next) => {
  res.json({ user: req.user || null });
});

export default indexRouter;
