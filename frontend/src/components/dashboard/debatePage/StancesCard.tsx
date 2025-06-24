// components/dashboard/debatePage/StancesCard.tsx
import {
  Card,
  CardContent,
  //   CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { hasAdminPermissions } from "../../../utils/debateUtils";
import type { Debate, Participant } from "../../../types";
import { Button } from "../../ui/button";

const StancesCard = ({
  debate,
  userDetails,
}: {
  debate: Debate;
  userDetails: Participant | null;
}) => {
  const isAdmin = userDetails && hasAdminPermissions(userDetails.role);
  return (
    <Card className="bg-neutral-900 min-h-[250px]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Stances</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {debate.stances!.length > 0 ? (
          debate.stances!.map((stance) => {
            return (
              <Card
                key={stance.id}
                className="p-4 bg-gradient-to-t from-neutral-900 to-neutral-800 transition duration-300"
              >
                <h3 className="text-lg text-center font-semibold">
                  {stance.label}
                </h3>
              </Card>
            );
          })
        ) : isAdmin ? (
          <p>Add a new stance!</p>
        ) : (
          <p>No stances yet avaliable.</p>
        )}
      </CardContent>
      {isAdmin && (
        <Button variant="outline" className="ml-6 mr-6">
          Edit
        </Button>
      )}
    </Card>
  );
};

export default StancesCard;
