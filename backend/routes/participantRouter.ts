//routes/participantRouter.ts

import express from "express";
import prisma from "../lib/prisma";
import { Role } from "../generated/prisma/client";
import { ensureAuthenticated } from "./authMiddleware";
import type { User, Topic } from "../types/index";

const router = express.Router();

router.put("/:id/role", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!Object.values(Role).includes(role)) {
    res.status(400).json({ message: "Invalid role." });
    return;
  }
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ message: "Invalid participant ID." });
    return;
  }
  try {
    const participant = await prisma.participant.update({
      where: { id: Number(id) },
      data: { role },
    });

    res.status(200).json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update participant role." });
  }
});

export default router;
