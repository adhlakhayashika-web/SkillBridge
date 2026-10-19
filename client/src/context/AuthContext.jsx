import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("skillbridge_token");
    if (!token) { setLoading(false); return; }
    api("/auth/me").then((data) => setUser(data.user)).catch(() => {
      localStorage.removeItem("skillbridge_token");
    }).finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("skillbridge_token", data.token);
    setUser(data.user);
  }
  async function register(name, email, password) {
    const data = await api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    localStorage.setItem("skillbridge_token", data.token);
    setUser(data.user);
  }
  function logout() {
    localStorage.removeItem("skillbridge_token");
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
