// pages/dashboard/debates.tsx
import { useState, useEffect } from "react";
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { DebatesTable } from "../../components/dashboard/debates/DebatesTable";
import axios from "axios";
import api from "../../../api/axios";
import type { DebateDataMini, Quote } from "../../types";

const Debates = () => {
  const [createdDebates, setCreatedDebates] = useState<DebateDataMini[] | null>(
    null
  );
  const [joinedDebates, setJoinedDebates] = useState<DebateDataMini[] | null>(
    null
  );
  const [quote, setQuote] = useState<Quote>({
    text: "Error fetching daily quote, please try again later.",
    author: "notjune",
  });
  const [loading, setLoading] = useState(true);

  const fetchDebates = async () => {
    try {
      const { data } = await api.get("/debates");
      setCreatedDebates(data.createdDebates);
      setJoinedDebates(data.joinedDebates);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching debates:", error);
        toast.error("Error fetching debates.");
      }
    }
  };

  useEffect(() => {
    const getDebates = async () => {
      await fetchDebates();
      try {
        const quoteData = await api.get("/quote");
        setQuote(quoteData.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    getDebates();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Debates" />
        <LoadingScreen />
      </div>
    );
  }
  return (
    <>
      <PageHeader title="Debates" />
      <section className="pl-4 pr-4 flex flex-col gap-4">
        <h1 className="text-4xl text-left pt-4">Your Debates</h1>
        {/* Quote */}
        <div>
          <div className="text-lg text-gray-400 italic">
            <p>"{quote.text}"</p>
            <p className="text-right">- {quote.author}</p>
          </div>
        </div>
        <div>
          <Tabs defaultValue="created">
            <TabsList className="bg-zinc-900">
              <TabsTrigger value="created">Created Debates</TabsTrigger>
              <TabsTrigger value="joined">Joined Debates</TabsTrigger>
            </TabsList>
            <TabsContent value="created">
              {createdDebates ? (
                <DebatesTable
                  data={createdDebates}
                  refreshDebates={fetchDebates}
                />
              ) : (
                <div>No created debates found.</div>
              )}
            </TabsContent>
            <TabsContent value="joined">
              {joinedDebates ? (
                <DebatesTable
                  data={joinedDebates}
                  refreshDebates={fetchDebates}
                />
              ) : (
                <div>No joined debates found.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default Debates;
