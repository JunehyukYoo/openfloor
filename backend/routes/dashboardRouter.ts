import express from "express";
import prisma from "../lib/prisma";
import { ensureAuthenticated } from "./authMiddleware";
import type { User, Topic } from "../types/index";

const router = express.Router();

// -- DEBATES --
router.get("/debates", ensureAuthenticated, (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }
  const user = req.user as User;
  res.json({ message: "testing" });
});

// -- TOPICS --
router.get("/topics", ensureAuthenticated, async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }
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

// -- ANALYTICS --
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

    // Activity over time (for graph)
    const allEvents = [
      ...debateActivity.map((d) => ({ createdAt: d.started, type: "debate" })),
      ...justificationActivity.map((j) => ({
        createdAt: j.createdAt,
        type: "justification",
      })),
      ...commentActivity.map((c) => ({
        createdAt: c.createdAt,
        type: "comment",
      })),
      ...voteActivity.map((v) => ({ createdAt: v.createdAt, type: "vote" })),
    ];

    // Accumulate counts by date and type
    const activityMap = allEvents.reduce(
      (acc, { createdAt, type }) => {
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
      },
      {} as Record<
        string,
        {
          date: string;
          debates: number;
          justifications: number;
          comments: number;
          votes: number;
        }
      >
    );

    // Convert to sorted array
    const activityOverTime = Object.values(activityMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

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
      activityOverTime,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
