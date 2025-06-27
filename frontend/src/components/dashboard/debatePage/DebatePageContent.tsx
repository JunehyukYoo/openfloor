// components/dashboard/debatePage/DebatePageContent.tsx
import { SiteHeader as PageHeader } from "../../dashboard/site-header";
import { useDebateContextNonNull } from "../../../context/debateContext";
import StancesCard from "../../dashboard/debatePage/StancesCard";
import InfoTabs from "../../dashboard/debatePage/InfoTabs";
import { Separator } from "../../ui/separator";
import SupportOverview from "./SupportOverview";
import LoadingScreen from "../../LoadingScreen";

const DebatePageContent = () => {
  const { debate, supportMap } = useDebateContextNonNull();

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
    <div>
      <PageHeader
        title="Debates"
        breadcrumb={`${debate.creator.username}'s Debate`}
      />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="text-left scroll-m-20 text-4xl font-bold text-balance">
          {debate.topic.title}
        </h1>
        <Separator />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-stretch gap-4">
          {supportMap ? (
            <SupportOverview chartData={supportMap} />
          ) : (
            <LoadingScreen />
          )}
          <InfoTabs />
        </div>
        <StancesCard />
      </div>
    </div>
  );
};

export default DebatePageContent;
