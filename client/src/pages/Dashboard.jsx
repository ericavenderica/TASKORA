import { useState, useEffect, useContext } from "react";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5005/api";

function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, taskId: null });

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [isAuthenticated]);

  const handleAddOrUpdate = async (taskData) => {
    try {
      if (editTask) {
        const res = await axios.put(`${API_URL}/tasks/${editTask._id}`, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editTask._id ? res.data : t))
        );
        setEditTask(null);
      } else {
        const res = await axios.post(`${API_URL}/tasks`, taskData);
        setTasks((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const task = tasks.find((t) => t._id === id);
      const updatedTask = { ...task, completed: !task.completed };
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updatedTask : t))
      );
      await axios.put(`${API_URL}/tasks/${id}`, {
        completed: updatedTask.completed,
      });
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, taskId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.taskId) return;
    try {
      await axios.delete(`${API_URL}/tasks/${confirmModal.taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== confirmModal.taskId));
      setConfirmModal({ isOpen: false, taskId: null });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div className="page-title">
            <div className="title-icon">📊</div>
            <div>
              <h1>Task Overview</h1>
              <p>Manage your tasks efficiently</p>
            </div>
          </div>
        </div>
        <button className="add-task-btn" onClick={() => setModalOpen(true)}>
          + Add New Task
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total">📄</div>
          <div className="stat-info">
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon low">🟢</div>
          <div className="stat-info">
            <h3>{lowPriority}</h3>
            <p>Low Priority</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon medium">🟡</div>
          <div className="stat-info">
            <h3>{mediumPriority}</h3>
            <p>Medium Priority</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon high">🔴</div>
          <div className="stat-info">
            <h3>{highPriority}</h3>
            <p>High Priority</p>
          </div>
        </div>
      </div>

      <div className="task-section">
        <div className="task-section-header">
          <div className="task-section-title">
             <h2>Recent Activity</h2>
          </div>
          <Link to="/tasks" style={{color: '#5C5C99', fontWeight: 'bold'}}>View All</Link>
        </div>

        <div className="task-list">
          {tasks.slice(0, 3).map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
          {tasks.length === 0 && <p className="no-tasks">No recent activity.</p>}
        </div>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTask(null);
        }}
        onSubmit={handleAddOrUpdate}
        task={editTask}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, taskId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}

export default Dashboard;
