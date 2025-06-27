// context/debateContext.tsx
import { createContext, useContext } from "react";
import type { DebateDataFull, Participant, SupportDetails } from "../types";

interface DebateContextType {
  debate: DebateDataFull | null;
  userDetails: Participant | null;
  inviteToken?: string | null;
  supportMap?: SupportDetails[] | null;
  refreshDebate: () => Promise<void>;
}

export const DebateContext = createContext<DebateContextType | undefined>(
  undefined
);

export const useDebateContext = () => {
  const context = useContext(DebateContext);
  if (!context)
    throw new Error("useDebateContext must be used within a DebateProvider");
  return context;
};
export function useDebateContextNonNull() {
  const context = useDebateContext();
  if (!context.debate) {
    throw new Error("Debate data is not loaded.");
  }
  return {
    ...context,
    debate: context.debate,
  };
}
