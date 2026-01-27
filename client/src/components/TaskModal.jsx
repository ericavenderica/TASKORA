import { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';

function TaskModal({ isOpen, onClose, onSubmit, task = null, defaultCategory = '' }) {
  const { tasks } = useContext(TaskContext);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    dueDate: '',
    categories: []
  });
  const [error, setError] = useState('');

  const categoryOptions = [
    { value: "Work", label: "Work (💼)" },
    { value: "Personal", label: "Personal (🏠)" },
    { value: "Urgent", label: "Urgent (🚨)" },
    { value: "Ideas", label: "Ideas (💡)" }
  ];

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          categories: task.categories || []
        });
      } else {
        setFormData({ 
          title: '', 
          description: '', 
          priority: 'medium', 
          dueDate: '',
          categories: defaultCategory ? [defaultCategory] : []
        });
      }
      setError('');
    }
  }, [task, isOpen, defaultCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleCategoryToggle = (categoryValue) => {
    setFormData(prev => {
      const currentCategories = prev.categories || [];
      const newCategories = currentCategories.includes(categoryValue)
        ? currentCategories.filter(c => c !== categoryValue)
        : [...currentCategories, categoryValue];
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a task title');
      return;
    }

    //to prevent duplicating tasks in the same set of categories
    const isDuplicate = tasks.some(t => 
      t.title.toLowerCase().trim() === formData.title.toLowerCase().trim() && 
      JSON.stringify(t.categories?.sort()) === JSON.stringify(formData.categories?.sort()) &&
      (!task || t._id !== task._id)
    );

    if (isDuplicate) {
      setError(`You already have a task named "${formData.title}" with these categories.`);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error" style={{marginBottom: '1rem'}}>{error}</div>}
          <div className="form-group">
            <label>Task Title *</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Enter task title" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Enter task description (optional)" 
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Categories</label>
            <div className="category-selection-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'var(--input-bg)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              {categoryOptions.map(cat => (
                <label key={cat.value} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}>
                  <input 
                    type="checkbox"
                    checked={formData.categories?.includes(cat.value)}
                    onChange={() => handleCategoryToggle(cat.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input 
              type="date" 
              name="dueDate" 
              value={formData.dueDate} 
              onChange={handleChange} 
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn primary">{task ? 'Update Task' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
