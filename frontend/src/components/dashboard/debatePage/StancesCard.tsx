// components/dashboard/debatePage/StancesCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { IconArrowBigUp, IconArrowBigDown } from "@tabler/icons-react";
import { hasAdminPermissions } from "../../../utils/debateUtils";
import { useDebateContextNonNull } from "../../../context/debateContext";
import { Button } from "../../ui/button";
import { SiteHeader as PageHeader } from "../site-header";
import { Avatar, AvatarImage } from "../../ui/avatar";

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
                    <Card className="p-4 bg-neutral-800/[0.9]">
                      {stance.justifications &&
                      stance.justifications.length > 0 ? (
                        stance.justifications.map((j, idx) => {
                          return (
                            <div className="flex gap-4">
                              <h3 className="flex gap-2">
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
                                <span className="underline">
                                  {idx === 0
                                    ? "TOP Justification"
                                    : `Justification #${idx + 1}`}
                                </span>{" "}
                                {j.content}
                              </h3>
                              <h3 className="flex gap-1 items-center">
                                {j.votes?.reduce((acc, v) => acc + v.value, 0)}
                                <IconArrowBigUp
                                  size={24}
                                  className="hover:scale-110 transition-all duration-200 ease"
                                />
                                <IconArrowBigDown
                                  size={24}
                                  className="hover:scale-110 transition-all duration-200 ease"
                                />
                              </h3>
                            </div>
                          );
                        })
                      ) : (
                        <p>No justifications yet.</p>
                      )}
                    </Card>
                    <Button variant="link" className="justify-end">
                      View details
                    </Button>
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
