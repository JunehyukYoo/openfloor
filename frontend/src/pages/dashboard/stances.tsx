// pages/dashboard/stances.tsx

import { DebateProvider } from "../../context/debateProvider";
import StancesContent from "../../components/dashboard/debatePage/stancesPage/StancesContent";
import { useDebateParams } from "../../hooks/use-debate";
const Stances = () => {
  const { debateId, inviteToken } = useDebateParams();

  if (!debateId) return <div className="p-8">Debate ID not provided.</div>;
  return (
    <DebateProvider debateId={debateId} inviteToken={inviteToken}>
      <StancesContent />
    </DebateProvider>
  );
};

export default Stances;
