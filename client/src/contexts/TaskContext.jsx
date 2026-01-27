import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

const API_URL = "http://localhost:5005/api";

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch tasks function
  const fetchTasks = useCallback(async (force = false) => {
    if (!isAuthenticated) return;
    
    if (tasks.length > 0 && !force) {
       return; 
    }

    try {
      setLoading(tasks.length === 0); 
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, tasks.length]);

  //the initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated]); 

  const addTask = async (taskData) => {
    try {
      const res = await axios.post(`${API_URL}/tasks`, taskData);
      setTasks((prev) => [res.data, ...prev]);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error adding task:", err);
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      //confident update
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...updatedData } : t))
      );

      const res = await axios.put(`${API_URL}/tasks/${id}`, updatedData);
      
      //update with server response to ensure sync
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating task:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      //confident update
      setTasks((prev) => prev.filter((t) => t._id !== id));
      await axios.delete(`${API_URL}/tasks/${id}`);
      return { success: true };
    } catch (err) {
      console.error("Error deleting task:", err);
      fetchTasks(true);
      return { success: false, error: err.message };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
