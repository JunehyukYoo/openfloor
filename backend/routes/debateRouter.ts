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
  "/:debateId",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const { debateId } = req.params;
    try {
      const debate = await prisma.debate.findUnique({
        where: {
          id: debateId,
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
              justifications: {
                include: { author: true, votes: true, comments: true },
              },
            },
          },
        },
      });
      const userDetails = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: (req.user as User).id,
            debateId,
          },
        },
      });

      res.json({ debate, userDetails });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.get(
  "/:debateId/support",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    try {
      const { debateId } = req.params;
      const user = req.user as User;
      const justificationVotes = await prisma.vote.groupBy({
        by: ["justificationId"],
        _sum: { value: true },
      });

      const justifications = await prisma.justification.findMany({
        where: { stance: { debateId } },
        select: { id: true, stanceId: true },
      });

      const stanceSupportMap: Record<number, number> = {};

      justifications.forEach((justification) => {
        const voteSum =
          justificationVotes.find((v) => v.justificationId === justification.id)
            ?._sum.value || 0;

        if (stanceSupportMap[justification.stanceId]) {
          stanceSupportMap[justification.stanceId] += voteSum;
        } else {
          stanceSupportMap[justification.stanceId] = voteSum;
        }
      });

      const stances = await prisma.stance.findMany({
        where: { debateId },
        select: { id: true, label: true },
      });

      const supportMap = stances.map((stance) => ({
        stanceId: stance.id,
        stanceLabel: stance.label,
        supportCount: stanceSupportMap[stance.id] || 0,
      }));
      res.json({ supportMap });
    } catch (error) {
      console.error("Error deleting debate:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.delete(
  "/:debateId",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { debateId } = req.params;
    const user = req.user as User;

    try {
      const participant = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId,
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
          id: debateId,
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
router.post("/:debateId/join", ensureAuthenticated, async (req, res) => {
  const { debateId } = req.params;
  const user = req.user as User;

  try {
    const existingParticipant = await prisma.participant.findUnique({
      where: { userId_debateId: { userId: user.id, debateId } },
    });

    if (existingParticipant) {
      res.status(400).json({ message: "You are already a participant." });
      return;
    }
    await prisma.participant.create({
      data: {
        userId: user.id,
        debateId,
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
  "/:debateId/leave",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { debateId } = req.params;
    const user = req.user as User;
    try {
      await prisma.participant.delete({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId,
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
  "/:debateId/end",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { debateId } = req.params;
    const user = req.user as User;

    try {
      const participant = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId,
          },
        },
      });

      if (participant!.role === "CREATOR" || participant!.role === "ADMIN") {
        await prisma.debate.update({
          where: { id: debateId },
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
  "/:debateId/invites",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const user = req.user as User;
    const { debateId } = req.params;
    const { role } = req.body;

    try {
      const participant = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: user.id,
            debateId,
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
          debateId,
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
router.post(
  "/:debateId/join-via-token",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { debateId } = req.params;
    const { token } = req.body;
    const user = req.user as User;

    try {
      // Validate token
      const invite = await prisma.inviteToken.findFirst({
        where: { token, debateId, expiresAt: { gt: new Date() } },
      });

      if (!invite) {
        res.status(400).json({ message: "Invalid or expired invite token." });
        return;
      }

      // Check if user is already a participant
      const existingParticipant = await prisma.participant.findUnique({
        where: { userId_debateId: { userId: user.id, debateId } },
      });

      if (existingParticipant) {
        res.status(400).json({ message: "You are already a participant." });
        return;
      }

      // Add user as observer (public debates do not need tokens)
      await prisma.participant.create({
        data: { userId: user.id, debateId, role: invite.role },
      });

      res.json({ message: "Successfully joined the debate." });
    } catch (error) {
      console.error("Error joining debate via token:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Get active tokens
router.get(
  "/:debateId/invites",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { debateId } = req.params;

    try {
      const tokens = await prisma.inviteToken.findMany({
        where: { debateId, expiresAt: { gt: new Date() } }, // Only return non-expired tokens
        select: {
          token: true,
          role: true,
          expiresAt: true,
        },
      });

      if (tokens.length === 0) {
        res
          .status(404)
          .json({ message: "You need to create new invite links." });
        return;
      }

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
        ] = `${FRONTEND_URL}/dashboard/debates/${debateId}?invite=${token.token}`;
      });

      res.json({ responseMap, expiresAt: tokens[0].expiresAt });
    } catch (error) {
      console.error("Error fetching invite tokens:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// PARTICIPANT ROUTES
// Change participant role
router.put(
  "/:debateId/participants/:participantId/role",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    const { participantId } = req.params;
    const { role } = req.body;

    if (!Object.values(Role).includes(role)) {
      res.status(400).json({ message: "Invalid role." });
      return;
    }
    if (!participantId || isNaN(Number(participantId))) {
      res.status(400).json({ message: "Invalid participant ID." });
      return;
    }
    try {
      const participant = await prisma.participant.update({
        where: { id: Number(participantId) },
        data: { role },
      });

      res.status(200).json(participant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update participant role." });
    }
  }
);

// Remove participant
router.delete(
  "/:debateId/participants/:participantId",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    try {
      const { debateId, participantId } = req.params;

      // Check if the participant exists in this debate
      const participant = await prisma.participant.findUnique({
        where: { id: Number(participantId) },
      });

      if (!participant) {
        res.status(404).json({ message: "Participant not found." });
        return;
      }

      // Check if participant is actually in this debate
      if (participant.debateId !== debateId) {
        res
          .status(400)
          .json({ message: "Participant does not belong to this debate." });
        return;
      }

      // Prevent removing the debate creator
      if (participant.role === "CREATOR") {
        res.status(403).json({ message: "Cannot remove the debate creator." });
        return;
      }

      // Delete the participant
      await prisma.participant.delete({
        where: { id: Number(participantId) },
      });

      res.status(200).json({ message: "Participant removed successfully." });
    } catch (error) {
      console.error("Error removing participant:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// STANCE ROUTES
// Stance edit form submission
router.put(
  "/:debateId/stances",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    try {
      const { debateId } = req.params;
      const { updatedStances, stancesToDelete } = req.body;

      // Validate arrays
      if (!Array.isArray(updatedStances) || !Array.isArray(stancesToDelete)) {
        res.status(400).json({ message: "Invalid input format." });
        return;
      }

      // Update stance labels
      for (const stance of updatedStances) {
        await prisma.stance.update({
          where: { id: stance.id },
          data: { label: stance.label },
        });
      }

      // Delete stances
      if (stancesToDelete.length > 0) {
        await prisma.stance.deleteMany({
          where: {
            id: { in: stancesToDelete },
            debateId: debateId,
          },
        });
      }

      res.status(200).json({ message: "Stances updated successfully." });
    } catch (error) {
      console.error("Error updating stances:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.post(
  "/:debateId/stances",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    try {
      const { debateId } = req.params;
      const { stances } = req.body;

      // Validate request body
      if (
        !Array.isArray(stances) ||
        stances.some(
          (label) => typeof label !== "string" || label.trim().length === 0
        )
      ) {
        res.status(400).json({ message: "Stances must be non-empty strings." });
        return;
      }

      // Enforce character limit
      const MAX_LENGTH = 100;
      if (stances.some((label) => label.length > MAX_LENGTH)) {
        res
          .status(400)
          .json({ message: `Stances cannot exceed ${MAX_LENGTH} characters.` });
        return;
      }

      // Create new stances
      const newStances = await prisma.stance.createMany({
        data: stances.map((label) => ({
          label: label.trim(),
          debateId: debateId,
        })),
      });

      res.status(201).json({
        message: "Stances created successfully.",
        stances: newStances,
      });
    } catch (error) {
      console.error("Error adding stances:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// VOTE ROUTES
// Create Vote
router.post(
  "/:debateId/justification/:justificationId/votes",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    try {
      const { debateId, justificationId } = req.params;
      const { value } = req.body;
      const user = req.user as User;

      // Check if user already voted here (double protection)
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId_justificationId: {
            userId: user.id,
            justificationId: Number(justificationId),
          },
        },
      });

      if (existingVote) {
        res
          .status(400)
          .json({ message: "You have already voted on this justification." });
        return;
      }

      const vote = await prisma.vote.create({
        data: {
          userId: user.id,
          justificationId: Number(justificationId),
          value,
        },
      });

      res.status(201).json({ vote });
    } catch (error) {
      console.error("Error creating vote:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Delete Vote
router.delete(
  "/:debateId/justification/:justificationId/votes/:voteId",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    try {
      const { debateId, justificationId, voteId } = req.params;
      const user = req.user as User;

      // Optional: Make sure the vote belongs to this user
      const vote = await prisma.vote.findUnique({
        where: { id: Number(voteId) },
      });

      if (!vote || vote.userId !== user.id) {
        res
          .status(403)
          .json({ message: "Not authorized to delete this vote." });
        return;
      }

      await prisma.vote.delete({
        where: { id: Number(voteId) },
      });

      res.status(200).json({ message: "Vote deleted successfully." });
    } catch (error) {
      console.error("Error deleting vote:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Update Vote
router.put(
  "/:debateId/justification/:justificationId/votes/:voteId",
  ensureAuthenticated,
  ensureDebateAuthenticated,
  async (req, res) => {
    try {
      const { voteId } = req.params;
      const { value } = req.body;
      const user = req.user as User;

      const vote = await prisma.vote.findUnique({
        where: { id: Number(voteId) },
      });

      if (!vote || vote.userId !== user.id) {
        res
          .status(403)
          .json({ message: "Not authorized to update this vote." });
        return;
      }

      const updatedVote = await prisma.vote.update({
        where: { id: Number(voteId) },
        data: { value },
      });

      res.status(200).json({ vote: updatedVote });
    } catch (error) {
      console.error("Error updating vote:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
