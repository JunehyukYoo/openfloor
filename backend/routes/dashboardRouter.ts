// dashboardRouter.ts
import express from "express";
import prisma from "../lib/prisma";
import { Role } from "../generated/prisma/client";
import {
  ensureAuthenticated,
  ensureDebateAuthenticated,
} from "./authMiddleware";
import type { User, Topic } from "../types/index";

const router = express.Router();

// -- DEBATES --
router.get("/debates", ensureAuthenticated, async (req, res, next) => {
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

router.post("/debates/create", ensureAuthenticated, async (req, res, next) => {
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
  "/debates/:id",
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
      const userRole = await prisma.participant.findUnique({
        where: {
          userId_debateId: {
            userId: (req.user as User).id,
            debateId: id,
          },
        },
        select: {
          role: true,
        },
      });
      res.json({ debate, userRole: userRole?.role || Role.OBSERVER });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// -- TOPICS --
router.get("/topics", ensureAuthenticated, async (req, res, next) => {
  const user = req.user as User;
  try {
    const [allTopicsRaw, trendingTopicsRaw] = await Promise.all([
      prisma.topic.findMany({
        orderBy: {
          debates: {
            _count: "desc",
          },
        },
        include: {
          _count: {
            select: { debates: true },
          },
          debates: {
            where: {
              private: false,
            },
            include: {
              _count: {
                select: { participants: true },
              },
              creator: {
                select: { username: true },
              },
            },
          },
        },
      }),
      prisma.topic.findMany({
        include: {
          _count: {
            select: { debates: true },
          },
          debates: {
            where: {
              private: false,
              started: {
                gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // last 7 days
              },
            },
            include: {
              _count: {
                select: { participants: true },
              },
              creator: {
                select: { username: true },
              },
            },
          },
        },
      }),
    ]);

    const userTopicIds = await prisma.participant.findMany({
      where: { userId: user.id },
      select: {
        debate: {
          select: { topicId: true },
        },
      },
    });
    const seenTopicIds = userTopicIds.map((p) => p.debate.topicId);

    const recommendedTopicsRaw = await prisma.topic.findMany({
      where: {
        id: { notIn: seenTopicIds },
      },
      include: {
        _count: {
          select: { debates: true },
        },
        debates: {
          where: { private: false },
          include: {
            _count: {
              select: { participants: true },
            },
            creator: {
              select: { username: true },
            },
          },
        },
      },
      orderBy: {
        debates: {
          _count: "desc",
        },
      },
      take: 4,
    });

    const allTopics = allTopicsRaw.map((t) => ({
      id: t.id,
      title: t.title,
      totalCount: t._count.debates,
      debates: t.debates.map((debate) => ({
        id: debate.id,
        private: debate.private,
        started: debate.started,
        closed: debate.closed,
        topicId: debate.topicId,
        participantCount: debate._count.participants,
        creatorId: debate.creatorId,
        creatorUsername: debate.creator.username,
      })),
    }));

    // Trending topiocs sorted based on number of recent debates
    const trendingTopics = trendingTopicsRaw
      .map((t) => ({
        id: t.id,
        title: t.title,
        totalCount: t._count.debates,
        recentPublicDebateCount: t.debates.length,
        debates: t.debates.map((debate) => ({
          id: debate.id,
          private: debate.private,
          started: debate.started,
          closed: debate.closed,
          topicId: debate.topicId,
          participantCount: debate._count.participants,
          creatorId: debate.creatorId,
          creatorUsername: debate.creator.username,
        })),
      }))
      .sort((a, b) => b.recentPublicDebateCount - a.recentPublicDebateCount)
      .slice(0, 4);

    const recommendedTopics = recommendedTopicsRaw.map((t) => ({
      id: t.id,
      title: t.title,
      totalCount: t._count.debates,
      debates: t.debates.map((debate) => ({
        id: debate.id,
        private: debate.private,
        started: debate.started,
        closed: debate.closed,
        topicId: debate.topicId,
        participantCount: debate._count.participants,
        creatorId: debate.creatorId,
        creatorUsername: debate.creator.username,
      })),
    }));
    res.json({ allTopics, trendingTopics, recommendedTopics });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// For creating a debate after selecting a topic
router.get("/topics/all", ensureAuthenticated, async (req, res, next) => {
  try {
    const allTopics = await prisma.topic.findMany();
    res.json({ allTopics });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// -- ANALYTICS --
router.get("/analytics", ensureAuthenticated, async (req, res) => {
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
