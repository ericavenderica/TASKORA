import { useState, useEffect, useContext } from "react";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { AuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5005/api";

function Tasks() {
  const { token, isAuthenticated } = useContext(AuthContext);
  const { filter } = useParams(); // pending / completed
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, taskId: null });
  const [priorityFilter, setPriorityFilter] = useState('all');

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
  }, [isAuthenticated, token]);

  const filteredTasks = tasks.filter((t) => {
    //filter by status (route param)
    const statusMatch = filter 
      ? (filter === "completed" ? t.completed : !t.completed)
      : true;
    
    //filter by priority
    const priorityMatch = priorityFilter === 'all' 
      ? true 
      : t.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  const handleAddOrUpdate = async (taskData) => {
    try {
      if (editTask) {
        //update existing task
        const res = await axios.put(`${API_URL}/tasks/${editTask._id}`, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editTask._id ? res.data : t))
        );
        setEditTask(null);
      } else {
        //create new task
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
      
      //setting tasks
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updatedTask : t))
      );

      await axios.put(`${API_URL}/tasks/${id}`, {
        completed: updatedTask.completed,
      });
    } catch (err) {
      console.error("Error updating task:", err);
      //revert if error
      const task = tasks.find((t) => t._id === id);
       setTasks((prev) =>
        prev.map((t) => (t._id === id ? task : t))
      );
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

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  let pageIcon = "📋"; // Default All Tasks
  if (filter === "pending") pageIcon = "⏳";
  else if (filter === "completed") pageIcon = "✅";

  return (
    <div className="page-container">
      {/* Page Header with Title and Add Button */}
      <div className="page-header">
        <div className="page-title">
          <div className="title-icon">{pageIcon}</div>
          <div>
            <h1>{filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks` : "All Tasks"}</h1>
            <p>{filteredTasks.length} task(s) found</p>
          </div>
        </div>
        <button className="add-task-btn" onClick={() => setModalOpen(true)}>
          + Add New Task
        </button>
      </div>

      <div className="task-section full-height">
        {/* Task Section Header with "Tasks" and Priority Filters */}
        <div className="task-section-header">
          <div className="task-section-title">
            <h2>Tasks</h2>
          </div>
          <div className="task-filters">
            <button 
              className={`filter-btn ${priorityFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${priorityFilter === 'high' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('high')}
            >
              High
            </button>
            <button 
              className={`filter-btn ${priorityFilter === 'medium' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('medium')}
            >
              Medium
            </button>
            <button 
              className={`filter-btn ${priorityFilter === 'low' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('low')}
            >
              Low
            </button>
          </div>
        </div>

        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="no-tasks">
              <p>No tasks found.</p>
            </div>
          )}
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
    </div>
  );
}

export default Tasks;
