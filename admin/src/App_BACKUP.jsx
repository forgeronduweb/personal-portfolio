import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Projects from './components/Projects'
import Newsletter from './components/Newsletter'
import MarketingHub from './components/MarketingHub'
import RoleBasedDashboard from './components/RoleBasedDashboard'
import AdminSetup from './components/AdminSetup'
import { getDashboardConfig, getRoleNavigation, ROLES, ROLE_DASHBOARDS } from './utils/roleConfig'

// Configuration API - utilise localhost en développement, production en ligne
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'https://personal-portfolio-back.onrender.com';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_URL = getApiUrl();

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [siteRequests, setSiteRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [quoteForm, setQuoteForm] = useState({ amount: '', description: '', adminNotes: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showCreateCollaborator, setShowCreateCollaborator] = useState(false)
  const [collaboratorForm, setCollaboratorForm] = useState({ name: '', email: '', password: '', role: 'admin' })
  const [currentUser, setCurrentUser] = useState(null)
  const [needsAdminSetup, setNeedsAdminSetup] = useState(false)

  async function login(e) {
    e?.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 404) {
          setNeedsAdminSetup(true)
          return
        }
        if (data.message?.includes('Aucun utilisateur') || data.message?.includes('Utilisateur non trouvé')) {
          setNeedsAdminSetup(true)
          return
        }
        throw new Error(data.message || 'Erreur de connexion')
      }
      if (!['admin', 'moderator', 'developer_frontend', 'developer_backend', 'developer_fullstack', 'designer_ux', 'designer_ui', 'graphiste', 'commercial', 'chef_projet', 'community_manager', 'marketing', 'support', 'finance'].includes(data.user?.role)) {
        throw new Error("Ce compte n'a pas accès à l'interface admin")
      }
      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
      setCurrentUser(data.user)
    } catch (err) {
      if (err.message.includes('Unexpected token') || err.message.includes('not valid JSON')) {
        setNeedsAdminSetup(true)
        return
      }
      if (err.message.includes('Une erreur est survenue sur le serveur') || 
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('fetch')) {
        setNeedsAdminSetup(true)
        return
      }
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('admin_token')
    setToken('')
    setCurrentUser(null)
    setActiveSection('dashboard')
  }

  // Si pas de token, afficher le formulaire de connexion
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={login} className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        currentUser={currentUser}
        logout={logout}
      />
      <main className="flex-1 overflow-y-auto">
        {activeSection === 'dashboard' && <RoleBasedDashboard />}
        {activeSection === 'projects' && <Projects />}
        {activeSection === 'newsletter' && <Newsletter />}
        {activeSection === 'marketing' && <MarketingHub />}
      </main>
    </div>
  )
}
