// components/dashboard/debatePage/stancesPage/CommentComponent.tsx

import type { Comment } from "../../../../types";
import { Button } from "../../../ui/button";
import { useState, useEffect } from "react";
import { getTimeAgo } from "../../../../utils/debateUtils";
import Author from "../Author";
import { hasDebatePermissions } from "../../../../utils/debateUtils";
import { useDebateContextNonNull } from "../../../../context/debateContext";

const CommentComponent = ({
  comment,
  onComment,
}: {
  comment: Comment;
  onComment: ({
    content,
    parentId,
  }: {
    content: string;
    parentId?: number;
  }) => Promise<void>;
}) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const { debate, userDetails } = useDebateContextNonNull();
  const hasComments = comment.children && comment.children.length > 0;
  const canDebate =
    userDetails && !debate.closed && hasDebatePermissions(userDetails.role);

  useEffect(
    () => setTimeAgo(getTimeAgo(new Date(comment.createdAt))),
    [comment.createdAt]
  );

  return (
    <div className="relative flex gap-4">
      <div className="pl-4">
        <Author
          username={comment.author!.username}
          profilePicture={comment.author!.profilePicture}
        />
      </div>
      <div className="grow pt-1">
        <p className="font-semibold">
          {comment.author!.username} -{" "}
          <span className="text-muted-foreground text-sm">{timeAgo}</span>
        </p>
        <p className="text-wrap">{comment.content}</p>
        <div className="flex gap-2">
          <Button
            variant="link"
            className="m-0 p-0"
            disabled={!canDebate}
            onClick={() => setIsCommenting(!isCommenting)}
          >
            Reply
          </Button>
          <Button
            variant="link"
            className="m-0 p-0"
            disabled={!hasComments}
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? "Hide replies" : "Show replies"}
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
                onClick={async () => {
                  setIsLoading(true);
                  await onComment({
                    content: commentInput,
                    parentId: comment.id,
                  });
                  setIsLoading(false);
                  setIsCommenting(false);
                  setCommentInput("");
                }}
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        )}
        {showComments && (
          <div className="mt-4 border-l-2 border-neutral-400">
            {comment.children?.map((reply) => (
              <CommentComponent
                key={reply.id}
                comment={reply}
                onComment={onComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;
