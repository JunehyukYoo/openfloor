import type { Justification } from "../../../../types";
import { Card } from "../../../ui/card";
import { Avatar, AvatarImage } from "../../../ui/avatar";
import { Button } from "../../../ui/button";

const JustificationDetailed = ({
  justification,
}: {
  justification: Justification;
}) => {
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
            <span className="text-muted-foreground text-sm">15h ago</span>
          </p>
          <p>{justification.content}</p>
          <div className="flex gap-2">
            <Button variant="link" className="m-0 p-0">
              Reply
            </Button>
            <Button variant="link" className="m-0 p-0">
              Show replies
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JustificationDetailed;
