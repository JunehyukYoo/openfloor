// AuthContext.tsx
// Custom React context for authentication state management
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../../api/axios";

type AuthContextType = {
  loggedIn: boolean;
  username: string;
  setLoggedIn: (val: boolean) => void;
  setUsername: (val: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Initial login check on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await api.get("/me");
        if (res.status === 200) {
          setLoggedIn(true);
          setUsername(res.data.user.username);
        }
      } catch {
        setLoggedIn(false);
        setUsername("");
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, username, setLoggedIn, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
