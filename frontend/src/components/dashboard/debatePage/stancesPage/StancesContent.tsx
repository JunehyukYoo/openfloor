// components/dashboard/debatePage/stancesPage/StancesContent.tsx
import { useState } from "react";
import { SiteHeader as PageHeader } from "../../site-header";
import { useParams } from "react-router-dom";
import { useDebateContextNonNull } from "../../../../context/debateContext";
import { Separator } from "../../../ui/separator";
import { Button } from "../../../ui/button";
import { Card } from "../../../ui/card";
import Justification from "./JustificationComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { hasDebatePermissions } from "../../../../utils/debateUtils";
import { Textarea } from "../../../ui/textarea";
import api from "../../../../../api/axios";
import { toast } from "react-toastify";

const StancesContent = () => {
  const { debate, userDetails, refreshDebate } = useDebateContextNonNull();
  const { stanceId } = useParams();
  const stance = debate.stances.find((s) => s.id === Number(stanceId));
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [justificationInput, setJustificationInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canDebate =
    userDetails && !debate.closed && hasDebatePermissions(userDetails.role);

  const handleJustification = async () => {
    if (!justificationInput.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post(
        `/debates/${debate.id}/stances/${stance?.id}/justifications`,
        {
          content: justificationInput,
        }
      );
      toast.success("Justification added!", {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      refreshDebate();
      setShowDialog(false);
      setJustificationInput("");
    } catch (error) {
      console.error("Error adding justification:", error);
      toast.error("Failed to add justification.", {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!stance) {
    return (
      <>
        <PageHeader
          title="Debates"
          breadcrumb={[`${debate.creator.username}'s Debate`, "Invalid"]}
          debateId={debate.id}
        />
        <div>No such stance found.</div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Debates"
        breadcrumb={[`${debate.creator.username}'s Debate`, stance.label]}
        debateId={debate.id}
      />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-left scroll-m-20 text-4xl font-bold text-balance">
          <span className="text-lg">{debate.topic.title}</span> <br />{" "}
          {stance.label}
        </h1>
        <Separator />
        {stance.justifications && stance.justifications.length > 0 ? (
          <>
            {stance.justifications.map((j) => (
              <Justification key={`${j.id}-detailed`} justification={j} />
            ))}
          </>
        ) : (
          <Card>Nothing here yet</Card>
        )}
        {canDebate && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="fixed align-baseline right-10 bottom-10">
                Add justification
              </Button>
            </DialogTrigger>
            <DialogContent className="dark sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Justification</DialogTitle>
              </DialogHeader>
              <Textarea
                value={justificationInput}
                onChange={(e) => setJustificationInput(e.target.value)}
                placeholder="Write your justification..."
                className="min-h-[120px]"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleJustification} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default StancesContent;
