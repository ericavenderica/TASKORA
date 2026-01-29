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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h4 className="task-title" style={{ margin: 0 }}>{task.title}</h4>
            <div className="task-categories" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(task.categories || []).map(cat => (
                <span key={cat} className="category-tag" style={{
                  backgroundColor: 
                    cat === 'Work Projects' ? '#5C5C99' :
                    cat === 'Personal Projects' ? '#00cc00' :
                    cat === 'Urgent Projects' ? '#ff4444' :
                    cat === 'Project Ideas' ? '#ff00ff' : '#5C5C99',
                  color: 'white',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
          {task.description && <p className="task-description" style={{ margin: 0 }}>{task.description}</p>}
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
          <button className="task-action-btn edit" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(task);
          }}>✏️</button>
          <button className="task-action-btn delete" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(task._id);
          }}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
