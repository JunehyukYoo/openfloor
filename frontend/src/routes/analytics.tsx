// routes/analytics.tsx
import api from "../../api/axios";
import axios from "axios";
import { processDebateBreakdown } from "../utils/processAnalytics";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import RoleRadialChart from "../components/analytics/RoleRadialChart";
import ActivityGraph from "../components/analytics/ActivityGraph";
import { NumberTicker } from "../components/magicui/number-ticker";
import type { AnalyticsData, RadialBarChartData } from "../types";

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const res = await api.get("/dashboard/analytics");
        setData(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message, {
            position: "top-right",
            theme: "dark",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    getAnalytics();
  }, []);
  let participantStats = [] as RadialBarChartData[];
  if (data) participantStats = processDebateBreakdown(data);

  if (loading)
    return <div className="text-white p-4">Loading analytics...</div>;

  return (
    <section className="text-white p-4 h-full box-border flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-white">Your Debate Analytics</h1>
      {data ? (
        <div className="grid grid-cols-12 gap-4 h-full overflow-hidden box-border">
          {/* Main Column (Debates + Highlights + Activity Graph) */}
          <div className="md:col-span-10 col-span-8 flex flex-col gap-4 overflow-hidden">
            {/* Debates + Activity graph */}
            <div className="flex gap-4">
              {/* Debates */}
              <section className="bg-zinc-700 rounded-[20px] p-2 grow-1 shrink-2 overflow-scroll">
                <h2 className="text-2xl font-semibold mb-4 mt-2">
                  Participation
                </h2>
                <ul className="list-none p-4 flex gap-4 w-full justify-around items-center flex-wrap">
                  <li className="grow p-2 h-40 w-45 bg-zinc-600 rounded-lg">
                    <h3 className="text-xl">Total Debates</h3>
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[10px]"
                      value={data.participation.totalDebates}
                    />
                  </li>
                  <li className="grow p-2 h-40 w-45 bg-zinc-600 rounded-lg">
                    <h3 className="text-xl">Active Debates</h3>
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[10px]"
                      value={data.participation.activeDebates}
                    />
                  </li>
                  <li className="grow p-2 h-40 w-45 bg-zinc-600 rounded-lg">
                    <h3 className="text-xl">Private Debates</h3>
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[10px]"
                      value={data.participation.privateDebates}
                    />
                  </li>
                  <li className="grow p-2 h-40 w-60 bg-zinc-600 rounded-lg shrink-0">
                    <h3 className="text-xl">Role Distribution</h3>
                    <RoleRadialChart data={participantStats} />
                  </li>
                </ul>
              </section>

              {/* Activity Graph */}
              <section className="bg-zinc-700 rounded-[20px] min-w-1/3 h-auto shrink-1 p-4 col-span-12">
                <h2 className="text-2xl font-semibold mb-4 mt-2">Activity</h2>
                <div className="w-full h-auto">
                  <ActivityGraph data={data.activityOverTime} />
                </div>
              </section>
            </div>
            {/* Highlights */}
            <section className="bg-zinc-700 rounded-[20px] grow p-4 flex flex-row gap-4 overflow-scroll">
              {/* Top justification + Most participated topic */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="bg-zinc-600 p-4 rounded-lg grow">
                  <h3 className="text-xl font-medium text-purple-300">
                    Top Justification
                  </h3>
                  {data.highlights.topJustification ? (
                    <p className="text-white">
                      <span className="italic text-lg">
                        "{data.highlights.topJustification.content}"
                      </span>
                      {" ("} {data.highlights.topJustification.voteSum} votes{" "}
                      {") "}
                      <br />
                      <span className="text-blue-300 font-medium">
                        {data.highlights.topJustification.stance}
                      </span>{" "}
                      on{" "}
                      <span className="text-green-300 font-medium">
                        {data.highlights.topJustification.topic}
                      </span>
                    </p>
                  ) : (
                    <p>No upvoted justifications yet.</p>
                  )}
                </div>

                <div className="bg-zinc-600 p-4 rounded-lg grow">
                  <h3 className="text-lg font-medium text-purple-300">
                    Most Participated Topic
                  </h3>
                  <p className="text-white">
                    {data.highlights.mostParticipatedTopic ? (
                      <>
                        <span className="text-xl font-semibold text-white">
                          {data.highlights.mostParticipatedTopic.topic.title}
                        </span>{" "}
                        ({data.highlights.mostParticipatedTopic.count} debates)
                      </>
                    ) : (
                      "No participated topics yet."
                    )}
                  </p>
                </div>
              </div>

              {/* Avg. Votes per Justification */}
              <div className="bg-zinc-600 p-4 rounded-lg flex flex-col justify-center items-center w-48 shrink-0">
                <h3 className="text-lg font-medium text-purple-300 mb-2 text-center">
                  Avg. Votes
                  <br />
                  Per Justification
                </h3>
                <NumberTicker
                  className="whitespace-pre-wrap text-6xl font-light tracking-tighter text-white translate-y-[6px]"
                  value={data.highlights.avgVotesPerJustification}
                />
              </div>
            </section>
          </div>

          {/* Contributions (Side column) */}
          <section className="md:col-span-2 col-span-4 bg-zinc-700 rounded-[20px] p-4 flex flex-col gap-6 overflow-hidden">
            <h2 className="text-2xl font-semibold">Contributions</h2>
            <div className="flex flex-col gap-4 h-full justify-around">
              <div className="p-2 bg-zinc-600 rounded-lg grow">
                <h3 className="text-2xl">Justifications</h3>
                <div className="flex-1 flex items-center justify-center">
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[20px]"
                    value={data.contributions.totalJustifications}
                  />
                </div>
              </div>
              <div className="p-2 bg-zinc-600 rounded-lg grow">
                <h3 className="text-2xl">Comments</h3>
                <div className="flex-1 flex items-center justify-center">
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[20px]"
                    value={data.contributions.totalComments}
                  />
                </div>
              </div>
              <div className="p-2 bg-zinc-600 rounded-lg grow">
                <h3 className="text-2xl">Votes Cast</h3>
                <div className="flex-1 flex items-center justify-center">
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[20px]"
                    value={data.contributions.totalVotesCast}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div>Something went wrong!</div>
      )}
    </section>
  );
};

export default Analytics;
