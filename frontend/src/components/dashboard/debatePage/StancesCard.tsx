// components/dashboard/debatePage/StancesCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import {
  IconArrowBigUp,
  IconArrowBigDown,
  IconArrowBigUpFilled,
  IconArrowBigDownFilled,
} from "@tabler/icons-react";
import {
  hasAdminPermissions,
  hasDebatePermissions,
} from "../../../utils/debateUtils";
import { useNavigate } from "react-router-dom";
import { useDebateContextNonNull } from "../../../context/debateContext";
import { Button } from "../../ui/button";
import { SiteHeader as PageHeader } from "../site-header";
import { Avatar, AvatarImage } from "../../ui/avatar";
import type { Vote } from "../../../types";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import { EditStances, AddStances } from "./StancesDialogs";

const StancesCard = () => {
  const { debate, userDetails, refreshDebate } = useDebateContextNonNull();
  const isAdmin =
    userDetails && !debate.closed && hasAdminPermissions(userDetails.role);
  const canDebate =
    userDetails && !debate.closed && hasDebatePermissions(userDetails.role);
  const navigate = useNavigate();
  const handleVote = async (
    justificationId: number,
    value: number,
    userVote: Vote | undefined
  ) => {
    try {
      if (!userVote) {
        // User hasn't voted yet: create vote
        await api.post(
          `/debates/${debate.id}/justification/${justificationId}/votes`,
          { value }
        );
      } else if (userVote.value === value) {
        // User clicked the same vote: delete (toggle off)
        await api.delete(
          `/debates/${debate.id}/justification/${justificationId}/votes/${userVote.id}`
        );
      } else {
        // User switches vote direction: update
        await api.put(
          `/debates/${debate.id}/justification/${justificationId}/votes/${userVote.id}`,
          { value }
        );
      }
      refreshDebate();
    } catch (error) {
      console.error("Error processing vote:", error);
      toast.error("Error processing vote.", {
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
    <Card className="bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Stances</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {debate.stances.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {debate.stances.map((stance, i) => {
              return (
                <AccordionItem
                  key={`s-${stance.id}-accordion`}
                  value={`stance-${stance.id}`}
                >
                  <AccordionTrigger className="text-lg">
                    {stance.label} {i === 0 && "(leading)"}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4">
                    <Card className="p-4 bg-neutral-800/[0.9]">
                      {stance.justifications &&
                      stance.justifications.length > 0 ? (
                        stance.justifications.map((j, idx) => {
                          const userVote = j.votes?.find(
                            (v) => v.userId === userDetails!.userId
                          );
                          const isUpvoted = userVote?.value === 1;
                          const isDownvoted = userVote?.value === -1;
                          return (
                            <div
                              key={`j-${j.id}-accordion`}
                              className="flex gap-4"
                            >
                              <h3 className="flex gap-2 items-center">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={j.author?.profilePicture}
                                    alt={j.author?.username}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                </Avatar>
                                <div className="flex flex-col text-left">
                                  <span className="font-medium">
                                    {j.author?.username}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {j.author?.email}
                                  </span>
                                </div>
                              </h3>
                              <h3 className="text-[18px] grow pt-2">
                                <span className="underline text-sm">
                                  {idx === 0
                                    ? "TOP Justification"
                                    : `Justification #${idx + 1}`}
                                </span>{" "}
                                {j.content}
                              </h3>
                              <h3 className="flex gap-1 items-center">
                                {j.votes?.reduce((acc, v) => acc + v.value, 0)}
                                {!isUpvoted ? (
                                  <IconArrowBigUp
                                    size={24}
                                    onClick={() =>
                                      !debate.closed &&
                                      canDebate &&
                                      handleVote(j.id, 1, userVote)
                                    }
                                    className={
                                      !debate.closed && canDebate
                                        ? "hover:scale-110 transition-all duration-200 ease"
                                        : ""
                                    }
                                  />
                                ) : (
                                  <IconArrowBigUpFilled
                                    size={24}
                                    onClick={() =>
                                      canDebate && handleVote(j.id, 1, userVote)
                                    }
                                    className={
                                      canDebate
                                        ? "hover:scale-110 transition-all duration-200 ease"
                                        : ""
                                    }
                                  />
                                )}

                                {!isDownvoted ? (
                                  <IconArrowBigDown
                                    size={24}
                                    onClick={() =>
                                      canDebate &&
                                      handleVote(j.id, -1, userVote)
                                    }
                                    className={
                                      canDebate
                                        ? "hover:scale-110 transition-all duration-200 ease"
                                        : ""
                                    }
                                  />
                                ) : (
                                  <IconArrowBigDownFilled
                                    size={24}
                                    onClick={() =>
                                      canDebate &&
                                      handleVote(j.id, -1, userVote)
                                    }
                                    className={
                                      canDebate
                                        ? "hover:scale-110 transition-all duration-200 ease"
                                        : ""
                                    }
                                  />
                                )}
                              </h3>
                            </div>
                          );
                        })
                      ) : (
                        <p>No justifications yet.</p>
                      )}
                    </Card>
                    <div className="flex justify-end">
                      <Button
                        variant="link"
                        onClick={() => navigate(`stances/${stance.id}`)}
                      >
                        View details
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : isAdmin ? (
          <p>Add a new stance!</p>
        ) : (
          <p>No stances yet avaliable.</p>
        )}
      </CardContent>
      <CardFooter className="w-full flex justify-end">
        {isAdmin && (
          <div className="flex gap-2">
            <AddStances />
            <EditStances />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default StancesCard;
