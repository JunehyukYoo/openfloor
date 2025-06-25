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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const getDebate = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/debates/${debateId}${inviteToken ? `?invite=${inviteToken}` : ""}`
      );
      setDebate(data.debate);
      setUserDetails(data.userDetails);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 404) {
          // Navigate away without showing toast on deleting debate from debate page
          navigate("/dashboard/debates");
          return;
        }

        // Show toast for all other errors
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
  }, [debateId, inviteToken, navigate]);

  useEffect(() => {
    getDebate();
  }, [getDebate]);

  // Autojoining for invite token usage
  useEffect(() => {
    if (debate && !userDetails && inviteToken && debate.private) {
      const autoJoin = async () => {
        try {
          await api.post(`/debates/${debateId}/join`);
          await getDebate();
          toast.success("Successfully joined the debate!", {
            position: "top-right",
            theme: "dark",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } catch (error) {
          console.error("Auto-join failed:", error);
          toast.error("Failed to auto-join the debate.", {
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
      };

      autoJoin();
    }
  }, [debate, userDetails, inviteToken, getDebate, debateId]);

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
