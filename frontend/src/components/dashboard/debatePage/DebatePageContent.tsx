// components/dashboard/debatePage/DebatePageContent.tsx
import { useState, useEffect } from "react";
import { SiteHeader as PageHeader } from "../../dashboard/site-header";
import { useDebateContextNonNull } from "../../../context/debateContext";
import StancesCard from "../../dashboard/debatePage/StancesCard";
import InfoTabs from "../../dashboard/debatePage/InfoTabs";
import { Separator } from "../../ui/separator";
import SupportOverview from "./SupportOverview";
import type { SupportDetails } from "../../../types";
import api from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingScreen from "../../LoadingScreen";

const DebatePageContent = () => {
  const { debate } = useDebateContextNonNull();
  const [supportMap, setSupportMap] = useState<SupportDetails[] | null>(null);

  // Retrieve support overview data
  useEffect(() => {
    const getSupportOverview = async () => {
      try {
        const { data } = await api.get(`/debates/${debate.id}/support`);
        setSupportMap(data.supportMap);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error loading support details:", error);
          toast.error("Error loading support details.", {
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
    getSupportOverview();
  }, [debate.id]);

  if (!debate) {
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Debate" breadcrumb="Invalid" />
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Debate not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Debates"
        breadcrumb={`${debate.creator.username}'s Debate`}
      />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="text-left scroll-m-20 text-4xl font-bold text-balance">
          {debate.topic.title}
        </h1>
        <Separator />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-stretch gap-4">
          {supportMap ? (
            <SupportOverview chartData={supportMap} />
          ) : (
            <LoadingScreen />
          )}
          <InfoTabs />
        </div>
        <StancesCard />
      </div>
    </div>
  );
};

export default DebatePageContent;
