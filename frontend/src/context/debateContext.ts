// context/debateContext.tsx
import { createContext, useContext } from "react";
import type { DebateDataFull, Participant } from "../types";

interface DebateContextType {
  debate: DebateDataFull | null;
  userDetails: Participant | null;
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
