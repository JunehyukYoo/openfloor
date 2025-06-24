// routes/analyticsRouter.ts
import express from "express";
import prisma from "../lib/prisma";
import { ensureAuthenticated } from "./authMiddleware";
import type { User, Topic } from "../types/index";

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  const user = req.user as User;

  try {
    // === BASIC COUNTS IN PARALLEL ===
    const [
      totalDebates,
      participantStats,
      activeDebates,
      privateDebates,
      totalJustifications,
      totalComments,
      totalVotesCast,
      debateActivity,
      justificationActivity,
      commentActivity,
      voteActivity,
    ] = await Promise.all([
      prisma.participant.count({ where: { userId: user.id } }),
      prisma.participant.groupBy({
        by: ["role"],
        where: { userId: user.id },
        _count: true,
      }),
      prisma.participant.count({
        where: { userId: user.id, debate: { closed: false } },
      }),
      prisma.participant.count({
        where: { userId: user.id, debate: { private: true } },
      }),
      prisma.justification.count({ where: { authorId: user.id } }),
      prisma.comment.count({ where: { authorId: user.id } }),
      prisma.vote.count({ where: { userId: user.id } }),
      prisma.debate.findMany({
        where: { creatorId: user.id },
        select: { started: true },
      }),
      prisma.justification.findMany({
        where: { authorId: user.id },
        select: { createdAt: true },
      }),
      prisma.comment.findMany({
        where: { authorId: user.id },
        select: { createdAt: true },
      }),
      prisma.vote.findMany({
        where: { userId: user.id },
        select: { createdAt: true },
      }),
    ]);

    // TOPIC MOST PARTICIPATED IN
    const mostParticipatedTopic = await getMostParticipatedTopic(user.id);

    // VOTES PER JUSTIFICATION & MOST UPVOTED
    const { avgVotesPerJustification, topJustification } =
      await getJustificationStats(user.id);

    // ACTIVITY OVER TIME
    const activityOverTime = buildActivityOverTime({
      debates: debateActivity,
      justifications: justificationActivity,
      comments: commentActivity,
      votes: voteActivity,
    });

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
        avgVotesPerJustification,
        topJustification,
      },
      activityOverTime,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

async function getMostParticipatedTopic(userId: string) {
  const userParticipations = await prisma.participant.findMany({
    where: { userId },
    include: { debate: { include: { topic: true } } },
  });

  const topicCountMap = new Map<string, { count: number; topic: Topic }>();

  for (const p of userParticipations) {
    const topicId = p.debate.topic.id.toString();
    const existing = topicCountMap.get(topicId);
    if (existing) {
      existing.count++;
    } else {
      topicCountMap.set(topicId, { count: 1, topic: p.debate.topic });
    }
  }

  const sorted = [...topicCountMap.values()].sort((a, b) => b.count - a.count);
  return sorted.length > 0 ? sorted[0] : null;
}

async function getJustificationStats(userId: string) {
  const justifications = await prisma.justification.findMany({
    where: { authorId: userId },
    include: {
      votes: true,
      stance: {
        include: {
          debate: {
            include: { topic: true },
          },
        },
      },
    },
  });

  const totalVoteValue = justifications.reduce(
    (sum, j) => sum + j.votes.reduce((vSum, v) => vSum + v.value, 0),
    0
  );

  const avgVotesPerJustification =
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
        topic: j.stance?.debate?.topic?.title || null,
      };
    }
  }

  return { avgVotesPerJustification, topJustification };
}

function buildActivityOverTime({
  debates,
  justifications,
  comments,
  votes,
}: {
  debates: { started: Date }[];
  justifications: { createdAt: Date }[];
  comments: { createdAt: Date }[];
  votes: { createdAt: Date }[];
}) {
  const allEvents = [
    ...debates.map((d) => ({ createdAt: d.started, type: "debate" })),
    ...justifications.map((j) => ({
      createdAt: j.createdAt,
      type: "justification",
    })),
    ...comments.map((c) => ({ createdAt: c.createdAt, type: "comment" })),
    ...votes.map((v) => ({ createdAt: v.createdAt, type: "vote" })),
  ];

  const activityMap = allEvents.reduce((acc, { createdAt, type }) => {
    const date = createdAt.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        debates: 0,
        justifications: 0,
        comments: 0,
        votes: 0,
      };
    }
    if (type === "debate") acc[date].debates++;
    if (type === "justification") acc[date].justifications++;
    if (type === "comment") acc[date].comments++;
    if (type === "vote") acc[date].votes++;
    return acc;
  }, {} as Record<string, { date: string; debates: number; justifications: number; comments: number; votes: number }>);

  return Object.values(activityMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export default router;
