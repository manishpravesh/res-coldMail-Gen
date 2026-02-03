import { create } from "zustand";
import { authAPI } from "../api/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // Get user info
      const userResponse = await authAPI.getCurrentUser();
      set({
        token,
        user: userResponse.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Login failed";
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.register(userData);
      // Auto login after registration
      const loginResult = await useAuthStore.getState().login({
        email: userData.email,
        password: userData.password,
      });
      return loginResult;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Registration failed";
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch (error) {
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));
