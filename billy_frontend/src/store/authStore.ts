"use client";
import { TUserDataOnAuth } from "@/services/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TAuthState = {
  isLoggedIn: boolean;
  accessToken?: string;
  userDataOnAuth?: TUserDataOnAuth;
  // Actions
  setIsLoggedIn: (value: boolean) => void;
  setAccessToken: (token: string) => void;
  setUserDataOnAuth: (payload: TUserDataOnAuth) => void;
  logoutAndClearAuthData: () => void;
};

export const useAuthStore = create<TAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: undefined,
      userDataOnAuth: undefined,

      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      setAccessToken: (token) => set({ accessToken: token }),
      setUserDataOnAuth: (payload) => set({ userDataOnAuth: payload }),
      logoutAndClearAuthData: () =>
        set({
          isLoggedIn: false,
          accessToken: undefined,
          userDataOnAuth: undefined,
        }),
    }),
    {
      name: "auth-billy-storage",
    }
  )
);
