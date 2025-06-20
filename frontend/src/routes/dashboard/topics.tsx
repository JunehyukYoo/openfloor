// routes/topics.tsx
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { useState, useEffect } from "react";
import type { AllTopicData } from "../../types";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import axios from "axios";
import api from "../../../api/axios";

const Topics = () => {
  const [topics, setTopics] = useState<AllTopicData | null>(null);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const { data } = await api.get("/dashboard/topics");
        setTopics(data);
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
      }
    };
    getTopics();
  }, []);

  return (
    <div className="pl-2 pr-2 flex flex-col gap-4">
      <PageHeader title="Topics" />
      {topics ? (
        <>
          <div className="flex flex-col p-2 gap-4">
            <h1 className="text-4xl text-left ml-10">Weekly Trending Topics</h1>
            <div className="flex gap-4 flex-wrap">
              {topics.trendingTopics.map((t) => {
                return (
                  <Card key={t.title} className="flex-1">
                    <CardHeader>
                      <CardTitle>{t.title}</CardTitle>
                      <CardDescription>Card desc</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Number of total debates: {t.totalCount}
                      <br />
                      Number of recent debates: {t.recentPublicDebateCount}
                    </CardContent>
                    <CardFooter>
                      <p>Card Footer</p>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col p-2 gap-4">
            <h1 className="text-4xl text-left ml-10">Recommended Topics</h1>
            <div className="flex gap-4 flex-wrap">
              {topics.recommendedTopics.map((t) => {
                return (
                  <Card key={t.title} className="flex-1">
                    <CardHeader>
                      <CardTitle>{t.title}</CardTitle>
                      <CardDescription>Card desc</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Number of total debates: {t.totalCount}
                    </CardContent>
                    <CardFooter>
                      <p>Card Footer</p>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
          <div>
            <h1 className="text-2xl text-left ml-10">Browse all Topics</h1>
          </div>
        </>
      ) : (
        <div>Something went wrong.</div>
      )}
    </div>
  );
};

export default Topics;
