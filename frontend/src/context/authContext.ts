// context/authContext.ts
import type { User } from "../types.ts";
import { createContext, useContext } from "react";

type AuthContextType = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
