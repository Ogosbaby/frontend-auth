import { create } from "zustand";
import apiClient from "../api/apiClient";

type User = {
  username: string;
  email: string;
  createdAt?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: !!localStorage.getItem("authToken"),
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/users?email=${email}`);
      const foundUser = res.data.find((u: any) => u.password === password);

      if (foundUser) {
        const mockToken = "mock-token"; // Replace with real token from backend if available
        localStorage.setItem("authToken", mockToken);

        set({
          user: foundUser,
          token: mockToken,
          isAuthenticated: true,
        });
      } else {
        set({ error: "Invalid email or password" });
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      set({ error: err?.message || "Something went wrong, please try again" });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post("/auth/register", { username, email, password });
      // Optionally auto-login or redirect after signup
    } catch (err: any) {
      console.error("Sign up error:", err);
      set({ error: err?.message || "Sign up failed" });
    } finally {
      set({ loading: false });
    }
  },

  signOut: () => {
    localStorage.removeItem("authToken");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.get("/auth/me");
      set({ user: res.data, isAuthenticated: true });
    } catch (err) {
      console.error("Fetch user error:", err);
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
