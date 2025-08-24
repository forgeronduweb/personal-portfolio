import { useState, useEffect } from 'react';

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    type: 'info' // info, promotion, update
  });

  // Configuration API
  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'https://personal-portfolio-back.onrender.com';
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  };

  const API_URL = getApiUrl();
  const token = localStorage.getItem('admin_token');

  // Charger les newsletters
  const loadNewsletters = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/newsletters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur chargement newsletters');
      setNewsletters(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un email
  const deleteNewsletter = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet email ?')) return;
    
    try {
      const res = await fetch(`${API_URL}/admin/newsletters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur suppression');
      
      setNewsletters(prev => prev.filter(n => n._id !== id));
      alert('Email supprimé avec succès!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Envoyer un email à tous les abonnés
  const sendNewsletter = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/admin/newsletters/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...emailForm,
          recipients: selectedEmails.length > 0 ? selectedEmails : newsletters.map(n => n.email)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur envoi newsletter');
      
      setShowSendModal(false);
      setEmailForm({ subject: '', message: '', type: 'info' });
      setSelectedEmails([]);
      alert(`Newsletter envoyée à ${data.sentCount} destinataires!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Sélectionner/désélectionner tous les emails
  const toggleSelectAll = () => {
    if (selectedEmails.length === newsletters.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(newsletters.map(n => n.email));
    }
  };

  // Sélectionner/désélectionner un email
  const toggleSelectEmail = (email) => {
    setSelectedEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  useEffect(() => {
    loadNewsletters();
  }, []);

  return (
    <div style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, position: 'fixed', top: 64, left: 280, right: 24, backgroundColor: '#f8fafc', paddingTop: 16, paddingBottom: 8, zIndex: 15, borderBottom: '1px solid #e5e7eb' }}>
          Gestion Newsletter
        </h1>
        <div style={{ display: 'flex', gap: 12, position: 'fixed', top: 72, right: 32, zIndex: 20 }}>
          <button
            onClick={() => setShowSendModal(true)}
            disabled={newsletters.length === 0}
            style={{
              padding: '8px 16px',
              background: newsletters.length === 0 ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: newsletters.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            📧 Envoyer Newsletter
          </button>
          <button
            onClick={loadNewsletters}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {error && (
          <div style={{
            padding: 12,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 6,
            color: '#dc2626',
            marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {/* Statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6', fontSize: 24, fontWeight: 700 }}>
            {newsletters.length}
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Abonnés total</p>
        </div>
        <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#10b981', fontSize: 24, fontWeight: 700 }}>
            {selectedEmails.length}
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Sélectionnés</p>
        </div>
      </div>

      {/* Liste des emails */}
      <div style={{ backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="checkbox"
            checked={newsletters.length > 0 && selectedEmails.length === newsletters.length}
            onChange={toggleSelectAll}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 500 }}>
            Sélectionner tout ({newsletters.length} emails)
          </span>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            Chargement des abonnés...
          </div>
        ) : newsletters.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Aucun abonné</h3>
            <p style={{ margin: 0 }}>Les visiteurs qui s'inscriront à la newsletter apparaîtront ici.</p>
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            {newsletters.map((newsletter) => (
              <div
                key={newsletter._id}
                style={{
                  padding: 16,
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: selectedEmails.includes(newsletter.email) ? '#f0f9ff' : 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(newsletter.email)}
                    onChange={() => toggleSelectEmail(newsletter.email)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, color: '#0f172a' }}>
                      {newsletter.email}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Inscrit le {new Date(newsletter.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteNewsletter(newsletter._id)}
                  style={{
                    padding: '4px 8px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'envoi de newsletter */}
      {showSendModal && (
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
            width: 500,
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>
              Envoyer une Newsletter
            </h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                Destinataires ({selectedEmails.length > 0 ? selectedEmails.length : newsletters.length})
              </label>
              <div style={{ 
                padding: 8, 
                backgroundColor: '#f8fafc', 
                borderRadius: 4, 
                fontSize: 12, 
                color: '#64748b' 
              }}>
                {selectedEmails.length > 0 
                  ? `${selectedEmails.length} emails sélectionnés`
                  : `Tous les abonnés (${newsletters.length})`
                }
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Type</label>
              <select
                value={emailForm.type}
                onChange={(e) => setEmailForm(prev => ({ ...prev, type: e.target.value }))}
                style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
              >
                <option value="info">Information</option>
                <option value="promotion">Promotion</option>
                <option value="update">Mise à jour</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Sujet</label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                placeholder="Sujet de l'email"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Message</label>
              <textarea
                value={emailForm.message}
                onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: 8, 
                  border: '1px solid #d1d5db', 
                  borderRadius: 6,
                  minHeight: 120,
                  resize: 'vertical'
                }}
                placeholder="Contenu de votre newsletter..."
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  setEmailForm({ subject: '', message: '', type: 'info' });
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
                onClick={sendNewsletter}
                disabled={!emailForm.subject || !emailForm.message || isLoading}
                style={{
                  padding: '8px 16px',
                  background: (!emailForm.subject || !emailForm.message || isLoading) ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: (!emailForm.subject || !emailForm.message || isLoading) ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                {isLoading ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Newsletter;
