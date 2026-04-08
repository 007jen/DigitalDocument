import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId") || 1; // Fallback for demo if id isn't in localstorage
  
  useEffect(() => {
    // Only fetch notifications if logged in
    if (!role) {
      navigate('/');
      return;
    }
    
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/documents/notifications/${userId}`);
        setNotifications(res.data);
      } catch (e) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
    
    // Poll every 10 seconds for demo purposes
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [role, navigate, userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin';
    if (role === 'manager') return '/manager';
    return '/employee';
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar d-flex flex-column py-4" style={{ width: '260px' }}>
        <h4 className="px-4 mb-4 fw-bold" style={{ color: 'var(--primary)' }}>
          <i className="bi bi-layers me-2"></i>DocFlow
        </h4>
        
        <div className="nav flex-column mb-auto mt-2">
          <Link to={getDashboardLink()} className={`nav-link ${location.pathname === getDashboardLink() ? 'active' : ''}`}>
            Dashboard
          </Link>
          {role === 'employee' && (
            <Link to="/employee" className={`nav-link ${location.pathname === '/employee' ? 'active' : ''}`}>
              My Documents
            </Link>
          )}
        </div>
        
        <div className="px-4 mt-auto">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Navbar */}
        <nav className="navbar navbar-light bg-transparent px-4 py-3 d-flex justify-content-end align-items-center">
          <div className="position-relative me-4">
            <button 
              className="btn btn-light rounded-circle shadow-sm position-relative shadow-none border-0"
              style={{ width: '45px', height: '45px', background: 'var(--glass-bg)' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              🔔
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ transform: 'translate(-30%, 30%)' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showDropdown && (
              <div className="glass-panel position-absolute end-0 mt-2 p-0 shadow-lg" style={{ width: '300px', zIndex: 1000, overflow: 'hidden' }}>
                <div className="bg-light p-3 border-bottom">
                  <h6 className="mb-0 fw-bold">Notifications</h6>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted small">No new notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-3 border-bottom small hover-bg-light">
                        <div className={notif.is_read ? 'text-muted' : 'fw-bold'}>{notif.message}</div>
                        <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
              {role ? role.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ms-3 lh-sm d-none d-md-block">
              <div className="fw-bold">{role ? role.toUpperCase() : 'User'}</div>
              <div className="text-muted small">Logged in</div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
