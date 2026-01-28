import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-greeting">Hey, {user?.name || 'User'}!</p>
        <p className="sidebar-subtitle">Let's crush some tasks!</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-nav-item ${isActive('/dashboard')}`}>
          <span>📊</span> Dashboard
        </Link>
        <Link to="/tasks" className={`sidebar-nav-item ${isActive('/tasks')}`}>
          <span>📋</span> All Projects
        </Link>
        <Link to="/tasks/pending" className={`sidebar-nav-item ${isActive('/tasks/pending')}`}>
          <span>⏳</span> Pending Projects
        </Link>
        <Link to="/tasks/completed" className={`sidebar-nav-item ${isActive('/tasks/completed')}`}>
          <span>✅</span> Completed Projects
        </Link>
        
        <div className="sidebar-divider"></div>
        <p className="sidebar-section-title">Categories</p>
        
        <Link to="/tasks/category/Work Projects" className={`sidebar-nav-item ${isActive('/tasks/category/Work Projects')}`}>
          <span>💼</span> Work Projects
        </Link>
        <Link to="/tasks/category/Personal Projects" className={`sidebar-nav-item ${isActive('/tasks/category/Personal Projects')}`}>
          <span>🏠</span> Personal Projects
        </Link>
        <Link to="/tasks/category/Urgent Projects" className={`sidebar-nav-item ${isActive('/tasks/category/Urgent Projects')}`}>
          <span>🚨</span> Urgent Projects
        </Link>
        <Link to="/tasks/category/Project Ideas" className={`sidebar-nav-item ${isActive('/tasks/category/Project Ideas')}`}>
          <span>💡</span> Project Ideas
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
