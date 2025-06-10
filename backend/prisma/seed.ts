// prisma/seed.ts
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  // Create users (no need to supply cuid() manually)
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      password: "hashed-password-alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      password: "hashed-password-bob",
    },
  });

  const june = await prisma.user.create({
    data: {
      email: "june@example.com",
      password: "hashed-password-june",
    },
  });

  // Create topic
  const topic = await prisma.topic.create({
    data: {
      title: "Are private schools better than public schools?",
    },
  });

  // Create stances
  await prisma.stance.createMany({
    data: [
      { label: "Private schools are better", topicId: topic.id },
      { label: "Public schools are more equitable", topicId: topic.id },
      { label: "The issue is too nuanced to generalize", topicId: topic.id },
    ],
  });

  const stances = await prisma.stance.findMany({
    where: { topicId: topic.id },
    orderBy: { id: "asc" },
  });

  // Create debate (id is cuid-based now)
  const debate = await prisma.debate.create({
    data: {
      priv: 0,
      topicId: topic.id,
      closed: false,
      started: new Date(),
    },
  });

  // Add participants
  await prisma.participant.createMany({
    data: [
      {
        userId: alice.id,
        debateId: debate.id,
        stanceId: stances[0].id,
        role: "debater",
      },
      {
        userId: bob.id,
        debateId: debate.id,
        stanceId: stances[1].id,
        role: "debater",
      },
      {
        userId: june.id,
        debateId: debate.id,
        stanceId: stances[2].id,
        role: "debater",
      },
    ],
  });

  // Add justifications
  await prisma.justification.createMany({
    data: [
      {
        content:
          "Private schools often have smaller class sizes and more funding.",
        authorId: alice.id,
        stanceId: stances[0].id,
      },
      {
        content:
          "Public schools better reflect real-world diversity and social equity.",
        authorId: bob.id,
        stanceId: stances[1].id,
      },
      {
        content:
          "Each school is different: case-by-case analysis must be performed.",
        authorId: june.id,
        stanceId: stances[2].id,
      },
    ],
  });

  console.log("✅ Database seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
