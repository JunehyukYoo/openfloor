// routes/dashboard/analytics.tsx
import api from "../../../api/axios";
import axios from "axios";
import {
  processDebateBreakdown,
  processActivityData,
} from "../../utils/processAnalytics";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import RoleRadialChart from "../../components/dashboard/analytics/RoleRadialChart";
import ActivityGraph from "../../components/dashboard/analytics/ActivityGraph";
import { NumberTicker } from "../../components/magicui/number-ticker";
import type {
  AnalyticsData,
  RadialBarChartData,
  ActivityOverTime,
} from "../../types";
import { Card, CardTitle } from "../../components/ui/card";
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

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Analytics" />
        <LoadingScreen />
      </div>
    );
  }

  return (
    <section className="text-white pl-4 pr-4 pb-4 h-full w-full box-border flex flex-col gap-4">
      <PageHeader title={"Analytics"} />
      {data ? (
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4 h-full overflow-hidden box-border">
          {/* Participation */}
          <Card className="col-span-2 bg-neutral-900 p-4 gap-4 overflow-scroll">
            <CardTitle className="text-2xl font-semibold mb-6">
              Participation
            </CardTitle>
            <div className="list-none flex flex-col gap-4 w-full items-center">
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <Card className="grow shrink p-2 h-40 bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800">
                  <h3 className="text-xl">Total Debates</h3>
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white -translate-y-[15px]"
                    value={data.participation.totalDebates}
                  />
                </Card>
                <Card className="grow shrink p-2 h-40 bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800">
                  <h3 className="text-xl">Active Debates</h3>
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white -translate-y-[15px]"
                    value={data.participation.activeDebates}
                  />
                </Card>
                <Card className="grow shrink p-2 h-40 bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800">
                  <h3 className="text-xl">Private Debates</h3>
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white -translate-y-[15px]"
                    value={data.participation.privateDebates}
                  />
                </Card>
              </div>

              <Card className="h-60 w-full bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 rounded-lg p-4">
                <h3 className="text-xl text-center mb-2">Role Distribution</h3>
                <div className="max-w-[300px] mx-auto h-40 w-50">
                  <RoleRadialChart data={chartData} />
                </div>
              </Card>
            </div>
          </Card>

          {/* Activity Graph */}
          <Card className="bg-neutral-900 min-w-2/5 h-auto p-4 col-span-2 box-border">
            <CardTitle className="text-2xl font-semibold mb-4 mt-2">
              Activity
            </CardTitle>
            <Card className="w-full h-6/7 bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 rounded-lg">
              {graphData.length > 0 ? (
                <ActivityGraph data={graphData} />
              ) : (
                <p className="align-middle">No activity yet.</p>
              )}
            </Card>
          </Card>

          {/* Highlights */}
          <Card className="col-span-3 bg-neutral-900 h-auto grow p-4 flex flex-col gap-4 overflow-scroll">
            <CardTitle className="text-2xl font-semibold">Highlights</CardTitle>
            <div className="flex gap-4 h-full">
              <div className="flex flex-col gap-4 flex-1">
                <Card className="bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 p-4 rounded-lg grow">
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
                </Card>

                <Card className="bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 p-4 rounded-lg grow">
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
                </Card>
              </div>
              <Card className="bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 p-4 rounded-lg flex flex-col justify-center items-center w-48 shrink-0">
                <h3 className="text-lg font-medium text-purple-300 mb-2 text-center">
                  Avg. Votes
                  <br />
                  Per Justification
                </h3>
                <NumberTicker
                  className="whitespace-pre-wrap text-6xl font-light tracking-tighter text-white translate-y-[6px]"
                  value={data.highlights.avgVotesPerJustification}
                />
              </Card>
            </div>
          </Card>

          {/* Contribution */}
          <Card className="col-span-1 bg-neutral-900 p-4 flex flex-col gap-4 overflow-hidden">
            <h2 className="text-2xl font-semibold">Contributions</h2>
            <div className="flex flex-col gap-4 h-full justify-around">
              <Card className="p-2 bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 rounded-lg grow">
                <h3 className="text-xl">Justifications</h3>
                <div className="flex-1 flex items-center justify-center">
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white -translate-y-[15px]"
                    value={data.contributions.totalJustifications}
                  />
                </div>
              </Card>
              <Card className="p-2 bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 rounded-lg grow">
                <h3 className="text-xl">Comments</h3>
                <div className="flex-1 flex items-center justify-center">
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white -translate-y-[15px]"
                    value={data.contributions.totalComments}
                  />
                </div>
              </Card>
              <Card className="p-2 bg-gradient-to-t from-neutral-700/[0.1] to-neutral-800 rounded-lg grow">
                <h3 className="text-xl">Votes Cast</h3>
                <div className="flex-1 flex items-center justify-center">
                  <NumberTicker
                    className="whitespace-pre-wrap text-8xl font-light tracking-tighter text-white -translate-y-[15px]"
                    value={data.contributions.totalVotesCast}
                  />
                </div>
              </Card>
            </div>
          </Card>
        </div>
      ) : (
        <div>Something went wrong!</div>
      )}
    </section>
  );
};

export default Analytics;
