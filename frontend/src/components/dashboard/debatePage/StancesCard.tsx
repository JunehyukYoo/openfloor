// components/dashboard/debatePage/StancesCard.tsx
import {
  Card,
  CardContent,
  //   CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { hasAdminPermissions } from "../../../utils/debateUtils";
import { useDebateContext } from "../../../context/debateContext";
import { Button } from "../../ui/button";
import { SiteHeader as PageHeader } from "../site-header";

const StancesCard = () => {
  const { debate, userDetails } = useDebateContext();
  const isAdmin = userDetails && hasAdminPermissions(userDetails.role);

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
