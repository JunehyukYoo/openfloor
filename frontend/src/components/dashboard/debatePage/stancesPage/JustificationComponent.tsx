import type { Justification, Vote } from "../../../../types";
import { useState, useEffect } from "react";
import { Card } from "../../../ui/card";
import Author from "../Author";
import { Button } from "../../../ui/button";
import {
  IconArrowBigUp,
  IconArrowBigDown,
  IconArrowBigUpFilled,
  IconArrowBigDownFilled,
} from "@tabler/icons-react";
import Comment from "./CommentComponent";
import {
  getTimeAgo,
  hasDebatePermissions,
} from "../../../../utils/debateUtils";
import { useDebateContextNonNull } from "../../../../context/debateContext";
import api from "../../../../../api/axios";
import { toast } from "react-toastify";

const JustificationComponent = ({
  justification,
}: {
  justification: Justification;
}) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState<string>("");
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

  useEffect(
    () => setTimeAgo(getTimeAgo(new Date(justification.createdAt))),
    [justification.createdAt]
  );

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

  const handleComment = async (parentId?: number) => {
    if (!commentInput.trim()) return;
    setIsLoading(true);
    try {
      // parentId for nested comments
      const data = parentId
        ? { content: commentInput, parentId }
        : { content: commentInput };
      await api.post(
        `/debates/${debate.id}/justification/${justification.id}/comments`,
        data
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

  return (
    <Card className="bg-neutral-900 pt-1 pb-1">
      <div className="flex gap-4 p-4">
        <Author
          username={justification.author!.username}
          profilePicture={justification.author!.profilePicture}
        />
        <div className="text-left pt-1">
          <p className="font-semibold">
            {justification.author!.username} -{" "}
            <span className="text-muted-foreground text-sm">{timeAgo}</span>
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
                <Button
                  size="sm"
                  onClick={() => handleComment()}
                  disabled={isLoading}
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          )}
          {showComments &&
            (hasComments ? (
              <div className="flex flex-col gap-4 pt-4">
                {justification.comments?.map((comment) => {
                  return (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      onComment={handleComment}
                    />
                  );
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

export default JustificationComponent;
