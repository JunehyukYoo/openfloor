// components/dashboard/debatePage/StancesCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { hasAdminPermissions } from "../../../utils/debateUtils";
import { useDebateContextNonNull } from "../../../context/debateContext";
import { Button } from "../../ui/button";
import { SiteHeader as PageHeader } from "../site-header";

const StancesCard = () => {
  const { debate, userDetails } = useDebateContextNonNull();
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
    <Card className="bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Stances</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {debate.stances.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {debate.stances.map((stance) => {
              return (
                <AccordionItem key={stance.id} value={`stance-${stance.id}`}>
                  <AccordionTrigger className="text-lg">
                    {stance.label}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4">
                    {stance.justifications &&
                    stance.justifications.length > 0 ? (
                      stance.justifications.map((j) => {
                        return <p>{j.content}</p>;
                      })
                    ) : (
                      <p>No justifications yet.</p>
                    )}
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
      {isAdmin && (
        <Button variant="outline" className="ml-6 mr-6">
          Edit
        </Button>
      )}
    </Card>
  );
};

export default StancesCard;
