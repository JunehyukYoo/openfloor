// routes/topics.tsx
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { Badge } from "../../components/ui/badge";
import { IconTrendingUp } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import type { AllTopicData } from "../../types";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import TopicViewer from "../../components/dashboard/TopicViewer";
import { DataTable, columns } from "../../components/dashboard/DataTable";
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
          {/* Trending weekly section */}
          <section className="flex flex-col p-2 gap-4">
            <h1 className="text-4xl text-left ">Trending Weekly</h1>
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {topics.trendingTopics.map((t) => {
                return (
                  <Card
                    key={t.id + t.title}
                    className="col-span-1 flex flex-col justify-between min-h-[200px] bg-gradient-to-t from-neutral-900 to-neutral-800 hover:*:opacity-100 hover:scale-101 transition-all duration-300 ease"
                  >
                    <CardHeader>
                      <CardDescription className="text-left">
                        {t.recentPublicDebateCount} debates in the last week.
                      </CardDescription>
                      <CardAction>
                        <Badge variant="outline">
                          <IconTrendingUp />
                          Trending
                        </Badge>
                      </CardAction>
                      <CardTitle className="text-xl font-semibold text-left">
                        {t.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="opacity-0 transition-opacity duration-500 ease">
                      <div className="translate-x-[-15px]">
                        <TopicViewer item={t} title="View debates →" />
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Recommended topics section */}
          <section className="flex flex-col p-2 gap-4">
            <h1 className="text-4xl text-left">Recommended</h1>
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {topics.recommendedTopics.map((t) => {
                return (
                  <Card
                    key={t.id + t.title}
                    className="col-span-1 flex flex-col justify-between min-h-[200px] bg-gradient-to-t from-neutral-900 to-neutral-800 hover:*:opacity-100 hover:scale-101 transition-all duration-300 ease"
                  >
                    <CardHeader>
                      <CardAction>
                        <Badge variant="outline">
                          <IconTrendingUp />
                          Recommended
                        </Badge>
                      </CardAction>
                      <CardTitle className="text-xl font-semibold text-left">
                        {t.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="text-sm opacity-0 transition-opacity duration-500 ease">
                      <div className="translate-x-[-15px]">
                        <TopicViewer item={t} title="View debates →" />
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>
          {/* All topics data table section */}
          <section className="p-2">
            <h1 className="text-4xl text-left p-2">Browse all Topics</h1>
            <DataTable columns={columns} data={topics.allTopics} />
          </section>

          <section className="p-2 mb-4 flex flex-col gap-2 items-center">
            <h1 className="text-2xl">
              Have a topic you want to debate? Submit a request here!
            </h1>
            <Button variant="default" className="max-w-100">
              Submit a request
            </Button>
          </section>
        </>
      ) : (
        <div>Something went wrong.</div>
      )}
    </div>
  );
};

export default Topics;
