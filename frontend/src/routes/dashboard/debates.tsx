// routes/dashboard/debates.tsx
import { useState, useEffect } from "react";
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen";
import axios from "axios";
import api from "../../../api/axios";
import type { AllDebateData } from "../../types";

const Debates = () => {
  const [debates, setDebates] = useState<AllDebateData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getDebates = async () => {
      try {
        const { data } = await api.get("dashboard/debates");
        setDebates(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message, {});
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
      <div>
        {debates ? (
          <div>
            <div>
              <h1 className="text-2xl">Created Debates</h1>
              {debates.createdDebates.length > 0 ? (
                debates.createdDebates.map((d) => {
                  return (
                    <div onClick={() => navigate(`${d.debate.id}`)}>
                      {d.debate.id}
                    </div>
                  );
                })
              ) : (
                <div>No debates created yet.</div>
              )}
            </div>
            <div>
              <h1 className="text-2xl">Joined Debates</h1>
              {debates.joinedDebates.length > 0 ? (
                debates.joinedDebates.map((d) => {
                  return (
                    <div onClick={() => navigate(`${d.debate.id}`)}>
                      {d.debate.id}
                    </div>
                  );
                })
              ) : (
                <div>No debates joined yet.</div>
              )}
            </div>
          </div>
        ) : (
          <div>Something went wrong.</div>
        )}
      </div>
    </>
  );
};

export default Debates;
