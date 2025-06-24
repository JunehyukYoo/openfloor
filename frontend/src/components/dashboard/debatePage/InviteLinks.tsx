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

  // Fetches invite links if they exist
  useEffect(() => {
    const fetchInviteLinks = async () => {
      try {
        const { data } = await api.get(`/debates/${debate.id}/invites`);

        if (data) {
          setLinks((prev) => ({
            ...prev,
            ...data,
          }));
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
      const responses = await Promise.all(
        roles.map((role) =>
          api.post(`/debates/${debate.id}/invites`, { role }).then((res) => ({
            label: labelMap[role as keyof typeof labelMap],
            link: `${window.location.origin}/dashboard/debates/${debate.id}?invite=${res.data.token}`,
          }))
        )
      );
      const newLinks: Record<string, string> = {};
      responses.forEach(({ label, link }) => {
        newLinks[label] = link;
      });

      setLinks(newLinks);
      toast.success("All invite links copied to clipboard!", {
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

  return (
    <>
      {links["Admin"].length > 0 ? (
        <ScriptCopyBtn
          showMultiplePackageOptions={true}
          codeLanguage="text"
          lightTheme=""
          darkTheme=""
          commandMap={links}
        />
      ) : (
        <Button variant="default" onClick={handleGenerateInvites}>
          Generate Invite links
        </Button>
      )}
    </>
  );
};

export default InviteLinks;
