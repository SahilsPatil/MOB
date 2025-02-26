import { create } from "zustand";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

type UserRole = "admin" | "police";

interface User {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (username, password, role) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: username,
        password: password,
        role: role,
      });

      const { token, role: userRole, username: storedUsername } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("username", storedUsername);

      set({
        user: { id: "1", username: storedUsername, role: userRole },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    set({ user: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role") as UserRole | null;

    if (token && role) {
      try {
        const decodedToken: any = jwtDecode(token); // ✅ Correct usage

        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log("Token expired, logging out...");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          set({ user: null, isAuthenticated: false });
          return;
        }

        set({
          user: { id: "1", username, role },
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        set({ user: null, isAuthenticated: false });
      }
    }
  },
}));
