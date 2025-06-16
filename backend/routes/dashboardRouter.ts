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
    // Run basic counts in parallel
    const [
      totalDebates,
      participantStats,
      activeDebates,
      privateDebates,
      totalJustifications,
      totalComments,
      totalVotesCast,
    ] = await Promise.all([
      prisma.participant.count({ where: { userId: user.id } }),
      prisma.participant.groupBy({
        by: ["role"],
        where: { userId: user.id },
        _count: true,
      }),
      prisma.participant.count({
        where: {
          userId: user.id,
          debate: { closed: false },
        },
      }),
      prisma.participant.count({
        where: {
          userId: user.id,
          debate: { private: true },
        },
      }),
      prisma.justification.count({ where: { authorId: user.id } }),
      prisma.comment.count({ where: { authorId: user.id } }),
      prisma.vote.count({ where: { userId: user.id } }),
    ]);

    // Topic most participated in
    const userParticipations = await prisma.participant.findMany({
      where: { userId: user.id },
      include: {
        debate: {
          include: { topic: true },
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

    // Avg votes per justification + most upvoted justification
    const justifications = await prisma.justification.findMany({
      where: { authorId: user.id },
      include: {
        votes: true,
        stance: {
          include: { topic: true },
        },
      },
    });

    const totalVoteValue = justifications.reduce(
      (sum, j) => sum + j.votes.reduce((vSum, v) => vSum + v.value, 0),
      0
    );
    const avgVotes =
      justifications.length > 0
        ? Math.round((totalVoteValue / justifications.length) * 100) / 100
        : 0;

    let topJustification = null;
    let maxVotes = -Infinity;

    for (const j of justifications) {
      const voteSum = j.votes.reduce((sum, v) => sum + v.value, 0);
      if (voteSum > maxVotes) {
        maxVotes = voteSum;
        topJustification = {
          id: j.id,
          content: j.content,
          voteSum,
          stance: j.stance?.label || null,
          topic: j.stance?.topic?.title || null,
        };
      }
    }

    // Send final structured response
    res.json({
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
