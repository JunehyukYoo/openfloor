// components/dashboard/debatePage/stancesPage/CommentComponent.tsx

import type { Comment } from "../../../../types";
import { Button } from "../../../ui/button";
import React, { useState, useEffect } from "react";
import { getTimeAgo } from "../../../../utils/debateUtils";
import Author from "../Author";

const CommentComponent = ({
  comment,
  depth,
  avatarRef,
  onComment,
  onLayoutChange,
}: {
  comment: Comment;
  depth: number;
  avatarRef?: React.RefObject<HTMLDivElement | null>;
  onComment: ({
    content,
    parentId,
  }: {
    content: string;
    parentId?: number;
  }) => Promise<void>;
  onLayoutChange: () => void | null;
}) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const hasComments = comment.children && comment.children.length > 0;

  useEffect(
    () => setTimeAgo(getTimeAgo(new Date(comment.createdAt))),
    [comment.createdAt]
  );

  // Trigger recalculation after state change
  // (but since state updates are batched, wait for next tick)
  const toggleReplies = () => {
    setShowComments((prev) => {
      const newValue = !prev;
      setTimeout(() => {
        if (depth === 0) {
          onLayoutChange();
        }
      }, 0);
      return newValue;
    });
  };

  return (
    <div className="relative flex gap-4">
      <div className="absolute -left-[33px] top-2 -translate-y-1/2 w-10 h-10">
        <div className="flex items-center">
          <div className="h-6 w-full border-l-2 border-b-2 border-neutral-200 rounded-bl-4xl"></div>
          <div className="h-px bg-neutral-200 flex-1"></div>
        </div>
      </div>
      <div ref={depth === 0 ? avatarRef : undefined}>
        <Author
          username={comment.author!.username}
          profilePicture={comment.author!.profilePicture}
        />
      </div>
      {hasComments && showComments && (
        <div className="absolute w-6">
          <div className="w-[2px] bg-neutral-200 translate-x-[15px] translate-y-8 h-15" />
        </div>
      )}
      <div className="grow pt-1">
        <p className="font-semibold">
          {comment.author!.username} -{" "}
          <span className="text-muted-foreground text-sm">{timeAgo}</span>
        </p>
        <p>{comment.content}</p>
        <div className="flex gap-2">
          <Button
            variant="link"
            className="m-0 p-0 "
            onClick={() => setIsCommenting(!isCommenting)}
          >
            Reply
          </Button>
          <Button
            variant="link"
            className="m-0 p-0"
            disabled={!hasComments}
            onClick={toggleReplies}
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
          <div className="mt-4">
            {comment.children?.map((reply) => (
              <CommentComponent
                key={reply.id}
                depth={depth + 1}
                comment={reply}
                onLayoutChange={onLayoutChange}
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
