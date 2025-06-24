// routes/topicRouter.ts

import express from "express";
import prisma from "../lib/prisma";
import { ensureAuthenticated } from "./authMiddleware";
import type { User } from "../types/index";

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res, next) => {
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
router.get("/all", ensureAuthenticated, async (req, res, next) => {
  try {
    const allTopics = await prisma.topic.findMany();
    res.json({ allTopics });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
