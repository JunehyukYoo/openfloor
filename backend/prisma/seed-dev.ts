// prisma/seed-dev.ts
import "dotenv/config";
import { Role } from "../generated/prisma";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { User } from "../types/index";

const daysAgo = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * n);

export async function seed() {
  const profilePicture =
    process.env.CDN_DOMAIN_NAME + "/profile-pictures/default.png";

  const createUser = async (
    email: string,
    username: string,
    password: string
  ) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.upsert({
      where: { email },
      update: {}, // no update needed for seed
      create: {
        email,
        username,
        password: hashedPassword,
        profilePicture,
      },
    });
  };

  const [alice, bob, june, diana, eric, frank, grace, helen] =
    await Promise.all([
      createUser("alice@example.com", "alicebear133", "alice"),
      createUser("bob@example.com", "bobthebuilder", "bob"),
      createUser("june@example.com", "notjune", "june"),
      createUser("diana@example.com", "dianaqueen", "diana"),
      createUser("eric@example.com", "ericsteel", "eric"),
      createUser("frank@example.com", "frankthetank", "frank"),
      createUser("grace@example.com", "gracehopper", "grace"),
      createUser("helen@example.com", "helenthinker", "helen"),
    ]);

  // === DEBATE 1 ===
  const topic1 = await prisma.topic.create({
    data: { title: "Are private schools better than public schools?" },
  });

  const debate1 = await prisma.debate.create({
    data: {
      private: true,
      topicId: topic1.id,
      closed: false,
      creatorId: eric.id,
    },
  });

  await prisma.stance.createMany({
    data: [
      { label: "Private schools are better", debateId: debate1.id },
      { label: "Public schools are more equitable", debateId: debate1.id },
      { label: "The issue is too nuanced to generalize", debateId: debate1.id },
    ],
  });

  const stances1 = await prisma.stance.findMany({
    where: { debateId: debate1.id },
  });

  await prisma.participant.createMany({
    data: [
      {
        userId: alice.id,
        debateId: debate1.id,
        stanceId: stances1[0].id,
        role: Role.DEBATER,
      },
      {
        userId: bob.id,
        debateId: debate1.id,
        stanceId: stances1[1].id,
        role: Role.DEBATER,
      },
      {
        userId: june.id,
        debateId: debate1.id,
        stanceId: stances1[2].id,
        role: Role.DEBATER,
      },
      { userId: diana.id, debateId: debate1.id, role: Role.OBSERVER },
      { userId: eric.id, debateId: debate1.id, role: Role.CREATOR },
    ],
  });

  const [just1, just2, just3] = await Promise.all([
    prisma.justification.create({
      data: {
        content:
          "Private schools often have smaller class sizes and more funding.",
        authorId: alice.id,
        stanceId: stances1[0].id,
      },
    }),
    prisma.justification.create({
      data: {
        content:
          "Public schools better reflect real-world diversity and social equity.",
        authorId: bob.id,
        stanceId: stances1[1].id,
      },
    }),
    prisma.justification.create({
      data: {
        content:
          "Each school is different: case-by-case analysis must be performed.",
        authorId: june.id,
        stanceId: stances1[2].id,
      },
    }),
  ]);

  const parentComment = await prisma.comment.create({
    data: {
      content: "Interesting point!",
      authorId: diana.id,
      justificationId: just1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Thanks for the feedback!",
      authorId: alice.id,
      justificationId: just1.id,
      parentId: parentComment.id,
    },
  });

  await prisma.vote.createMany({
    data: [
      // Eric's votes
      { userId: eric.id, justificationId: just1.id, value: 1 },
      { userId: eric.id, justificationId: just2.id, value: -1 },

      // Alice's votes
      { userId: alice.id, justificationId: just1.id, value: 1 },
      { userId: alice.id, justificationId: just3.id, value: 1 },

      // Bob's votes
      { userId: bob.id, justificationId: just2.id, value: 1 },
      { userId: bob.id, justificationId: just3.id, value: -1 },

      // June's votes
      { userId: june.id, justificationId: just3.id, value: 1 },
      { userId: june.id, justificationId: just1.id, value: -1 },
    ],
  });

  // === DEBATE 2 ===
  const topic2 = await prisma.topic.create({
    data: { title: "Should college be free for everyone?" },
  });

  const debate2 = await prisma.debate.create({
    data: {
      private: true,
      topicId: topic2.id,
      closed: true,
      started: daysAgo(2),
      creatorId: alice.id,
    },
  });

  await prisma.stance.createMany({
    data: [
      { label: "Yes, education is a human right", debateId: debate2.id },
      { label: "No, it should be merit-based", debateId: debate2.id },
      { label: "Only for low-income families", debateId: debate2.id },
    ],
  });

  const stances2 = await prisma.stance.findMany({
    where: { debateId: debate2.id },
  });

  await prisma.participant.createMany({
    data: [
      {
        userId: diana.id,
        debateId: debate2.id,
        stanceId: stances2[0].id,
        role: Role.DEBATER,
      },
      {
        userId: eric.id,
        debateId: debate2.id,
        stanceId: stances2[1].id,
        role: Role.DEBATER,
      },
      {
        userId: frank.id,
        debateId: debate2.id,
        stanceId: stances2[2].id,
        role: Role.DEBATER,
      },
      { userId: bob.id, debateId: debate2.id, role: Role.OBSERVER },
      { userId: grace.id, debateId: debate2.id, role: Role.CREATOR },
    ],
  });

  const [just4, just5, just6] = await Promise.all([
    prisma.justification.create({
      data: {
        content: "Free college will increase upward mobility.",
        authorId: diana.id,
        stanceId: stances2[0].id,
      },
    }),
    prisma.justification.create({
      data: {
        content: "Merit-based scholarships encourage hard work.",
        authorId: eric.id,
        stanceId: stances2[1].id,
      },
    }),
    prisma.justification.create({
      data: {
        content: "Support should target those in most need.",
        authorId: frank.id,
        stanceId: stances2[2].id,
      },
    }),
  ]);

  const parent2 = await prisma.comment.create({
    data: {
      content: "Solid reasoning here.",
      authorId: grace.id,
      justificationId: just5.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Appreciate that!",
      authorId: eric.id,
      justificationId: just5.id,
      parentId: parent2.id,
    },
  });

  await prisma.vote.createMany({
    data: [
      { userId: grace.id, justificationId: just4.id, value: 1 },
      { userId: frank.id, justificationId: just5.id, value: 1 },
      { userId: helen.id, justificationId: just6.id, value: 1 },
    ],
  });

  // === DEBATE 3 ===
  const topic3 = await prisma.topic.create({
    data: { title: "Should AI be regulated by governments?" },
  });

  const debate3 = await prisma.debate.create({
    data: {
      private: true,
      topicId: topic3.id,
      closed: false,
      started: daysAgo(2),
      creatorId: june.id,
    },
  });

  await prisma.stance.createMany({
    data: [
      { label: "Yes, to ensure ethical use", debateId: debate3.id },
      { label: "No, it will hinder innovation", debateId: debate3.id },
    ],
  });

  const stances3 = await prisma.stance.findMany({
    where: { debateId: debate3.id },
  });

  await prisma.participant.createMany({
    data: [
      {
        userId: grace.id,
        debateId: debate3.id,
        stanceId: stances3[0].id,
        role: Role.DEBATER,
      },
      {
        userId: helen.id,
        debateId: debate3.id,
        stanceId: stances3[1].id,
        role: Role.DEBATER,
      },
      { userId: june.id, debateId: debate3.id, role: Role.CREATOR },
      { userId: frank.id, debateId: debate3.id, role: Role.OBSERVER },
    ],
  });

  const [just7, just8] = await Promise.all([
    prisma.justification.create({
      data: {
        content: "Unchecked AI may harm privacy and safety.",
        authorId: grace.id,
        stanceId: stances3[0].id,
      },
    }),
    prisma.justification.create({
      data: {
        content: "Strict rules will slow valuable progress.",
        authorId: helen.id,
        stanceId: stances3[1].id,
      },
    }),
  ]);

  const parent3 = await prisma.comment.create({
    data: {
      content: "Strongly agree!",
      authorId: frank.id,
      justificationId: just7.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Exactly why we need laws.",
      authorId: grace.id,
      justificationId: just7.id,
      parentId: parent3.id,
    },
  });

  // === PUBLIC DEBATE (everyone participates) ===
  const topic4 = await prisma.topic.create({
    data: { title: "What's the most important global issue today?" },
  });

  const debate4 = await prisma.debate.create({
    data: {
      private: true,
      topicId: topic4.id,
      closed: false,
      creatorId: june.id,
    },
  });

  await prisma.stance.createMany({
    data: [
      { label: "Climate change", debateId: debate4.id },
      { label: "AI safety", debateId: debate4.id },
      { label: "Global inequality", debateId: debate4.id },
      { label: "Authoritarianism", debateId: debate4.id },
    ],
  });

  const stances4 = await prisma.stance.findMany({
    where: { debateId: debate4.id },
  });

  let allUsers = [alice, bob, june, diana, eric, frank, grace, helen];
  await Promise.all(
    allUsers.map((user, idx) =>
      prisma.participant.create({
        data: {
          userId: user.id,
          debateId: debate4.id,
          stanceId: stances4[idx % stances4.length].id,
          role: Role.DEBATER,
        },
      })
    )
  );

  console.log("✅ All seed data successfully generated!");

  // === PAGINATION-FRIENDLY PUBLIC DEBATES ===
  const extraTopics = await Promise.all([
    prisma.topic.create({
      data: { title: "Is social media harming public discourse?" },
    }),
    prisma.topic.create({
      data: { title: "Should governments implement Universal Basic Income?" },
    }),
    prisma.topic.create({
      data: { title: "Are electric vehicles the future of transportation?" },
    }),
  ]);

  const extraStanceLabels = [
    ["Yes, it's toxic", "No, it's just a tool", "Depends on usage"],
    [
      "Yes, it will reduce poverty",
      "No, it's economically unsustainable",
      "Only during automation crises",
    ],
    [
      "Yes, they are cleaner",
      "No, not globally viable yet",
      "Depends on energy sources",
    ],
  ];

  let userCursor = 0;

  for (let i = 0; i < 50; i++) {
    const topicIndex = i % extraTopics.length;
    const topic = extraTopics[topicIndex];

    const creator = allUsers[userCursor % allUsers.length];
    userCursor++;

    const debate = await prisma.debate.create({
      data: {
        private: false,
        topicId: topic.id,
        closed: Math.random() > 0.7,
        started: daysAgo(Math.floor(Math.random() * 14)),
        creatorId: creator.id,
      },
    });

    // Create stances for this debate
    await prisma.stance.createMany({
      data: extraStanceLabels[topicIndex].map((label) => ({
        label,
        debateId: debate.id,
      })),
    });

    // Fetch the newly created stances for this debate
    const createdStances = await prisma.stance.findMany({
      where: { debateId: debate.id },
    });

    // Pick 3 debaters
    const participants = [];
    for (let j = 0; j < 3; j++) {
      const user = allUsers[(userCursor + j) % allUsers.length];
      const stance = createdStances[j % createdStances.length];
      participants.push({
        userId: user.id,
        debateId: debate.id,
        stanceId: stance.id,
        role: Role.DEBATER,
      });
    }
    await prisma.participant.createMany({ data: participants });

    // Add basic justifications
    await Promise.all(
      participants.map((p) =>
        prisma.justification.create({
          data: {
            content: `Debate #${i + 1}: Supporting stance ${p.stanceId}.`,
            authorId: p.userId,
            stanceId: p.stanceId!,
          },
        })
      )
    );

    userCursor += 3;
  }
}
