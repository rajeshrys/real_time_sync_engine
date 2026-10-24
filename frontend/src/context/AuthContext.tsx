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
} from "../api/authApi";

import type {
  LoginRequest,
  RegisterRequest,
  User
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
      const token = localStorage.getItem("accessToken");

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
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await loginApi(data);

    const token =
      response.accessToken ??
      response.token;

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
    await stopPresence();

    localStorage.removeItem("accessToken");
    setUser(null);
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