import express from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import prisma from "../lib/prisma";

const indexRouter = express.Router();

// PING
indexRouter.get("/ping", (_req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Server alive!" });
});

// REGISTER
indexRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;
    try {
      const existingEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      const existingUsername = await prisma.user.findUnique({
        where: {
          email,
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

      // TODO: No bcrypt here, change later
      const user = await prisma.user.create({
        data: {
          email,
          username,
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
  }
);

// LOGIN;
indexRouter.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response, next: NextFunction) => {
    res
      .status(200)
      .json({ user: req.user || null, message: "Login successful" });
  }
);

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
indexRouter.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.send("This was sent from the server.");
});

// Check if user is logged in
indexRouter.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
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
