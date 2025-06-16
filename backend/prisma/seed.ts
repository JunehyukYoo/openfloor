// seed.ts
import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const profilePicture =
    process.env.CDN_DOMAIN_NAME + "/profile-pictures/default.png";

  const createUser = async (
    email: string,
    username: string,
    password: string
  ) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
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

  await prisma.stance.createMany({
    data: [
      { label: "Private schools are better", topicId: topic1.id },
      { label: "Public schools are more equitable", topicId: topic1.id },
      { label: "The issue is too nuanced to generalize", topicId: topic1.id },
    ],
  });

  const stances1 = await prisma.stance.findMany({
    where: { topicId: topic1.id },
  });

  const debate1 = await prisma.debate.create({
    data: { priv: 1, topicId: topic1.id, closed: false },
  });

  await prisma.participant.createMany({
    data: [
      {
        userId: alice.id,
        debateId: debate1.id,
        stanceId: stances1[0].id,
        role: "debater",
      },
      {
        userId: bob.id,
        debateId: debate1.id,
        stanceId: stances1[1].id,
        role: "debater",
      },
      {
        userId: june.id,
        debateId: debate1.id,
        stanceId: stances1[2].id,
        role: "debater",
      },
      { userId: diana.id, debateId: debate1.id, role: "observer" },
      { userId: eric.id, debateId: debate1.id, role: "admin" },
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
      { userId: eric.id, justificationId: just1.id, value: 1 },
      { userId: eric.id, justificationId: just2.id, value: -1 },
    ],
  });

  // === DEBATE 2 ===
  const topic2 = await prisma.topic.create({
    data: { title: "Should college be free for everyone?" },
  });

  await prisma.stance.createMany({
    data: [
      { label: "Yes, education is a human right", topicId: topic2.id },
      { label: "No, it should be merit-based", topicId: topic2.id },
      { label: "Only for low-income families", topicId: topic2.id },
    ],
  });

  const stances2 = await prisma.stance.findMany({
    where: { topicId: topic2.id },
  });

  const debate2 = await prisma.debate.create({
    data: {
      priv: 1,
      topicId: topic2.id,
      closed: true,
      started: new Date(Date.now() - 2 * 86400000), // 2 days ago
    },
  });

  await prisma.participant.createMany({
    data: [
      {
        userId: diana.id,
        debateId: debate2.id,
        stanceId: stances2[0].id,
        role: "debater",
      },
      {
        userId: eric.id,
        debateId: debate2.id,
        stanceId: stances2[1].id,
        role: "debater",
      },
      {
        userId: frank.id,
        debateId: debate2.id,
        stanceId: stances2[2].id,
        role: "debater",
      },
      { userId: bob.id, debateId: debate2.id, role: "observer" },
      { userId: grace.id, debateId: debate2.id, role: "admin" },
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

  await prisma.stance.createMany({
    data: [
      { label: "Yes, to ensure ethical use", topicId: topic3.id },
      { label: "No, it will hinder innovation", topicId: topic3.id },
    ],
  });

  const stances3 = await prisma.stance.findMany({
    where: { topicId: topic3.id },
  });

  const debate3 = await prisma.debate.create({
    data: { priv: 1, topicId: topic3.id, closed: false },
  });

  await prisma.participant.createMany({
    data: [
      {
        userId: grace.id,
        debateId: debate3.id,
        stanceId: stances3[0].id,
        role: "debater",
      },
      {
        userId: helen.id,
        debateId: debate3.id,
        stanceId: stances3[1].id,
        role: "debater",
      },
      { userId: june.id, debateId: debate3.id, role: "admin" },
      { userId: frank.id, debateId: debate3.id, role: "observer" },
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

  await prisma.stance.createMany({
    data: [
      { label: "Climate change", topicId: topic4.id },
      { label: "AI safety", topicId: topic4.id },
      { label: "Global inequality", topicId: topic4.id },
      { label: "Authoritarianism", topicId: topic4.id },
    ],
  });

  const stances4 = await prisma.stance.findMany({
    where: { topicId: topic4.id },
  });

  const debate4 = await prisma.debate.create({
    data: { priv: 0, topicId: topic4.id, closed: false },
  });

  const allUsers = [alice, bob, june, diana, eric, frank, grace, helen];
  await Promise.all(
    allUsers.map((user, idx) =>
      prisma.participant.create({
        data: {
          userId: user.id,
          debateId: debate4.id,
          stanceId: stances4[idx % stances4.length].id,
          role: "debater",
        },
      })
    )
  );

  console.log("✅ All seed data successfully generated!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
