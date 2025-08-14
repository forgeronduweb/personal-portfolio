import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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

  function logout() {
    localStorage.removeItem('admin_token')
    setToken('')
    setStats(null)
  }

  useEffect(() => {
    if (!token) return
    ;(async () => {
      setIsLoading(true)
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
        ])
        const statsData = await statsRes.json()
        const usersData = await usersRes.json()
        if (!statsRes.ok) throw new Error(statsData.message || 'Erreur chargement stats')
        if (!usersRes.ok) throw new Error(usersData.message || 'Erreur chargement utilisateurs')
        setStats(statsData.data)
        setUsers(Array.isArray(usersData.data) ? usersData.data : [])
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

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <button onClick={logout} style={{ padding: 8, borderRadius: 8, background: '#111827', color: 'white' }}>Déconnexion</button>
      </div>
      {error && <div style={{ color: '#b91c1c', marginTop: 12 }}>{error}</div>}
      {isLoading && <div style={{ marginTop: 12, color: '#64748b' }}>Chargement…</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: 24 }}>
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
      <div style={{ marginTop: 28 }}>
        <h2 style={{ margin: 0, marginBottom: 12, fontSize: 18 }}>Utilisateurs inscrits</h2>
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
    </div>
  )
}


