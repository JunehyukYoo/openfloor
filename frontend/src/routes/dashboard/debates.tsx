// routes/dashboard/debates.tsx
import { useState, useEffect } from "react";
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../../../api/axios";
import type { AllDebateData } from "../../types";

const Debates = () => {
  const [debates, setDebates] = useState<AllDebateData | null>(null);

  useEffect(() => {
    const getDebates = async () => {
      try {
        const { data } = await api.get("dashboard/debates");
        setDebates(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message, {});
        }
      }
    };
    getDebates();
  }, []);

  return (
    <>
      <PageHeader title="Debates" />
      <div>
        {debates ? (
          <div>
            <div>
              <h1 className="text-2xl">Created Debates</h1>
              {debates.createdDebates.map((d) => {
                return <div>{d.debate.id}</div>;
              })}
            </div>
            <div>
              <h1 className="text-2xl">Joined Debates</h1>
              {debates.joinedDebates.map((d) => {
                return <div>{d.debate.id}</div>;
              })}
            </div>
          </div>
        ) : (
          <div>Something went wrong</div>
        )}
      </div>
    </>
  );
};

export default Debates;
