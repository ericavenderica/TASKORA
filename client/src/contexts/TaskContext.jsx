import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005/api";

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch projects from API
  const fetchTasks = useCallback(async (force = false) => {
    if (!isAuthenticated) return;
    
    if (tasks.length > 0 && !force) {
       return; 
    }

    try {
      setLoading(tasks.length === 0); 
      const res = await axios.get(`${API_URL}/projects`);
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, tasks.length]);

  //fetch categories from API
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, [isAuthenticated]);

  //load initial application data
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchCategories();
    } else {
      setTasks([]);
      setCategories([]);
    }
  }, [isAuthenticated, fetchTasks, fetchCategories]);

  const addTask = async (taskData) => {
    try {
      const res = await axios.post(`${API_URL}/projects`, taskData);
      setTasks((prev) => [res.data, ...prev]);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error adding project:", err);
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      //refresh local state first for better UX
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...updatedData } : t))
      );

      const res = await axios.put(`${API_URL}/projects/${id}`, updatedData);
      
      //update with confirmed data from the server
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating project:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      //remove from state immediately
      setTasks((prev) => prev.filter((t) => t._id !== id));
      await axios.delete(`${API_URL}/projects/${id}`);
      return { success: true };
    } catch (err) {
      console.error("Error deleting project:", err);
      fetchTasks(true);
      return { success: false, error: err.message };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        loading,
        error,
        fetchTasks,
        fetchCategories,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
