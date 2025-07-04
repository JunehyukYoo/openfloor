// pages/dashboard/debate-page.tsx
import { DebateProvider } from "../../context/debateProvider";
import { useDebateParams } from "../../hooks/use-debate";
import DebatePageContent from "../../components/dashboard/debatePage/DebatePageContent";

const DebatePage = () => {
  const { debateId, inviteToken } = useDebateParams();

  if (!debateId) return <div className="p-8">Debate ID not provided.</div>;

  return (
    <DebateProvider debateId={debateId} inviteToken={inviteToken}>
      <DebatePageContent />
    </DebateProvider>
  );
};

export default DebatePage;
