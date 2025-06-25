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

router.get("/", ensureAuthenticated, async (req, res) => {
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

router.post("/create", ensureAuthenticated, async (req, res) => {
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
  async (req, res) => {
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

router.delete(
  "/:id",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { id } = req.params;
    const user = req.user as User;

    try {
      const participant = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId: id,
          },
        },
      });

      if (participant!.role !== "CREATOR" && participant!.role !== "ADMIN") {
        res.status(401).json({
          message: "You do not have permissions to delete the debate.",
        });
        return;
      }

      await prisma.debate.delete({
        where: {
          id,
        },
      });
      res.json({ message: "Debate successfully deleted." });
    } catch (error) {
      console.error("Error deleting debate:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// NOTE: Can only join public debates, no need to check for debate authentication
router.post("/:id/join", ensureAuthenticated, async (req, res) => {
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

    res.json({ message: "Successfully joined the debate." });
  } catch (error) {
    console.error("Error joining debate:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.delete(
  "/:id/leave",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { id } = req.params;
    const user = req.user as User;
    try {
      await prisma.participant.delete({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId: id,
          },
        },
      });
      res.status(200).json({ message: "Successfully left the debate." });
    } catch (error) {
      console.error("Error leaving debate:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.put(
  "/:id/end",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { id } = req.params;
    const user = req.user as User;

    try {
      const participant = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId: id,
          },
        },
      });

      if (participant!.role === "CREATOR" || participant!.role === "ADMIN") {
        await prisma.debate.update({
          where: { id },
          data: { closed: true },
        });
        res.json({ message: "Debate ended successfully." });
      } else {
        res
          .status(401)
          .json({ message: "You do not have permissions to end the debate." });
      }
    } catch (error) {
      console.error("Error leaving debate:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Create token
router.post(
  "/:id/invites",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const user = req.user as User;
    const { id } = req.params;
    const { role } = req.body;

    try {
      const participant = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId: id,
          },
        },
      });

      if (participant!.role !== "CREATOR" && participant!.role !== "ADMIN") {
        res.status(401).json({
          message: "You do not have the permissions to create an invite link.",
        });
        return;
      }

      if (!["ADMIN", "DEBATER", "OBSERVER"].includes(role)) {
        res.status(400).json({ message: "Invalid role." });
        return;
      }

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24-hour expiry

      const invite = await prisma.inviteToken.create({
        data: {
          token,
          debateId: id,
          expiresAt,
          role,
        },
      });

      res.status(201).json({ token: invite.token, expiresAt });
    } catch (error) {
      console.error("Error creating invite token:", error);
      res.status(500).json("Internal server error.");
    }
  }
);

// Join via token
router.post("/:id/join-via-token", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;
  const user = req.user as User;

  try {
    // Validate token
    const invite = await prisma.inviteToken.findFirst({
      where: { token, debateId: id, expiresAt: { gt: new Date() } },
    });

    if (!invite) {
      res.status(400).json({ message: "Invalid or expired invite token." });
      return;
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.participant.findUnique({
      where: { userId_debateId: { userId: user.id, debateId: id } },
    });

    if (existingParticipant) {
      res.status(400).json({ message: "You are already a participant." });
      return;
    }

    // Add user as observer (public debates do not need tokens)
    await prisma.participant.create({
      data: { userId: user.id, debateId: id, role: invite.role },
    });

    res.json({ message: "Successfully joined the debate." });
  } catch (error) {
    console.error("Error joining debate via token:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get active tokens
router.get(
  "/:id/invites",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { id } = req.params;

    try {
      const tokens = await prisma.inviteToken.findMany({
        where: { debateId: id, expiresAt: { gt: new Date() } }, // Only return non-expired tokens
        select: {
          token: true,
          role: true,
          expiresAt: true,
        },
      });

      const labelMap = {
        ADMIN: "Admin",
        DEBATER: "Debater",
        OBSERVER: "Observer",
      };

      const responseMap: Record<string, string> = {};
      const FRONTEND_URL = process.env.FRONTEND_URL;
      tokens.forEach((token) => {
        const label = labelMap[token.role as keyof typeof labelMap];
        responseMap[
          label
        ] = `${FRONTEND_URL}/dashboard/debates/${id}?invite=${token.token}`;
      });

      res.json({ responseMap, expiresAt: tokens[0].expiresAt });
    } catch (error) {
      console.error("Error fetching invite tokens:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
