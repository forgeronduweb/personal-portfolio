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
  // Ajouter le style CSS pour masquer la scrollbar
  const style = document.createElement('style');
  style.textContent = `
    .admin-main::-webkit-scrollbar {
      display: none;
    }
  `;
  if (!document.head.querySelector('style[data-admin-scrollbar]')) {
    style.setAttribute('data-admin-scrollbar', 'true');
    document.head.appendChild(style);
  }
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
  const [lastActivity, setLastActivity] = useState(Date.now())

  async function login(e) {
    e?.preventDefault()
    setError('')
    setIsLoading(true)
    
    console.log('🔐 Tentative de connexion...')
    console.log('API URL:', API_URL)
    console.log('Email:', email)
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)
      console.log('Response headers:', res.headers.get('content-type'))
      
      // Vérifier si la réponse est du JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text()
        console.log('Response is not JSON:', textResponse.substring(0, 200))
        throw new Error('Le serveur backend ne répond pas correctement. Vérifiez que l\'URL est correcte.')
      }
      
      const data = await res.json()
      console.log('Response data:', data)
      
      if (!res.ok) {
        // Si erreur 404, le backend n'est pas accessible ou la route n'existe pas
        if (res.status === 404) {
          console.log('🔧 Backend non accessible ou route inexistante, affichage du setup')
          setNeedsAdminSetup(true)
          return
        }
        // Si erreur d'authentification, proposer la création
        if (data.message?.includes('Aucun utilisateur') || data.message?.includes('Utilisateur non trouvé')) {
          console.log('🔧 Aucun admin trouvé, affichage du setup')
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
      console.log('✅ Connexion réussie')
    } catch (err) {
      console.error('❌ Erreur de connexion:', err)
      // Si c'est une erreur de parsing JSON (backend non accessible), afficher le setup
      if (err.message.includes('Unexpected token') || err.message.includes('not valid JSON')) {
        console.log('🔧 Backend non accessible, affichage du setup')
        setNeedsAdminSetup(true)
        return
      }
      // Si erreur serveur générique ou backend non accessible, afficher le setup
      if (err.message.includes('Une erreur est survenue sur le serveur') || 
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('fetch')) {
        console.log('🔧 Backend non accessible en production, affichage du setup')
        setNeedsAdminSetup(true)
        return
      }
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function sendQuote(requestId) {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/admin/site-requests/${requestId}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(quoteForm)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur envoi devis')
      
      // Mettre à jour la liste des demandes
      setSiteRequests(prev => prev.map(req => 
        req._id === requestId ? data.data : req
      ))
      setSelectedRequest(null)
      setQuoteForm({ amount: '', description: '', adminNotes: '' })
      alert('Devis envoyé avec succès!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateUserRole(userId, newRole) {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur mise à jour rôle')
      
      // Mettre à jour la liste des utilisateurs
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ))
      alert('Rôle mis à jour avec succès!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleUserPremium(userId, isPremium) {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/admin/users/${userId}/premium`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPremium: !isPremium })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur mise à jour premium')
      
      // Mettre à jour la liste des utilisateurs
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isPremium: !isPremium } : user
      ))
      alert('Statut premium mis à jour!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteUser(userId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur suppression utilisateur')
      
      // Retirer l'utilisateur de la liste
      setUsers(prev => prev.filter(user => user._id !== userId))
      alert('Utilisateur supprimé avec succès!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function createCollaborator() {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/auth/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...collaboratorForm,
          adminKey: 'admin-setup-key-2024'
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur création collaborateur')
      
      // Ajouter le nouveau collaborateur à la liste
      setUsers(prev => [...prev, data.user])
      setCollaboratorForm({ name: '', email: '', password: '', role: 'admin' })
      setShowCreateCollaborator(false)
      alert('Collaborateur créé avec succès!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('admin_token')
    setToken('')
    setCurrentUser(null)
    setStats(null)
    setUsers([])
    setSiteRequests([])
    setSelectedRequest(null)
    setActiveSection('dashboard')
    setNeedsAdminSetup(false)
    setLastActivity(Date.now())
    setError('')
  }

  function handleAdminSetupComplete(user) {
    setCurrentUser(user)
    setNeedsAdminSetup(false)
    setActiveSection('dashboard')
  }

  // Gestion du timeout de session (30 minutes d'inactivité)
  useEffect(() => {
    if (!token) return

    const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
    
    const checkSession = () => {
      const now = Date.now()
      if (now - lastActivity > SESSION_TIMEOUT) {
        console.log('🕒 Session expirée après 30 minutes d\'inactivité')
        logout()
        setError('Session expirée. Veuillez vous reconnecter.')
      }
    }

    const updateActivity = () => {
      setLastActivity(Date.now())
    }

    // Vérifier la session toutes les minutes
    const sessionInterval = setInterval(checkSession, 60000)
    
    // Écouter l'activité utilisateur
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    // Charger les données
    ;(async () => {
      setIsLoading(true)
      try {
        const [statsRes, usersRes, requestsRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/admin/site-requests`, { headers: { Authorization: `Bearer ${token}` } })
        ])
        const statsData = await statsRes.json()
        const usersData = await usersRes.json()
        const requestsData = await requestsRes.json()
        if (!statsRes.ok) throw new Error(statsData.message || 'Erreur chargement stats')
        if (!usersRes.ok) throw new Error(usersData.message || 'Erreur chargement utilisateurs')
        if (!requestsRes.ok) throw new Error(requestsData.message || 'Erreur chargement demandes')
        setStats(statsData.data)
        setUsers(Array.isArray(usersData.data) ? usersData.data : [])
        setSiteRequests(Array.isArray(requestsData.data) ? requestsData.data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    })()

    // Cleanup
    return () => {
      clearInterval(sessionInterval)
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [token, lastActivity])

  // Afficher l'interface de setup si aucun admin n'existe
  if (needsAdminSetup) {
    return <AdminSetup onSetupComplete={handleAdminSetupComplete} />
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={login} style={{ border: '1px solid #e5e7eb', padding: 24, borderRadius: 12, width: 360 }}>
          <h1 style={{ margin: 0, marginBottom: 12 }}>Connexion Interface</h1>
          {error && <div style={{ color: '#b91c1c', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <label>Mot de passe</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                marginTop: 12, 
                padding: 10, 
                borderRadius: 8, 
                background: isLoading ? '#9ca3af' : '#0f172a', 
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 6, fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
            Première connexion ? Le système va automatiquement vous proposer de créer votre compte admin.
          </div>
          <div style={{ marginTop: 8, padding: 8, backgroundColor: '#fef3c7', borderRadius: 4, fontSize: 11, color: '#92400e', textAlign: 'center' }}>
            ⚠️ Si erreur serveur : Démarrez d'abord le backend local avec "npm run dev"
          </div>
        </form>
      </div>
    )
  }

  // Si l'utilisateur connecté n'est pas admin, utiliser le dashboard role-based avec permissions limitées
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <RoleBasedDashboard 
        user={currentUser}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={logout}
      />
    )
  }

  // Rendu du contenu selon la section active
  const renderContent = () => {
    // Vérifier les permissions pour chaque section
    const hasPermission = (section) => {
      if (!currentUser) return true; // Fallback pour l'admin principal
      
      const userRole = currentUser.role;
      
      // Seuls les admins ont accès à tout
      if (userRole === 'admin') return true;
      
      // Modérateurs ont accès limité
      if (userRole === 'moderator') {
        return ['dashboard', 'users', 'site-requests', 'projects'].includes(section);
      }
      
      // Autres rôles ont accès très limité
      return ['dashboard', 'my-projects', 'profile'].includes(section);
    };

    if (!hasPermission(activeSection)) {
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', marginBottom: 16 }}>Accès refusé</h2>
          <p style={{ color: '#64748b' }}>Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
        </div>
      );
    }

    switch(activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6', fontSize: 32, fontWeight: 700 }}>{users.length}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Utilisateurs inscrits</p>
              </div>
              <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#10b981', fontSize: 32, fontWeight: 700 }}>{users.filter(u => u.isPremium).length}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Utilisateurs premium</p>
              </div>
              <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b', fontSize: 32, fontWeight: 700 }}>{siteRequests.length}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Demandes de sites</p>
              </div>
              <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#ef4444', fontSize: 32, fontWeight: 700 }}>{siteRequests.filter(r => r.status === 'pending').length}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>En attente</p>
              </div>
            </div>

            {/* Activités récentes */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Activités récentes</h2>
                {(users.length > 3 || siteRequests.length > 3) && (
                  <button
                    onClick={() => setActiveSection('users')}
                    style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: '1px solid #3b82f6',
                      borderRadius: 6,
                      color: '#3b82f6',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 500
                    }}
                  >
                    Voir plus →
                  </button>
                )}
              </div>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  {/* Nouvelles inscriptions */}
                  {users.slice(0, 3).map(user => (
                    <div key={`user-${user._id}`} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '12px 0', 
                      borderBottom: '1px solid #f1f5f9' 
                    }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 600,
                        marginRight: 12
                      }}>
                        👤
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: '#0f172a' }}>
                          Nouvel utilisateur inscrit
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {user.email} • {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {user.isPremium && (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 10,
                          fontWeight: 500,
                          backgroundColor: '#dcfce7',
                          color: '#166534'
                        }}>
                          Premium
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Nouvelles demandes de sites */}
                  {siteRequests.slice(0, 3).map(request => (
                    <div key={`request-${request._id}`} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '12px 0', 
                      borderBottom: '1px solid #f1f5f9' 
                    }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 600,
                        marginRight: 12
                      }}>
                        📋
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: '#0f172a' }}>
                          Nouvelle demande de site
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {request.email} • {request.projectType} • {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 10,
                        fontWeight: 500,
                        backgroundColor: request.status === 'pending' ? '#fef3c7' : 
                                        request.status === 'in_progress' ? '#dbeafe' : 
                                        request.status === 'completed' ? '#dcfce7' : '#fecaca',
                        color: request.status === 'pending' ? '#92400e' : 
                               request.status === 'in_progress' ? '#1e40af' : 
                               request.status === 'completed' ? '#166534' : '#991b1b'
                      }}>
                        {request.status === 'pending' ? 'En attente' :
                         request.status === 'in_progress' ? 'En cours' :
                         request.status === 'completed' ? 'Terminé' : 'Annulé'}
                      </span>
                    </div>
                  ))}

                  {/* Activités système */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f1f5f9' 
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 12
                    }}>
                      📊
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: '#0f172a' }}>
                        Statistiques mises à jour
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {users.length} utilisateurs • {siteRequests.length} demandes • {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {(users.length === 0 && siteRequests.length === 0) && (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: 20 }}>
                      Aucune activité récente
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recent Data */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Utilisateurs récents</h3>
                  {users.length > 5 && (
                    <button
                      onClick={() => setActiveSection('users')}
                      style={{
                        padding: '4px 8px',
                        background: 'none',
                        border: '1px solid #3b82f6',
                        borderRadius: 4,
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 500
                      }}
                    >
                      Voir plus
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                  {users.slice(0, 5).map(user => (
                    <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontWeight: 500, color: '#0f172a' }}>{user.email}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: 12, 
                        fontSize: 11, 
                        fontWeight: 500,
                        backgroundColor: user.isPremium ? '#dcfce7' : '#f1f5f9',
                        color: user.isPremium ? '#166534' : '#64748b'
                      }}>
                        {user.isPremium ? 'Premium' : 'Gratuit'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Demandes récentes</h3>
                  {siteRequests.length > 5 && (
                    <button
                      onClick={() => setActiveSection('site-requests')}
                      style={{
                        padding: '4px 8px',
                        background: 'none',
                        border: '1px solid #3b82f6',
                        borderRadius: 4,
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 500
                      }}
                    >
                      Voir plus
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                  {siteRequests.slice(0, 5).map(request => (
                    <div key={request._id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 500, color: '#0f172a' }}>{request.email}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{request.projectType} • {new Date(request.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, position: 'fixed', top: 64, left: 280, right: 24, backgroundColor: '#f8fafc', paddingTop: 16, paddingBottom: 8, zIndex: 15, borderBottom: '1px solid #e5e7eb' }}>Gestion des utilisateurs</h1>
              <button
                onClick={() => setShowCreateCollaborator(true)}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  position: 'fixed',
                  top: 72,
                  right: 32,
                  zIndex: 20
                }}
              >
                ➕ Créer un collaborateur
              </button>
            </div>

            {/* Modal de création de collaborateur */}
            {showCreateCollaborator && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 24,
                  width: 400,
                  maxWidth: '90vw'
                }}>
                  <h2 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Créer un collaborateur</h2>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Nom complet</label>
                    <input
                      type="text"
                      value={collaboratorForm.name}
                      onChange={(e) => setCollaboratorForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                      placeholder="Nom du collaborateur"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Email</label>
                    <input
                      type="email"
                      value={collaboratorForm.email}
                      onChange={(e) => setCollaboratorForm(prev => ({ ...prev, email: e.target.value }))}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                      placeholder="email@exemple.com"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Mot de passe</label>
                    <input
                      type="password"
                      value={collaboratorForm.password}
                      onChange={(e) => setCollaboratorForm(prev => ({ ...prev, password: e.target.value }))}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                      placeholder="Mot de passe sécurisé"
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Rôle</label>
                    <select
                      value={collaboratorForm.role}
                      onChange={(e) => setCollaboratorForm(prev => ({ ...prev, role: e.target.value }))}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                    >
                      <option value={ROLES.DEVELOPER_FULLSTACK}>Développeur</option>
                      <option value={ROLES.DESIGNER_UX}>Designer</option>
                      <option value={ROLES.COMMERCIAL}>Commercial</option>
                      <option value={ROLES.MARKETING}>Marketing</option>
                      <option value={ROLES.ADMIN}>Administrateur</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setShowCreateCollaborator(false)
                        setCollaboratorForm({ name: '', email: '', password: '', role: 'admin' })
                      }}
                      style={{
                        padding: '8px 16px',
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={createCollaborator}
                      disabled={!collaboratorForm.name || !collaboratorForm.email || !collaboratorForm.password || isLoading}
                      style={{
                        padding: '8px 16px',
                        background: (!collaboratorForm.name || !collaboratorForm.email || !collaboratorForm.password || isLoading) ? '#d1d5db' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: (!collaboratorForm.name || !collaboratorForm.email || !collaboratorForm.password || isLoading) ? 'not-allowed' : 'pointer',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                    >
                      {isLoading ? 'Création...' : 'Créer'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px', background: '#f8fafc', padding: '10px 12px', fontWeight: 600, color: '#334155' }}>
                <div>Nom</div>
                <div>Email</div>
                <div>Rôle</div>
                <div>Premium</div>
                <div>Inscription</div>
                <div>Actions</div>
              </div>
              <div style={{ maxHeight: 420, overflow: 'auto' }}>
                {users.length === 0 ? (
                  <div style={{ padding: 12, color: '#64748b' }}>Aucun utilisateur</div>
                ) : (
                  users.map(u => (
                    <div key={u.id || u._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px', padding: '10px 12px', borderTop: '1px solid #e5e7eb', alignItems: 'center' }}>
                      <div style={{ color: '#0f172a' }}>{u.name || '-'}</div>
                      <div style={{ color: '#334155' }}>{u.email}</div>
                      <div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 500,
                          backgroundColor: u.role === 'admin' ? '#dbeafe' : u.role === 'moderator' ? '#fef3c7' : '#f1f5f9',
                          color: u.role === 'admin' ? '#1e40af' : u.role === 'moderator' ? '#92400e' : '#64748b'
                        }}>
                          {u.role}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 500,
                          backgroundColor: u.isPremium ? '#dcfce7' : '#f1f5f9',
                          color: u.isPremium ? '#166534' : '#64748b'
                        }}>
                          {u.isPremium ? 'Premium' : 'Gratuit'}
                        </span>
                      </div>
                      <div style={{ color: '#334155', fontSize: 12 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => toggleUserPremium(u._id, u.isPremium)}
                          style={{
                            padding: '4px 6px',
                            background: u.isPremium ? '#f59e0b' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 10,
                            fontWeight: 500
                          }}
                          title={u.isPremium ? 'Retirer Premium' : 'Rendre Premium'}
                        >
                          {u.isPremium ? '⭐' : '💎'}
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => updateUserRole(u._id, u.role === 'user' ? 'moderator' : 'user')}
                            style={{
                              padding: '4px 6px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 10,
                              fontWeight: 500
                            }}
                            title={u.role === 'user' ? 'Promouvoir Modérateur' : 'Rétrograder Utilisateur'}
                          >
                            {u.role === 'user' ? '⬆️' : '⬇️'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            style={{
                              padding: '4px 6px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 10,
                              fontWeight: 500
                            }}
                            title="Supprimer utilisateur"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case 'site-requests':
        if (selectedRequest) {
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: 12, fontSize: 14 }}
                >
                  ← Retour
                </button>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, position: 'fixed', top: 64, left: 280, right: 24, backgroundColor: '#f8fafc', paddingTop: 16, paddingBottom: 8, zIndex: 15, borderBottom: '1px solid #e5e7eb' }}>Détails de la demande</h1>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Détails de la demande */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                  <h2 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Informations client</h2>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Email:</strong> {selectedRequest.email}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Entreprise:</strong> {selectedRequest.companyName}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Type de projet:</strong> {selectedRequest.projectType}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Budget:</strong> {selectedRequest.budget || 'Non spécifié'}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Délai:</strong> {selectedRequest.timeline}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Fonctionnalités:</strong> {selectedRequest.features}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Design:</strong> {selectedRequest.designPreferences}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Contenu:</strong> {selectedRequest.contentType}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Maintenance:</strong> {selectedRequest.maintenance}
                  </div>
                  {selectedRequest.additionalInfo && (
                    <div style={{ marginBottom: 12 }}>
                      <strong>Infos complémentaires:</strong> {selectedRequest.additionalInfo}
                    </div>
                  )}
                  <div style={{ marginBottom: 12 }}>
                    <strong>Statut:</strong> 
                    <span style={{ 
                      color: selectedRequest.status === 'pending' ? '#f59e0b' : 
                            selectedRequest.status === 'in_progress' ? '#3b82f6' : 
                            selectedRequest.status === 'completed' ? '#10b981' : '#ef4444',
                      fontWeight: 500,
                      marginLeft: 8
                    }}>
                      {selectedRequest.status === 'pending' ? 'En attente' :
                       selectedRequest.status === 'in_progress' ? 'En cours' :
                       selectedRequest.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </span>
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Formulaire de devis */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                  <h2 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Envoyer un devis</h2>
                  
                  {selectedRequest.quote?.sentAt && (
                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                      <strong>Devis déjà envoyé le:</strong> {new Date(selectedRequest.quote.sentAt).toLocaleDateString()}
                      <br />
                      <strong>Montant:</strong> {selectedRequest.quote.amount} FCFA
                      <br />
                      {selectedRequest.quote.description && (
                        <>
                          <strong>Description:</strong> {selectedRequest.quote.description}
                        </>
                      )}
                    </div>
                  )}

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Montant (FCFA)</label>
                    <input
                      type="number"
                      value={quoteForm.amount}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, amount: e.target.value }))}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                      placeholder="ex: 1500000"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Description du devis</label>
                    <textarea
                      value={quoteForm.description}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, description: e.target.value }))}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6, minHeight: 80, resize: 'vertical' }}
                      placeholder="Détails du devis, prestations incluses..."
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Notes admin (privées)</label>
                    <textarea
                      value={quoteForm.adminNotes}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6, minHeight: 60, resize: 'vertical' }}
                      placeholder="Notes internes..."
                    />
                  </div>

                  <button
                    onClick={() => sendQuote(selectedRequest._id)}
                    disabled={!quoteForm.amount || !quoteForm.description || isLoading}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: (!quoteForm.amount || !quoteForm.description || isLoading) ? '#d1d5db' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: (!quoteForm.amount || !quoteForm.description || isLoading) ? 'not-allowed' : 'pointer',
                      fontWeight: 500
                    }}
                  >
                    {isLoading ? 'Envoi...' : 'Envoyer le devis'}
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600, position: 'fixed', top: 64, left: 280, right: 24, backgroundColor: '#f8fafc', paddingTop: 16, paddingBottom: 8, zIndex: 15, borderBottom: '1px solid #e5e7eb' }}>Demandes de sites</h1>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', background: '#f8fafc', padding: '10px 12px', fontWeight: 600, color: '#334155' }}>
                <div>Email</div>
                <div>Entreprise</div>
                <div>Type</div>
                <div>Statut</div>
                <div>Date</div>
                <div>Action</div>
              </div>
              <div style={{ maxHeight: 420, overflow: 'auto' }}>
                {siteRequests.length === 0 ? (
                  <div style={{ padding: 12, color: '#64748b' }}>Aucune demande</div>
                ) : (
                  siteRequests.map(request => (
                    <div key={request._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', padding: '10px 12px', borderTop: '1px solid #e5e7eb', alignItems: 'center' }}>
                      <div style={{ color: '#0f172a' }}>{request.email}</div>
                      <div style={{ color: '#334155' }}>{request.companyName}</div>
                      <div style={{ color: '#334155' }}>{request.projectType}</div>
                      <div style={{ 
                        color: request.status === 'pending' ? '#f59e0b' : 
                              request.status === 'in_progress' ? '#3b82f6' : 
                              request.status === 'completed' ? '#10b981' : '#ef4444',
                        fontWeight: 500
                      }}>
                        {request.status === 'pending' ? 'En attente' :
                         request.status === 'in_progress' ? 'En cours' :
                         request.status === 'completed' ? 'Terminé' : 'Annulé'}
                        {request.quote?.sentAt && (
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            Devis: {request.quote.amount} FCFA
                          </div>
                        )}
                      </div>
                      <div style={{ color: '#334155' }}>{new Date(request.createdAt).toLocaleDateString()}</div>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        style={{
                          padding: '4px 8px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Voir
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case 'projects':
        return <Projects />;
      case 'marketing':
        return <MarketingHub />;
      case 'payments':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600, position: 'fixed', top: 64, left: 280, right: 24, backgroundColor: '#f8fafc', paddingTop: 16, paddingBottom: 8, zIndex: 15, borderBottom: '1px solid #e5e7eb' }}>Paiements</h1>
            <div style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, textAlign: 'center', color: '#64748b' }}>
              Gestion des paiements et abonnements premium
            </div>
          </div>
        );
      case 'stats':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600, position: 'fixed', top: 64, left: 280, right: 24, backgroundColor: '#f8fafc', paddingTop: 16, paddingBottom: 8, zIndex: 15, borderBottom: '1px solid #e5e7eb' }}>Statistiques détaillées</h1>
            <div style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, textAlign: 'center', color: '#64748b' }}>
              Analytics et métriques de la plateforme
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600, position: 'fixed', top: 64, left: 280, right: 24, backgroundColor: '#f8fafc', paddingTop: 16, paddingBottom: 8, zIndex: 15, borderBottom: '1px solid #e5e7eb' }}>Paramètres</h1>
            <div style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, textAlign: 'center', color: '#64748b' }}>
              Configuration de la plateforme
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        onLogout={logout}
        currentUser={currentUser || { email, role: 'admin' }}
      />
      <div style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>
        {/* Header avec barre de recherche et contributeurs */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '4px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 256,
          right: 0,
          height: 40,
          zIndex: 20
        }}>
          <div style={{ flex: 1 }}></div>
          
          {/* Barre de recherche au centre */}
          <div style={{ flex: 2, maxWidth: 400, margin: '0 24px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Rechercher..."
                style={{
                  width: '100%',
                  padding: '6px 16px 6px 36px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 13,
                  backgroundColor: '#f9fafb'
                }}
              />
              <svg 
                style={{ 
                  position: 'absolute', 
                  left: 10, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 16,
                  color: '#6b7280'
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Collaborateurs et utilisateur connecté à droite */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b', marginRight: 8 }}>Équipe</span>
            
            {/* Groupe d'avatars des collaborateurs */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Avatars des collaborateurs */}
              {users.filter(user => ['admin', 'moderator', 'developer_fullstack', 'designer_ux', 'commercial', 'marketing'].includes(user.role)).slice(0, 4).map((collaborator, index) => (
                <div 
                  key={collaborator._id} 
                  style={{ 
                    position: 'relative',
                    marginLeft: index > 0 ? -8 : 0,
                    transition: 'all 0.2s ease',
                    zIndex: 10 - index
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                    e.currentTarget.style.zIndex = '20';
                    e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.zIndex = 10 - index;
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 600,
                    border: '2px solid white',
                    cursor: 'pointer',
                    title: `${collaborator.name} (${collaborator.email})`
                  }}>
                    {collaborator.name 
                      ? collaborator.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()
                      : collaborator.email.substring(0, 2).toUpperCase()
                    }
                  </div>
                  {/* Indicateur de statut en ligne */}
                  <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '2px solid white',
                    zIndex: 1
                  }}></div>
                </div>
              ))}
              
              {/* Utilisateur connecté avec bordure spéciale */}
              <div 
                style={{ 
                  position: 'relative', 
                  marginLeft: 8,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                  e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.filter = 'none';
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 600,
                  border: '3px solid #fbbf24',
                  cursor: 'pointer',
                  title: currentUser ? `${currentUser.name} (${currentUser.email}) - Vous` : `${email} - Vous`
                }}>
                  {currentUser && currentUser.name 
                    ? currentUser.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()
                    : email ? email.substring(0, 2).toUpperCase() : 'AD'
                  }
                </div>
                {/* Indicateur de statut en ligne pour l'utilisateur connecté */}
                <div style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '2px solid white',
                  zIndex: 1
                }}></div>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main" style={{ flex: 1, padding: '120px 24px 24px 24px', backgroundColor: '#f8fafc', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}


