import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";

const UnifiedAuthContext = createContext(null);

// Single auth provider that handles all user types
export function UnifiedAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const hasChecked = useRef(false);

  // Verify session only once on mount
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if we have a token in localStorage
    const adminToken = localStorage.getItem("adminToken");
    const customerToken = localStorage.getItem("customerToken");
    
    // Only make API call if there's a token
    if (!adminToken && !customerToken && !document.cookie.includes("token")) {
      setChecking(false);
      return;
    }

    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
        // Clear stale token
        localStorage.removeItem("adminToken");
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  const login = useCallback(async (email, password, expectedRole = null) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const userObj = data.user || data;
      const userRole = userObj.role || data.role;

      // Validate role if expected role is provided
      if (expectedRole && expectedRole !== userRole && !(expectedRole === "seo" && userRole === "admin")) {
        await api.post("/auth/logout").catch(() => {});
        throw new Error(`Access denied: Not a ${expectedRole} account`);
      }

      // Store token based on role
      if (data.token && userRole === "admin") {
        localStorage.setItem("adminToken", data.token);
      } else if (data.token && userRole === "customer") {
        localStorage.setItem("customerToken", data.token);
      }

      setUser(userObj);
      return userObj;
    } catch (error) {
      // Better error handling
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      console.error("Login error:", errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const register = useCallback(async ({ name, email, phone, password }) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, phone, password });
      const userObj = data.user || data;
      
      // Store customer token in localStorage for cross-domain auth
      if (data.token) {
        localStorage.setItem("customerToken", data.token);
      }
      
      setUser(userObj);
      return userObj;
    } catch (error) {
      // Better error handling
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      console.error("Register error:", errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("adminToken");
    localStorage.removeItem("customerToken");
    setUser(null);
  }, []);

  // Role-specific getters
  const admin = user?.role === "admin" ? user : null;
  const seoUser = (user?.role === "seo" || user?.role === "admin") ? user : null;
  const customer = user?.role === "customer" ? user : null;

  return (
    <UnifiedAuthContext.Provider value={{ 
      user,
      admin,
      seoUser, 
      customer,
      checking, 
      login, 
      register,
      logout 
    }}>
      {children}
    </UnifiedAuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(UnifiedAuthContext);
}

// Convenience hooks for backward compatibility
export function useAdminAuth() {
  const { admin, checking, login, logout } = useAuth();
  return { 
    admin, 
    checking, 
    login: (email, password) => login(email, password, "admin"),
    logout 
  };
}

export function useSeoAuth() {
  const { seoUser, checking, login, logout } = useAuth();
  return { 
    seoUser, 
    checking, 
    login: (email, password) => login(email, password, "seo"),
    logout 
  };
}

export function useCustomerAuth() {
  const { customer, checking, login, register, logout } = useAuth();
  return { 
    customer, 
    checking, 
    login: (email, password) => login(email, password),
    register,
    logout 
  };
}
