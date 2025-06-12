// authContext.ts
import { createContext, useContext } from "react";

type AuthContextType = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  username: string;
  setUsername: (value: string) => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
