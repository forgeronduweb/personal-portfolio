import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Projects from './components/Projects'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

  async function login(e) {
    e?.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur de connexion')
      if (data.user?.role !== 'admin') throw new Error("Ce compte n'est pas admin")
      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
    } catch (err) {
      setError(err.message)
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

  function logout() {
    localStorage.removeItem('admin_token')
    setToken('')
    setStats(null)
    setUsers([])
    setSiteRequests([])
    setSelectedRequest(null)
    setActiveSection('dashboard')
  }

  useEffect(() => {
    if (!token) return
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
  }, [token])

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={login} style={{ border: '1px solid #e5e7eb', padding: 24, borderRadius: 12, width: 360 }}>
          <h1 style={{ margin: 0, marginBottom: 12 }}>Connexion Admin</h1>
          {error && <div style={{ color: '#b91c1c', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <label>Mot de passe</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <button type="submit" style={{ marginTop: 12, padding: 10, borderRadius: 8, background: '#0f172a', color: 'white' }}>Se connecter</button>
          </div>
        </form>
      </div>
    )
  }

  // Rendu du contenu selon la section active
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Dashboard</h1>
            {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
            {isLoading && <div style={{ marginBottom: 12, color: '#64748b' }}>Chargement…</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <div>Total utilisateurs</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{stats?.usersCount ?? '-'}</div>
              </div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <div>Premium</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{stats?.premiumCount ?? '-'}</div>
              </div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <div>Admins</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{stats?.adminsCount ?? '-'}</div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Gestion des utilisateurs</h1>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr', background: '#f8fafc', padding: '10px 12px', fontWeight: 600, color: '#334155' }}>
                <div>Nom</div>
                <div>Email</div>
                <div>Rôle</div>
                <div>Inscription</div>
              </div>
              <div style={{ maxHeight: 420, overflow: 'auto' }}>
                {users.length === 0 ? (
                  <div style={{ padding: 12, color: '#64748b' }}>Aucun utilisateur</div>
                ) : (
                  users.map(u => (
                    <div key={u.id || u._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr', padding: '10px 12px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ color: '#0f172a' }}>{u.name || '-'}</div>
                      <div style={{ color: '#334155' }}>{u.email}</div>
                      <div style={{ color: '#334155' }}>{u.role}</div>
                      <div style={{ color: '#334155' }}>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</div>
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
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Détails de la demande</h1>
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
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Demandes de sites</h1>
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
      case 'payments':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Paiements</h1>
            <div style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, textAlign: 'center', color: '#64748b' }}>
              Gestion des paiements et abonnements premium
            </div>
          </div>
        );
      case 'stats':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Statistiques détaillées</h1>
            <div style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, textAlign: 'center', color: '#64748b' }}>
              Analytics et métriques de la plateforme
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 style={{ margin: 0, marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Paramètres</h1>
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        onLogout={logout}
        currentUser={{ email }}
      />
      <main style={{ flex: 1, padding: 24, backgroundColor: '#f8fafc' }}>
        {renderContent()}
      </main>
    </div>
  )
}


