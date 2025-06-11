import express from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import prisma from "../lib/prisma";

const indexRouter = express.Router();

indexRouter.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server alive!" });
});

// AUTHENTICATION
indexRouter.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: "Authorized" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// REGISTER
indexRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // NOTE: No bcrypt here, change later
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    req.login(user, (err) => {
      if (err)
        res.status(500).json({ message: "Login after registration failed" });
      else res.json({ message: "Registration successful", user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration error" });
  }
});

// LOGIN
indexRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
  console.log("User logged in:", req.user);
});

// LOGOUT
indexRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Logout failed" });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });
});

// TESTING ROUTES

indexRouter.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.send("This was sent from the server.");
});

// Check if user is logged in
indexRouter.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Boolean-style check
indexRouter.get("/is-authenticated", (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});

// Raw session data
indexRouter.get("/session", (req, res) => {
  res.json({ session: req.session });
});

// Alias for current user
indexRouter.get("/user", (req, res) => {
  res.json({ user: req.user || null });
});

export default indexRouter;
