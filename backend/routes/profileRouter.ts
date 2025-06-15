// profileRouter.ts
import express from "express";
import passport from "passport";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { ensureAuthenticated } from "./authMiddleware";
import type { User } from "../types/index";

const profileRouter = express.Router();

profileRouter.put("/edit", ensureAuthenticated, async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }

  const user = req.user as User;
  try {
    const { username, newPassword } = req.body;
    const updates: any = {};

    if (!username || username.length === 0) {
      res.status(400).json({ message: "Invalid username" });
      return;
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    updates.username = username;

    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      updates.password = hashed;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updates,
    });

    const { password: _, ...safeUser } = updatedUser;
    res.json({ user: safeUser, message: "Profile updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile." });
  }
});

export default profileRouter;
