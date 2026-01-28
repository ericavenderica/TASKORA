import { useState, useContext } from "react";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { AuthContext } from "../contexts/AuthContext";
import { TaskContext } from "../contexts/TaskContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const { tasks, loading, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, taskId: null });

  const handleAddOrUpdate = async (taskData) => {
    if (editTask) {
      await updateTask(editTask._id, taskData);
      setEditTask(null);
    } else {
      await addTask(taskData);
    }
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, taskId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.taskId) return;
    await deleteTask(confirmModal.taskId);
    setConfirmModal({ isOpen: false, taskId: null });
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  //stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div className="page-title">
            <div className="title-icon">📊</div>
            <div>
              <h1>Project Overview</h1>
            <p>Manage your projects efficiently</p>
            </div>
          </div>
        </div>
        <button className="add-task-btn" onClick={() => setModalOpen(true)}>
          + Add New Project
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total">📄</div>
          <div className="stat-info">
            <h3>{totalTasks}</h3>
            <p>Total Projects</p>
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
