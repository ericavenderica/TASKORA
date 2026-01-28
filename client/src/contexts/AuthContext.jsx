import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:5005/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //set auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      } else {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/me`);
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth Error:", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []); 

  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData, config);
      
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      
      //load user after registration
      const userRes = await axios.get(`${API_URL}/auth/me`);
      setUser(userRes.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error("Register Error:", err.response?.data);
      localStorage.removeItem("token");
      setToken(null);
      setIsAuthenticated(false);
      return { success: false, error: err.response?.data?.msg || "Registration failed" };
    }
  };

  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData, config);
      
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);

      //fetch user data
      const userRes = await axios.get(`${API_URL}/auth/me`);
      setUser(userRes.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      localStorage.removeItem("token");
      setToken(null);
      setIsAuthenticated(false);
      return { success: false, error: err.response?.data?.msg || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
