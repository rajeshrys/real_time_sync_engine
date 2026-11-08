import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
  logoutApi,
  refreshTokenApi,
} from "../api/authApi";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../api/authApi";
import { stopPresence } from "../services/presenceWebsocket";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      let token = localStorage.getItem("accessToken");

      if (!token) {
        try {
          const refreshRes = await refreshTokenApi();
          token = refreshRes.accessToken || refreshRes.token || null;
          if (token) {
            localStorage.setItem("accessToken", token);
          }
        } catch {
          // No active session cookie
          setLoading(false);
          return;
        }
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to restore authentication:", error);
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const handleAuthLogout = () => {
      setUser(null);
      stopPresence();
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await loginApi(data);

    const token = response.accessToken ?? response.token;

    if (!token) {
      throw new Error("No JWT token received from server.");
    }

    localStorage.setItem("accessToken", token);

    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const register = async (data: RegisterRequest) => {
    await registerApi(data);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Failed to logout on server:", error);
    } finally {
      await stopPresence();
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
