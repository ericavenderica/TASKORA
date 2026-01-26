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
          <span>📋</span> All Tasks
        </Link>
        <Link to="/tasks/pending" className={`sidebar-nav-item ${isActive('/tasks/pending')}`}>
          <span>⏳</span> Pending Tasks
        </Link>
        <Link to="/tasks/completed" className={`sidebar-nav-item ${isActive('/tasks/completed')}`}>
          <span>✅</span> Completed Tasks
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
