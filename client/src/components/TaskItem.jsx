function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`}>
      <div className="task-left">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task._id)}
        />
        <div className="task-content">
          <h4 className="task-title">{task.title}</h4>
          {task.description && <p className="task-description">{task.description}</p>}
        </div>
      </div>
      
      <div className="task-right">
        <span className={`task-priority ${task.priority}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        
        {task.dueDate && (
          <span className="task-date">
            📅 {formatDate(task.dueDate)}
          </span>
        )}
        
        <div className="task-actions">
          <button className="task-action-btn edit" onClick={() => onEdit(task)}>✏️</button>
          <button className="task-action-btn delete" onClick={() => onDelete(task._id)}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
