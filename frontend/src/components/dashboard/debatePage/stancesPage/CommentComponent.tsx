// components/dashboard/debatePage/stancesPage/CommentComponent.tsx
import type { Comment } from "../../../../types";
import { Button } from "../../../ui/button";
import { useState, useEffect } from "react";
import { getTimeAgo } from "../../../../utils/debateUtils";
import Author from "../Author";

const CommentComponent = ({
  comment,
  onComment,
}: {
  comment: Comment;
  onComment: (parentId?: number) => Promise<void>;
}) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(
    () => setTimeAgo(getTimeAgo(new Date(comment.createdAt))),
    [comment.createdAt]
  );

  return (
    <div className="flex gap-4">
      <Author
        username={comment.author!.username}
        profilePicture={comment.author!.profilePicture}
      />
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
            onClick={() => setShowComments(!showComments)}
          >
            Show replies
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
                  await onComment(comment.id);
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
          <div className="mt-2 ml-4 border-l-2 border-neutral-700 pl-4">
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
