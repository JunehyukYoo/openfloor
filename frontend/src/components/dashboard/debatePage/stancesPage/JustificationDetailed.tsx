import type { Justification, Vote } from "../../../../types";
import { useState } from "react";
import { Card } from "../../../ui/card";
import { Avatar, AvatarImage } from "../../../ui/avatar";
import { Button } from "../../../ui/button";
import {
  // hasAdminPermissions,
  hasDebatePermissions,
} from "../../../../utils/debateUtils";
import { useDebateContextNonNull } from "../../../../context/debateContext";
import api from "../../../../../api/axios";
import { toast } from "react-toastify";
import {
  IconArrowBigUp,
  IconArrowBigDown,
  IconArrowBigUpFilled,
  IconArrowBigDownFilled,
} from "@tabler/icons-react";

const JustificationDetailed = ({
  justification,
}: {
  justification: Justification;
}) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { debate, userDetails, refreshDebate } = useDebateContextNonNull();
  const canDebate =
    userDetails && !debate.closed && hasDebatePermissions(userDetails.role);
  const userVote = justification.votes?.find(
    (v) => v.userId === userDetails!.userId
  );
  const isUpvoted = userVote?.value === 1;
  const isDownvoted = userVote?.value === -1;
  const hasComments =
    justification.comments && justification.comments.length > 0;

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

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    setIsLoading(true);
    try {
      await api.post(
        `/debates/${debate.id}/justification/${justification.id}/comments`,
        { content: commentInput }
      );
      setCommentInput("");
      setIsCommenting(false);
      refreshDebate();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment.", {
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
      setIsLoading(false);
    }
  };

  const getTimeAgo = () => {
    let diff = Math.floor(
      (Date.now() - new Date(justification.createdAt).getTime()) / 1000
    );
    if (diff < 60) {
      return `${diff}s Ago`;
    }
    diff = Math.floor(diff / 60);
    if (diff < 60) {
      return `${diff}min Ago`;
    }
    diff = Math.floor(diff / 60);
    if (diff < 24) {
      return `${diff}h Ago`;
    }
    diff = Math.floor(diff / 24);
    if (diff < 7) {
      return `${diff}d Ago`;
    }
    diff = Math.floor(diff / 7);
    if (diff < 20) {
      return `${diff}w Ago`;
    }
    diff = Math.floor(diff / 4);
    if (diff < 12) {
      return `${diff}mon Ago`;
    }
    diff = Math.floor(diff / 12);
    return `${diff}y Ago`;
  };

  return (
    <Card className="bg-neutral-900">
      <div className="flex gap-4 p-4">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={justification.author?.profilePicture}
            alt={justification.author?.username}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Avatar>
        <div className="text-left pt-1">
          <p className="font-semibold">
            {justification.author?.username} -{" "}
            <span className="text-muted-foreground text-sm">
              {getTimeAgo()}
            </span>
          </p>
          <p>{justification.content}</p>
          <div className="flex gap-2 items-center">
            {justification.votes?.reduce((acc, v) => acc + v.value, 0)}
            {!isUpvoted ? (
              <IconArrowBigUp
                size={20}
                onClick={() =>
                  !debate.closed &&
                  canDebate &&
                  handleVote(justification.id, 1, userVote)
                }
                className={
                  !debate.closed && canDebate
                    ? "hover:scale-110 transition-all duration-200 ease"
                    : ""
                }
              />
            ) : (
              <IconArrowBigUpFilled
                size={20}
                onClick={() =>
                  canDebate && handleVote(justification.id, 1, userVote)
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
                size={20}
                onClick={() =>
                  canDebate && handleVote(justification.id, -1, userVote)
                }
                className={
                  canDebate
                    ? "hover:scale-110 transition-all duration-200 ease"
                    : ""
                }
              />
            ) : (
              <IconArrowBigDownFilled
                size={20}
                onClick={() =>
                  canDebate && handleVote(justification.id, -1, userVote)
                }
                className={
                  canDebate
                    ? "hover:scale-110 transition-all duration-200 ease"
                    : ""
                }
              />
            )}
            <Button
              variant="link"
              className="m-0 p-0 "
              onClick={() => setIsCommenting(!isCommenting)}
            >
              Comment
            </Button>
            <Button
              variant="link"
              className="m-0 p-0"
              onClick={() => setShowComments(!showComments)}
            >
              Show comments
            </Button>
          </div>
          {isCommenting && (
            <div className="mt-2 flex flex-col gap-2 rounded-xl border-2 bg-neutral-800 text-white focus-within:outline-1">
              <textarea
                className="w-full p-2 border-0 outline-none min-h-[40px]"
                placeholder="Write your comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2 pr-2 pb-2">
                <Button size="sm" onClick={() => setIsCommenting(false)}>
                  Close
                </Button>
                <Button size="sm" onClick={handleComment} disabled={isLoading}>
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          )}
          {showComments &&
            (hasComments ? (
              <div>
                {justification.comments?.map((comment) => {
                  return <p>{comment.content}</p>;
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default JustificationDetailed;
