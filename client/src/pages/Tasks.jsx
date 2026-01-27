import { useState, useContext } from "react";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { AuthContext } from "../contexts/AuthContext";
import { TaskContext } from "../contexts/TaskContext";
import { useParams } from "react-router-dom";

function Tasks() {
  const { isAuthenticated } = useContext(AuthContext);
  const { tasks, loading, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const { filter } = useParams(); // pending or completed
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, taskId: null });
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = tasks.filter((t) => {
    //filter by status
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

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  let pageIcon = "📋"; 
  if (filter === "pending") pageIcon = "⏳";
  else if (filter === "completed") pageIcon = "✅";

  return (
    <div className="page-container">
      {/*page header with title and add button */}
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
        {/*task section header with "tasks" and triority filters */}
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
