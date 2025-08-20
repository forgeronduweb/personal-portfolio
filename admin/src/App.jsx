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
              <h2 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 600 }}>Activités récentes</h2>
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
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Utilisateurs récents</h3>
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
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Demandes récentes</h3>
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        onLogout={logout}
        currentUser={{ email }}
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

          {/* Contributeur connecté à droite */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Connecté en tant que</span>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 11,
              fontWeight: 600,
              border: '2px solid white',
              cursor: 'pointer',
              title: email
            }}>
              {email ? email.substring(0, 2).toUpperCase() : 'AD'}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, paddingTop: 64, padding: 24, backgroundColor: '#f8fafc', overflow: 'auto' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}


