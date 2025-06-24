// routes/debateRouter.ts

import express from "express";
import prisma from "../lib/prisma";
import { Role } from "../generated/prisma/client";
import {
  ensureAuthenticated,
  ensureDebateAuthenticated,
} from "./authMiddleware";
import type { User, Topic } from "../types/index";

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res, next) => {
  const user = req.user as User;
  try {
    const createdDebates = await prisma.participant.findMany({
      where: {
        userId: user.id,
        role: Role.CREATOR,
      },
      include: {
        debate: {
          include: {
            creator: true,
            topic: true,
          },
        },
      },
    });
    const joinedDebates = await prisma.participant.findMany({
      where: {
        userId: user.id,
        debate: {
          creatorId: {
            not: user.id,
          },
        },
      },
      include: {
        debate: {
          include: {
            creator: true,
            topic: true,
          },
        },
      },
    });
    res.json({ createdDebates, joinedDebates });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/create", ensureAuthenticated, async (req, res, next) => {
  const user = req.user as User;
  const { topicId, isPrivate } = req.body;
  if (!topicId || isNaN(topicId)) {
    res.status(400).json({ error: "Invalid topic ID." });
    return;
  }
  try {
    const debate = await prisma.debate.create({
      data: {
        topicId,
        creatorId: user.id,
        private: isPrivate,
      },
    });
    await prisma.participant.create({
      data: {
        userId: user.id,
        debateId: debate.id,
        role: Role.CREATOR,
      },
    });
    res.status(201).json({ message: "Debate created", debateId: debate.id });
    console.log(
      `New ${isPrivate === true ? "private" : "public"} debate created by ${
        user.username
      } (id: ${user.id}) for topicId: ${topicId}`
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get(
  "/:id",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const { id } = req.params;
    try {
      const debate = await prisma.debate.findUnique({
        where: {
          id: id,
        },
        include: {
          topic: true,
          participants: {
            include: {
              user: true,
            },
          },
          creator: true,
          stances: {
            include: {
              justifications: { include: { votes: true, comments: true } },
            },
          },
        },
      });
      const userDetails = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: (req.user as User).id,
            debateId: id,
          },
        },
      });

      res.json({ debate, userDetails });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// NOTE: Can only join public debates, no need to check for debate authentication
router.post("/:id/join", ensureAuthenticated, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }
  const { id } = req.params;
  const user = req.user as User;

  try {
    const existingParticipant = await prisma.participant.findUnique({
      where: { userId_debateId: { userId: user.id, debateId: id } },
    });

    if (existingParticipant) {
      res.status(400).json({ message: "You are already a participant." });
      return;
    }
    await prisma.participant.create({
      data: {
        userId: user.id,
        debateId: id,
        role: "DEBATER",
      },
    });

    res.status(200).json({ message: "Successfully joined the debate." });
  } catch (error) {
    console.error("Error joining debate:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
