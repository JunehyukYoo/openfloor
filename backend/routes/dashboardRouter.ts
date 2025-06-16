import express from "express";
import prisma from "../lib/prisma";
import { ensureAuthenticated } from "./authMiddleware";
import type { User, Topic } from "../types/index";

const router = express.Router();

router.get("/analytics", ensureAuthenticated, async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }
  const user = req.user as User;
  try {
    // DEBATE STATS
    const totalDebates = await prisma.participant.count({
      where: { userId: user.id },
    });
    const participantStats = await prisma.participant.groupBy({
      by: ["role"],
      where: {
        userId: user.id,
      },
      _count: true,
    });
    const activeDebates = await prisma.participant.count({
      where: {
        userId: user.id,
        debate: { closed: false },
      },
    });
    const privateDebates = await prisma.participant.count({
      where: {
        userId: user.id,
        debate: { private: true },
      },
    });

    // CONTRIBUTION STATS
    const totalJustifications = await prisma.justification.count({
      where: { authorId: user.id },
    });
    const totalComments = await prisma.comment.count({
      where: { authorId: user.id },
    });
    const totalVotesCast = await prisma.vote.count({
      where: { userId: user.id },
    });

    // QUALITY / ENGAGEMENT STATS (HIGHLIGHTS)

    // Calculates the topic most participated in for user
    const userParticipations = await prisma.participant.findMany({
      where: { userId: user.id },
      include: {
        debate: {
          include: {
            topic: true,
          },
        },
      },
    });

    const topicMap = new Map<string, { count: number; topic: Topic }>();

    for (const p of userParticipations) {
      const topicId = p.debate.topic.id.toString();
      const existing = topicMap.get(topicId);
      if (existing) {
        existing.count++;
      } else {
        topicMap.set(topicId, { count: 1, topic: p.debate.topic });
      }
    }

    const sorted = [...topicMap.values()].sort((a, b) => b.count - a.count);
    const mostParticipatedTopic = sorted.length > 0 ? sorted[0] : null;

    // Calculates average vote per justification for user
    const justifications = await prisma.justification.findMany({
      where: { authorId: user.id },
      include: { votes: true },
    });
    const totalVotes = justifications.reduce(
      (sum, j) => sum + j.votes.reduce((vSum, v) => vSum + v.value, 0),
      0
    );
    const avgVotes =
      justifications.length > 0 ? totalVotes / justifications.length : 0;

    // Calculates most upvoted justification for user
    let topJustification = null;
    let maxVotes = -Infinity;

    for (const j of justifications) {
      const sumVotes = j.votes.reduce((sum, v) => sum + v.value, 0);
      if (sumVotes > maxVotes) {
        maxVotes = sumVotes;
        topJustification = { ...j, voteTotal: sumVotes };
      }
    }

    console.log({
      participation: {
        totalDebates,
        participantStats,
        activeDebates,
        privateDebates,
      },
      contributions: {
        totalJustifications,
        totalComments,
        totalVotesCast,
      },
      highlights: {
        mostParticipatedTopic,
        avgVotesPerJustification: avgVotes,
        topJustification,
      },
    });

    res.json({ message: "Testing analytics route" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
