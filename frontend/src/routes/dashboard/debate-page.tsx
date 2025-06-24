// routes/dashboard/debate-page.tsx
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  //   CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
import InfoTabs from "../../components/dashboard/debates/InfoTabs";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen";
import axios from "axios";
import api from "../../../api/axios";
import type { DebateDataFull, Participant } from "../../types";
import { Separator } from "../../components/ui/separator";
import { hasAdminPermissions } from "../../utils/debateUtils";

const DebatePage = () => {
  const { id } = useParams();
  const [debate, setDebate] = useState<DebateDataFull | null>(null);
  const [userDetails, setUserDetails] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getDebate = async () => {
      try {
        const { data } = await api.get(`/dashboard/debates/${id}`);
        setDebate(data.debate);
        setUserDetails(data.userDetails);
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
    getDebate();
  }, [id]);
  if (loading) {
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Debate" />
        <LoadingScreen />
      </div>
    );
  } else if (!debate) {
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stances Section */}
          <Card className="bg-neutral-900">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Stances</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {debate.stances.length > 0 ? (
                debate.stances.map((stance) => {
                  return (
                    <Card
                      key={stance.id}
                      className="p-4 bg-neutral-800/[0.5] rounded-lg hover:bg-neutral-800 transition duration-300"
                    >
                      <h3 className="text-lg text-center font-semibold">
                        {stance.label}
                      </h3>
                    </Card>
                  );
                })
              ) : hasAdminPermissions(userDetails!.role) ? (
                <p>Add a new stance!</p>
              ) : (
                <p>No stances yet avaliable.</p>
              )}
            </CardContent>
          </Card>
          {/* Info section (w/ tabs) */}
          <InfoTabs debate={debate} userDetails={userDetails} />
        </div>
      </div>
    </div>
  );
};

export default DebatePage;
