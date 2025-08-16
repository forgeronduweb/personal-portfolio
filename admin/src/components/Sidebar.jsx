import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('adminUser'));

  useEffect(() => {
    // Vérification du token au chargement
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
    { name: 'Paramètres', href: '/admin/settings', icon: CogIcon },
    { name: 'Logs', href: '/admin/logs', icon: ClipboardDocumentListIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col text-gray-400">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-mono text-white">Administration</h2>
        <p className="text-xs mt-2 text-gray-500">Panneau de contrôle</p>
        {currentUser && (
          <div className="mt-4 px-2 py-1 bg-gray-800 rounded text-xs">
            {currentUser.email}
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2 font-mono text-sm">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center p-2 rounded transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Déconnexion
        </button>
        <p className="text-xs text-gray-600 mt-4">© 2025 Admin System</p>
      </div>
    </div>
  );
};

export default Sidebar;
