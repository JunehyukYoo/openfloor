// prisma/seed-prod.ts
import "dotenv/config";
import prisma from "../lib/prisma";

export async function seed() {
  const starterTopics = [
    "Should AI be regulated by governments?",
    "Is social media harming public discourse?",
    "Should college be free for everyone?",
    "Are electric vehicles the future of transportation?",
    "Should governments implement Universal Basic Income?",
    "Is climate change the most urgent global issue?",
    "Should private schools be banned?",
    "Should voting be mandatory in democratic countries?",
    "Is remote work more beneficial than in-office work?",
    "Should animal testing be banned worldwide?",
    "Is space exploration worth the investment?",
    "Should the death penalty be abolished globally?",
    "Is censorship ever justified in a free society?",
    "Should genetically modified foods be widely accepted?",
    "Is cryptocurrency a viable alternative to traditional currency?",
    "Should healthcare be universal and free?",
    "Are video games beneficial for cognitive development?",
    "Should governments control population growth?",
    "Is nuclear energy a sustainable solution to the energy crisis?",
    "Should the minimum wage be a living wage?",
    "Is globalization beneficial for developing countries?",
    "Should school curricula prioritize STEM over the arts?",
    "Is pineapple on pizza acceptable?",
    "Should homework be banned in schools?",
    "Are cats better pets than dogs?",
    "Is it better to be an early bird or a night owl?",
    "Should fast food be considered real food?",
    "Is social media more fake than real?",
    "Are smartphones making us less social?",
    "Should video games be considered a sport?",
    "Is binge-watching TV shows a waste of time?",
    "Are aliens likely to exist somewhere in the universe?",
  ];

  await prisma.topic.createMany({
    data: starterTopics.map((title) => ({ title })),
    skipDuplicates: true,
  });

  console.log("✅ Production seed: starter topics added.");
}
