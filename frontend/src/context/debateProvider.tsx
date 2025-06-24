// components/providers/DebateProvider.tsx
import { DebateContext } from "./debateContext";
import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoadingScreen from "../components/LoadingScreen";
import { SiteHeader as PageHeader } from "../components/dashboard/site-header";
import type { DebateDataFull, Participant } from "../types";

export const DebateProvider = ({
  debateId,
  children,
  inviteToken,
}: {
  debateId: string;
  children: ReactNode;
  inviteToken?: string | null;
}) => {
  const [debate, setDebate] = useState<DebateDataFull | null>(null);
  const [userDetails, setUserDetails] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  const getDebate = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/debates/${debateId}${inviteToken ? `?invite=${inviteToken}` : ""}`
      );
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
  }, [debateId, inviteToken]);

  useEffect(() => {
    getDebate();
  }, [getDebate]);
  if (loading)
    return (
      <div className="h-full w-full flex flex-col gap-4">
        <PageHeader title="Debate" />
        <LoadingScreen />
      </div>
    );

  return (
    <DebateContext.Provider
      value={{ debate, userDetails, refreshDebate: getDebate }}
    >
      {children}
    </DebateContext.Provider>
  );
};
