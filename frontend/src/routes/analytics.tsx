// routes/analytics.tsx
import api from "../../api/axios";
import axios from "axios";
import { processDebateBreakdown } from "../utils/processAnalytics";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import RoleRadialChart from "../components/analytics/RoleRadialChart";
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
      <h1 className="text-2xl font-bold text-white">Your Debate Analytics</h1>
      {data ? (
        <div className="flex flex-col gap-4 overflow-hidden box-border h-full">
          <section className="bg-zinc-700 rounded-[20px] p-2 overflow-hidden grow-1">
            <h2 className="text-xl font-semibold mb-4 mt-2">Participation</h2>
            <ul className="list-none flex gap-4 w-full justify-around items-center">
              <li>Total Debates: {data.participation.totalDebates}</li>
              <li>Active Debates: {data.participation.activeDebates}</li>
              <li>Private Debates: {data.participation.privateDebates}</li>
              <li className="h-40 w-60 border border-red-500">
                <RoleRadialChart data={participantStats} />
              </li>
            </ul>
          </section>

          <section className="bg-zinc-700 rounded-[20px] p-2 overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">Contributions</h2>
            <ul className="list-none flex flex-col gap-1">
              <li>
                Total Justifications: {data.contributions.totalJustifications}
              </li>
              <li>Total Comments: {data.contributions.totalComments}</li>
              <li>Total Votes Cast: {data.contributions.totalVotesCast}</li>
            </ul>
          </section>

          <section className="bg-zinc-700 rounded-[20px] p-2 grow-2 overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">Highlights</h2>
            <ul className="list-none pl-6 flex flex-col gap-1">
              {data.highlights.mostParticipatedTopic ? (
                <li>
                  Most Participated Topic:{" "}
                  <span className="text-purple-300 font-semibold">
                    {data.highlights.mostParticipatedTopic.topic.title}
                  </span>{" "}
                  ({data.highlights.mostParticipatedTopic.count} debates)
                </li>
              ) : (
                <li>No participated topics yet.</li>
              )}
              <li>
                Avg. Votes per Justification:{" "}
                <span className="text-purple-300">
                  {data.highlights.avgVotesPerJustification}
                </span>
              </li>
              {data.highlights.topJustification ? (
                <li>
                  Top Justification:{" "}
                  <span className="italic">
                    "{data.highlights.topJustification.content}"
                  </span>{" "}
                  ({data.highlights.topJustification.voteSum} votes) — Stance:{" "}
                  <span className="text-blue-300">
                    {data.highlights.topJustification.stance}
                  </span>{" "}
                  on{" "}
                  <span className="text-green-300">
                    {data.highlights.topJustification.topic}
                  </span>
                </li>
              ) : (
                <li>No upvoted justifications yet.</li>
              )}
            </ul>
          </section>
        </div>
      ) : (
        <div>Something went wrong!</div>
      )}
    </section>
  );
};

export default Analytics;
