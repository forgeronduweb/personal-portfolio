import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { ROLES, ROLE_DASHBOARDS } from '../utils/roleConfig';
import { 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Fonction pour obtenir le badge de rôle avec les bonnes couleurs
const getRoleBadge = (role) => {
  const roleConfig = ROLE_DASHBOARDS[role];
  if (!roleConfig) return null;

  // Mapping des couleurs pour les badges
  const colorClasses = {
    '#3b82f6': 'bg-blue-100 text-blue-800',
    '#10b981': 'bg-green-100 text-green-800', 
    '#8b5cf6': 'bg-purple-100 text-purple-800',
    '#f59e0b': 'bg-amber-100 text-amber-800',
    '#059669': 'bg-emerald-100 text-emerald-800',
    '#dc2626': 'bg-red-100 text-red-800',
    '#7c3aed': 'bg-violet-100 text-violet-800'
  };

  const colorClass = colorClasses[roleConfig.color] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      <span className="mr-1">{roleConfig.icon}</span>
      {roleConfig.name.replace('Dashboard ', '')}
    </span>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError('Erreurs lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const token = localStorage.getItem('adminToken');
      // Ici vous pouvez ajouter un endpoint pour mettre à jour l'utilisateur
      // await axios.put(`http://localhost:5000/api/admin/users/${updatedUser._id}`, updatedUser, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Mise à jour locale pour l'exemple
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const togglePremiumStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      // Ici vous pouvez ajouter un endpoint pour basculer le statut premium
      // await axios.patch(`http://localhost:5000/api/admin/users/${userId}/premium`, {
      //   isPremium: !currentStatus
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Mise à jour locale pour l'exemple
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isPremium: !currentStatus } : user
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut premium');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-gray-600">Gérez les comptes utilisateurs de votre application</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        {getRoleBadge(user.role)}
                        {user.isPremium && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePremiumStatus(user._id, user.isPremium)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                        user.isPremium
                          ? 'text-red-700 bg-red-100 hover:bg-red-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {user.isPremium ? (
                        <>
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Retirer Premium
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Rendre Premium
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal d'édition */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// Composant modal pour l'édition
const EditUserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Modifier l'utilisateur</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={ROLES.DEVELOPER_FULLSTACK}>Développeur</option>
                <option value={ROLES.DESIGNER_UX}>Designer</option>
                <option value={ROLES.COMMERCIAL}>Commercial</option>
                <option value={ROLES.MARKETING}>Marketing</option>
                <option value={ROLES.ADMIN}>Administrateur</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Utilisateur Premium</span>
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Users;
