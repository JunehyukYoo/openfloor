// components/dashboard/depatePage/stancesPage/StancesContent.tsx
import { SiteHeader as PageHeader } from "../../site-header";
import { useParams } from "react-router-dom";
import { useDebateContextNonNull } from "../../../../context/debateContext";

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
      <p>Stances here!!!</p>
    </>
  );
};

export default StancesContent;
