// routes/analytics.tsx
import api from "../../../api/axios";
import axios from "axios";
import {
  processDebateBreakdown,
  processActivityData,
} from "../../utils/processAnalytics";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import RoleRadialChart from "../../components/analytics/RoleRadialChart";
import ActivityGraph from "../../components/analytics/ActivityGraph";
import { NumberTicker } from "../../components/magicui/number-ticker";
import type {
  AnalyticsData,
  RadialBarChartData,
  ActivityOverTime,
} from "../../types";

import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";

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

  let chartData = [] as RadialBarChartData[];
  let graphData = [] as ActivityOverTime[];
  if (data) {
    chartData = processDebateBreakdown(data);
    graphData = processActivityData(data);
  }

  if (loading)
    return <div className="text-white p-4">Loading analytics...</div>;

  return (
    <section className="text-white pl-4 pr-4 pb-4 h-full w-full box-border flex flex-col gap-4">
      <PageHeader title={"Analytics"} />
      {data ? (
        <div className="flex flex-col gap-4 h-full overflow-hidden box-border">
          {/* Debate Participation + Activity graph */}
          <div className="flex gap-4 ">
            {/* Participation */}
            <section className="bg-zinc-700 rounded-[20px] p-4 gap-4 grow-1 shrink-2 overflow-scroll">
              <h2 className="text-2xl font-semibold mb-6">Participation</h2>
              <ul className="list-none flex flex-col gap-4 w-full items-center">
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  <li className="grow shrink p-2 h-40 bg-zinc-600 rounded-lg">
                    <h3 className="text-xl">Total Debates</h3>
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[10px]"
                      value={data.participation.totalDebates}
                    />
                  </li>
                  <li className="grow shrink p-2 h-40 bg-zinc-600 rounded-lg">
                    <h3 className="text-xl">Active Debates</h3>
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[10px]"
                      value={data.participation.activeDebates}
                    />
                  </li>
                  <li className="grow shrink p-2 h-40 bg-zinc-600 rounded-lg">
                    <h3 className="text-xl">Private Debates</h3>
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white translate-y-[10px]"
                      value={data.participation.privateDebates}
                    />
                  </li>
                </div>

                <li className="w-full bg-zinc-600 rounded-lg p-4">
                  <h3 className="text-xl text-center mb-2">
                    Role Distribution
                  </h3>
                  <div className="max-w-[300px] mx-auto h-40">
                    <RoleRadialChart data={chartData} />
                  </div>
                </li>
              </ul>
            </section>

            {/* Activity Graph */}
            <section className="bg-zinc-700 rounded-[20px] min-w-2/5 h-auto grow-2 p-4 col-span-12 box-border">
              <h2 className="text-2xl font-semibold mb-4 mt-2">Activity</h2>
              <div className="w-full h-6/7 bg-zinc-600 rounded-lg">
                <ActivityGraph data={graphData} />
              </div>
            </section>
          </div>

          {/* Highlights + Contribution */}
          <div className="flex gap-4 flex-wrap">
            {/* Highlights */}
            <section className="h-auto bg-zinc-700 rounded-[20px] grow p-4 flex flex-col gap-4 overflow-scroll">
              <h2 className="text-2xl font-semibold">Highlights</h2>
              {/* Top justification + Most participated topic */}
              <div className="flex gap-4 h-full">
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
                          ({data.highlights.mostParticipatedTopic.count}{" "}
                          debates)
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
              </div>
            </section>

            {/* Contribution */}
            <section className="bg-zinc-700 rounded-[20px] p-4 flex flex-col gap-4 overflow-hidden">
              <h2 className="text-2xl font-semibold">Contributions</h2>
              <div className="flex flex-col gap-4 h-full justify-around">
                <div className="p-2 bg-zinc-600 rounded-lg grow">
                  <h3 className="text-xl">Justifications</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white"
                      value={data.contributions.totalJustifications}
                    />
                  </div>
                </div>
                <div className="p-2 bg-zinc-600 rounded-lg grow">
                  <h3 className="text-xl">Comments</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white"
                      value={data.contributions.totalComments}
                    />
                  </div>
                </div>
                <div className="p-2 bg-zinc-600 rounded-lg grow">
                  <h3 className="text-xl">Votes Cast</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <NumberTicker
                      className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white"
                      value={data.contributions.totalVotesCast}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div>Something went wrong!</div>
      )}
    </section>
  );
};

export default Analytics;
