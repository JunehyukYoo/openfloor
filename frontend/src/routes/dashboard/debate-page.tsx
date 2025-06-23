// routes/dashboard/debate-page.tsx
import { SiteHeader as PageHeader } from "../../components/dashboard/site-header";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/LoadingScreen";
import axios from "axios";
import api from "../../../api/axios";
import type { SingleDebateData } from "../../types";
const DebatePage = () => {
  const { id } = useParams();
  const [debate, setDebate] = useState<SingleDebateData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getDebate = async () => {
      try {
        const { data } = await api.get(`/dashboard/debates/${id}`);
        console.log(id, data);
        setDebate(data.debate);
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
  }

  return (
    <div>
      <PageHeader title="Debate" />
      <h1>Debate Page</h1>
      <p>Individual debate page.</p>
      {debate ? (
        <div>
          <h2>Debate ID: {debate.id}</h2>
          <p>Topic: {debate.topic.title}</p>
        </div>
      ) : (
        <div>
          <p>No debate found.</p>
        </div>
      )}
    </div>
  );
};

export default DebatePage;
