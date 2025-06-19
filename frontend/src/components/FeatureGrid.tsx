// src/components/FeatureGrid.tsx
import { FaGlobe, FaComments } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { MdHowToVote } from "react-icons/md";

import { Globe } from "./magicui/globe";
import { AnimatedList } from "./magicui/animated-list";
import { Marquee } from "./magicui/marquee";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { cn } from "../lib/utils";
import { BentoCard, BentoGrid } from "./magicui/bento-grid";

import { useAuth } from "../context/authContext";
import { generateRandomData } from "../utils/processAnalytics";

const topics = [
  {
    name: "Israel vs Palestine",
    body: "A long-standing conflict over land and sovereignty, with deep historical, religious, and political roots.",
  },
  {
    name: "AI Regulation",
    body: "Should governments impose strict regulations on AI development to prevent misuse, or would that stifle innovation?",
  },
  {
    name: "Universal Basic Income",
    body: "A proposed economic system where all citizens receive a regular, unconditional sum of money to reduce inequality.",
  },
  {
    name: "Gun Control",
    body: "Debate over stricter firearm regulations to reduce violence versus the right to bear arms for self-defense.",
  },
  {
    name: "Climate Change Action",
    body: "Should nations prioritize aggressive climate policies, even at economic cost, or focus on gradual adaptation?",
  },
  {
    name: "Free Speech Limits",
    body: "Should hate speech and misinformation be restricted, or does that violate fundamental freedoms?",
  },
  {
    name: "Vaccine Mandates",
    body: "Should governments enforce mandatory vaccinations for public health, or does it infringe on personal liberty?",
  },
  {
    name: "Capitalism vs Socialism",
    body: "A debate over economic systems: market-driven growth versus state-led wealth redistribution.",
  },
  {
    name: "Animal Testing",
    body: "Is the use of animals in scientific research ethically justifiable if it advances human medicine?",
  },
  {
    name: "Cancel Culture",
    body: "Does public shaming for controversial opinions promote accountability or suppress free expression?",
  },
];

let notifications = [
  {
    name: "John upvoted your justification.",
  },
  {
    name: "Alice downvoted your justification.",
  },
  {
    name: "Your topic is trending.",
  },
  {
    name: "Joonho upvoted you justification.",
  },
  {
    name: "Your debate concluded.",
  },
  {
    name: "Rishabh upvoted your justification.",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

// Random data generation for graph
const fakeData1 = generateRandomData(12, 5, 5);
const fakeData2 = generateRandomData(12, 8, 4);
const fakeData3 = generateRandomData(12, 3, 6);
const fakeData = fakeData1.map((point, i) => ({
  name: point.name,
  line1: point.num,
  line2: fakeData2[i].num,
  line3: fakeData3[i].num,
}));

const featuresUnath = [
  {
    Icon: FaGlobe,
    name: "Debate people from across the globe",
    description:
      "Engage in debates with people from around the world and share your perspectives.",
    href: "/register",
    cta: "Create an account",
    className: "col-span-3 lg:col-span-1 bg-zinc-700 text-left",
    background: (
      <div className="blur-[0.5px] hover:blur-none hover:scale-130 transition-all duration-300 ease-out">
        <Globe
          config={{
            width: 400,
            height: 400,
            phi: 0,
            theta: 0,
            dark: 1,
            scale: 1,
            mapSamples: 16000,
            mapBrightness: 1,
            baseColor: [1, 1, 1],
            markerColor: [251 / 255, 100 / 255, 21 / 255],
            glowColor: [1, 1, 1],
            markers: [],
            onRender: () => {},
            diffuse: 1,
            devicePixelRatio:
              typeof window !== "undefined" ? window.devicePixelRatio : 1,
          }}
          className="[mask-image:linear-gradient(to_top,transparent_5%,#000_100%)]"
        />
      </div>
    ),
  },
  {
    Icon: FaComments,
    name: "Choose a topic to debate",
    description:
      "Browse and select from a variety of trending and thought-provoking debate topics.",
    href: "/register",
    cta: "Create an account",
    className: "col-span-3 lg:col-span-2 bg-zinc-600 text-left",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_5%,#000_100%)] "
      >
        {topics.map((t) => (
          <figure
            key={t.name}
            className={cn(
              "relative w-40 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[0.5] hover:bg-gray-800/[0.5]",
              "transform-gpu blur-[0.8px] transition-all duration-300 ease-out hover:blur-none",
              "text-zinc-400 hover:text-white"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-medium font-medium ">
                  {t.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{t.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: MdHowToVote,
    name: "Vote on your beliefs",
    description:
      "Let the community decide the winner of debates through a voting system.",
    href: "/register",
    cta: "You should really create an account",
    className: "col-span-3 lg:col-span-2 bg-zinc-700 text-left",
    background: (
      <AnimatedList className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_5%,#000_100%)] group-hover:scale-80">
        {notifications.map((notif, idx) => (
          <div key={idx} className="text-lg text-neutral-200">
            {"> "}
            {notif.name}
          </div>
        ))}
      </AnimatedList>
    ),
  },
  {
    Icon: IoAnalyticsOutline,
    name: "View your analytics",
    description: "See how good of a debater you are.",
    className:
      "col-span-3 lg:col-span-1 bg-zinc-700/[0.8] text-left  group-hover:scale-90",
    href: "/dashboard/analytics",
    cta: "Go to analytics",
    background: (
      <div className="absolute top-10 w-full right-8 center blur-[1px] hover:blur-none hover:scale-130 transition-all duration-300 ease-out">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={fakeData}
            className="[mask-image:linear-gradient(to_top,transparent_5%,#000_100%)]"
          >
            <XAxis tick={false} tickLine={true} />
            <YAxis tick={false} tickLine={true} />
            <Line dataKey="line1" stroke="#8884d8" dot={false} />
            <Line dataKey="line2" stroke="#82ca9d" dot={false} />
            <Line dataKey="line3" stroke="#ffc658" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ),
  },
];

// Only thing that changes are the links
const featuresAuth = [
  {
    Icon: FaGlobe,
    name: "Debate people from across the globe",
    description:
      "Engage in debates with people from around the world and share your perspectives.",
    href: "/dashboard/debates",
    cta: "Go to debates",
    className: "col-span-3 lg:col-span-1 bg-zinc-700 text-left",
    background: (
      <div className="blur-[0.5px] hover:blur-none hover:scale-130 transition-all duration-300 ease-out">
        <Globe
          config={{
            width: 400,
            height: 400,
            phi: 0,
            theta: 0,
            dark: 1,
            scale: 1,
            mapSamples: 16000,
            mapBrightness: 1,
            baseColor: [1, 1, 1],
            markerColor: [251 / 255, 100 / 255, 21 / 255],
            glowColor: [1, 1, 1],
            markers: [],
            onRender: () => {},
            diffuse: 1,
            devicePixelRatio:
              typeof window !== "undefined" ? window.devicePixelRatio : 1,
          }}
          className="[mask-image:linear-gradient(to_top,transparent_5%,#000_100%)]"
        />
      </div>
    ),
  },
  {
    Icon: FaComments,
    name: "Choose a topic to debate",
    description:
      "Browse and select from a variety of trending and thought-provoking debate topics.",
    href: "/dashboard/topics",
    cta: "Go to topics",
    className: "col-span-3 lg:col-span-2 bg-zinc-600 text-left",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_5%,#000_100%)] "
      >
        {topics.map((t) => (
          <figure
            key={t.name}
            className={cn(
              "relative w-40 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[0.5] hover:bg-gray-800/[0.5]",
              "transform-gpu blur-[0.8px] transition-all duration-300 ease-out hover:blur-none",
              "text-zinc-400 hover:text-white"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-medium font-medium ">
                  {t.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{t.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: MdHowToVote,
    name: "Vote on your beliefs",
    description:
      "Let the community decide the winner of debates through a voting system.",
    href: "/dashboard/debates",
    cta: "Go to debates",
    className: "col-span-3 lg:col-span-2 bg-zinc-700 text-left",
    background: (
      <AnimatedList className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_5%,#000_100%)] group-hover:scale-80">
        {notifications.map((notif, idx) => (
          <div key={idx} className="text-lg text-neutral-200">
            {"> "}
            {notif.name}
          </div>
        ))}
      </AnimatedList>
    ),
  },
  {
    Icon: IoAnalyticsOutline,
    name: "View your analytics",
    description: "See how good of a debater you are.",
    className:
      "col-span-3 lg:col-span-1 bg-zinc-700/[0.8] text-left  group-hover:scale-90",
    href: "/dashboard/analytics",
    cta: "Go to analytics",
    background: (
      <div className="absolute top-10 w-full right-8 center blur-[1px] hover:blur-none hover:scale-130 transition-all duration-300 ease-out">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={fakeData}
            className="[mask-image:linear-gradient(to_top,transparent_5%,#000_100%)]"
          >
            <XAxis tick={false} tickLine={true} />
            <YAxis tick={false} tickLine={true} />
            <Line dataKey="line1" stroke="#8884d8" dot={false} />
            <Line dataKey="line2" stroke="#82ca9d" dot={false} />
            <Line dataKey="line3" stroke="#ffc658" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ),
  },
];

export function FeatureGrid() {
  const { loggedIn } = useAuth();
  return (
    <BentoGrid>
      {loggedIn
        ? featuresAuth.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))
        : featuresUnath.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
    </BentoGrid>
  );
}
