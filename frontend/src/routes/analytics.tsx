// routes/analytics.tsx
import api from "../../api/axios";
import axios from "axios";
import { processDebateBreakdown } from "../utils/processAnalytics";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
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
  const labelStyle = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "24px",
  };

  if (loading)
    return <div className="text-white p-4">Loading analytics...</div>;

  return (
    <div className="text-white p-4 space-y-6">
      <h1 className="text-2xl font-bold text-purple-400">
        Your Debate Analytics
      </h1>
      {data ? (
        <>
          <section className="flex">
            <h2 className="text-xl font-semibold mb-2">Participation</h2>
            <ul className="list-none pl-6 space-y-1">
              <li>Total Debates: {data.participation.totalDebates}</li>
              <li>Active Debates: {data.participation.activeDebates}</li>
              <li>Private Debates: {data.participation.privateDebates}</li>

              {/* {data.participation.participantStats.map(
                (stat: { role: string; _count: number }, idx: number) => (
                  <li key={idx}>
                    Role: <span className="capitalize">{stat.role}</span> —
                    Count: {stat._count}
                  </li>
                )
              )} */}
            </ul>

            <div className="h-64 w-full border border-red-500">
              <ResponsiveContainer>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="10%"
                  outerRadius="80%"
                  barSize={10}
                  data={participantStats}
                >
                  <RadialBar
                    label={{ position: "insideStart", fill: "#fff" }}
                    background
                    dataKey="count"
                  />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    wrapperStyle={labelStyle}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Contributions</h2>
            <ul className="list-none pl-6 space-y-1">
              <li>
                Total Justifications: {data.contributions.totalJustifications}
              </li>
              <li>Total Comments: {data.contributions.totalComments}</li>
              <li>Total Votes Cast: {data.contributions.totalVotesCast}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Highlights</h2>
            <ul className="list-none pl-6 space-y-1">
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
        </>
      ) : (
        <div>Something went wrong!</div>
      )}
    </div>
  );
};

export default Analytics;
