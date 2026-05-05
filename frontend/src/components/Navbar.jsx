import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Team Task Manager
            </Link>
            <Link to="/" className={linkClass('/')}>Dashboard</Link>
            <Link to="/projects" className={linkClass('/projects')}>Projects</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={linkClass('/admin')}>Admin Panel</Link>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              user?.role === 'admin'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {user?.role === 'admin' ? 'Admin' : 'Member'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
