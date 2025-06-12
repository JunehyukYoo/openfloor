// AuthContext.tsx
// Custom React context for authentication state management
import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/axios";

type AuthContextType = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  username: string;
  setUsername: (value: string) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get("/me");
        if (res.status === 200) {
          setLoggedIn(true);
          setUsername(res.data.user.username);
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        setLoggedIn(false);
        setUsername("");
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, username, setUsername, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
