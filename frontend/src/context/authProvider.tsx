// context/authProvider.tsx
// Custom React component using React context for authentication state management
import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import type { User } from "../types.ts";
import api from "../../api/axios";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get("/me");
        if (res.status === 200) {
          setLoggedIn(true);
          setUser(res.data.user);
        } else {
          setLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setLoggedIn(false);
        setUser(null);
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, user, setUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
