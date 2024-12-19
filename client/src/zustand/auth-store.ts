import { create } from "zustand";
import { LogInResponse } from "@/types/api";

type UserDto = {
  id?: number;
  username?: string;
  nickname?: string;
}

type AuthStore = {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    nickname: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;

  login: (response: LogInResponse) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthStore["user"]) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  initialize: () => {
    if(typeof window === "undefined") return;
    
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");
  
    if (accessToken && refreshToken && user) {
      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
        user: JSON.parse(user as string) || null,
      });
    } else {
      console.log("no token");
    }
  },

  login: async (response: LogInResponse) => {
    const accessToken = response.tokens.accessToken;
    const refreshTokenToken = response.tokens.refreshToken;
    const user = response.user;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshTokenToken);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      accessToken: accessToken,
      refreshToken: refreshTokenToken,
      isAuthenticated: true,
      user: user,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => set({ user }),

  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
}));
