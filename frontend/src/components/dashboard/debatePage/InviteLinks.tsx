// components/dashboard/debatePage/InviteLinks.tsx

import { useState, useEffect } from "react";
import { useDebateContextNonNull } from "../../../context/debateContext";
import { Button } from "../../ui/button";
import { ScriptCopyBtn } from "../../magicui/script-copy-btn";
import api from "../../../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";

const InviteLinks = () => {
  const { debate } = useDebateContextNonNull();
  const [links, setLinks] = useState<Record<string, string>>({
    Admin: "",
    Debater: "",
    Observer: "",
  });
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Fetches invite links if they exist
  useEffect(() => {
    const fetchInviteLinks = async () => {
      try {
        const { data } = await api.get(`/debates/${debate.id}/invites`);

        if (data) {
          setLinks((prev) => ({
            ...prev,
            ...data.responseMap,
          }));
          setExpiresAt(data.expiresAt);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching invite links:", error);
          toast.error("Error loading invite links.", {
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

    fetchInviteLinks();
  }, [debate.id]);

  const handleGenerateInvites = async () => {
    try {
      const roles = ["ADMIN", "DEBATER", "OBSERVER"];
      const labelMap = {
        ADMIN: "Admin",
        DEBATER: "Debater",
        OBSERVER: "Observer",
      };
      let newExpiresAt = "";
      const responses = await Promise.all(
        roles.map((role) =>
          api.post(`/debates/${debate.id}/invites`, { role }).then((res) => {
            newExpiresAt = res.data.expiresAt;
            return {
              label: labelMap[role as keyof typeof labelMap],
              link: `${window.location.origin}/dashboard/debates/${debate.id}?invite=${res.data.token}`,
            };
          })
        )
      );

      const newLinks: Record<string, string> = {};
      responses.forEach(({ label, link }) => {
        newLinks[label] = link;
      });

      setLinks(newLinks);
      setExpiresAt(newExpiresAt);
      setTimeLeft(
        Math.floor(
          (new Date(newExpiresAt).getTime() - new Date().getTime()) / 1000
        )
      );

      toast.success("Invite links successfully created.", {
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
      if (axios.isAxiosError(error)) {
        console.error("Error generating invite links:", error);
        toast.error("Error generating invite links.", {
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

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(Math.floor((expiry - now) / 1000), 0); // in seconds
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Expired";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${
      secs < 10 ? "0" : ""
    }${secs}s`;
  };
  return (
    <>
      {links["Admin"].length > 0 && timeLeft > 0 ? (
        <>
          <div className="text-left">
            <ScriptCopyBtn
              showMultiplePackageOptions={true}
              codeLanguage="text"
              lightTheme=""
              darkTheme=""
              commandMap={links}
            />
          </div>
          <p className="text-left text-sm text-muted-foreground">
            Expires in: {formatTime(timeLeft)}
          </p>
        </>
      ) : (
        <Button variant="default" onClick={handleGenerateInvites}>
          Generate Invite links
        </Button>
      )}
    </>
  );
};

export default InviteLinks;
