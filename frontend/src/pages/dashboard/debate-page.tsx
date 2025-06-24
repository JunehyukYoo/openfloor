// pages/dashboard/debate-page.tsx
import { DebateProvider } from "../../context/debateProvider";
import { useParams } from "react-router-dom";
import DebatePageContent from "../../components/dashboard/debatePage/DebatePageContent";

const DebatePage = () => {
  const { id } = useParams();

  if (!id) return <div className="p-8">Debate ID not provided.</div>;

  return (
    <DebateProvider debateId={id}>
      <DebatePageContent />
    </DebateProvider>
  );
};

export default DebatePage;
