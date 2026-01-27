import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TaskProvider } from "./contexts/TaskContext";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
