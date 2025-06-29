// components/dashboard/depatePage/stancesPage/StancesContent.tsx
import { SiteHeader as PageHeader } from "../../site-header";
import { useParams } from "react-router-dom";
import { useDebateContextNonNull } from "../../../../context/debateContext";
import { Separator } from "../../../ui/separator";
import { Card } from "../../../ui/card";
import Justification from "./JustificationComponent";

const StancesContent = () => {
  const { debate } = useDebateContextNonNull();
  const { stanceId } = useParams();
  const stance = debate.stances.find((s) => s.id === Number(stanceId));
  if (!stance) {
    return (
      <>
        <PageHeader
          title="Debates"
          breadcrumb={[`${debate.creator.username}'s Debate`, "Invalid"]}
          debateId={debate.id}
        />
        <div>No such stance found.</div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Debates"
        breadcrumb={[`${debate.creator.username}'s Debate`, stance.label]}
        debateId={debate.id}
      />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-left scroll-m-20 text-4xl font-bold text-balance">
          <span className="text-lg">{debate.topic.title}</span> {stance.label}
        </h1>
        <Separator />
        {stance.justifications && stance.justifications.length > 0 ? (
          <>
            {stance.justifications.map((j) => (
              <Justification key={`${j.id}-detailed`} justification={j} />
            ))}
          </>
        ) : (
          <Card>Nothing here yet</Card>
        )}
      </div>
    </>
  );
};

export default StancesContent;
