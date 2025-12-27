import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">HomeMind</Link>
      </div>
      <div className="navbar-links">
        <Link
          to="/"
          className={location.pathname === '/' ? 'active' : ''}
        >
          Dashboard
        </Link>
        <Link
          to="/devices"
          className={location.pathname === '/devices' ? 'active' : ''}
        >
          Devices
        </Link>
        <Link
          to="/automations"
          className={location.pathname === '/automations' ? 'active' : ''}
        >
          Automations
        </Link>
      </div>
      <div className="navbar-user">
        <span>{user?.name || user?.email}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;

