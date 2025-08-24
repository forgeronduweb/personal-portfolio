import { useState, useEffect } from 'react';

const CRM = () => {
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    type: 'email', // email, call, meeting, quote
    subject: '',
    content: '',
    nextAction: '',
    nextActionDate: ''
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

  const prospectStatuses = [
    { value: 'new', label: 'Nouveau', color: '#3b82f6', bg: '#dbeafe' },
    { value: 'interested', label: 'Intéressé', color: '#f59e0b', bg: '#fef3c7' },
    { value: 'negotiating', label: 'En négociation', color: '#8b5cf6', bg: '#ede9fe' },
    { value: 'confirmed', label: 'Client confirmé', color: '#10b981', bg: '#d1fae5' },
    { value: 'lost', label: 'Perdu', color: '#ef4444', bg: '#fee2e2' }
  ];

  const interactionTypes = [
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'call', label: 'Appel', icon: '📞' },
    { value: 'meeting', label: 'Réunion', icon: '🤝' },
    { value: 'quote', label: 'Devis envoyé', icon: '📋' }
  ];

  useEffect(() => {
    loadProspects();
    
    // Écouter les mises à jour de prospects
    const handleProspectsUpdate = () => {
      console.log('🔄 Rechargement des prospects suite à synchronisation');
      loadProspects();
    };
    
    window.addEventListener('prospectsUpdated', handleProspectsUpdate);
    
    return () => {
      window.removeEventListener('prospectsUpdated', handleProspectsUpdate);
    };
  }, []);

  const loadProspects = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('🔄 Chargement prospects depuis:', `${API_URL}/admin/marketing/prospects`);
      const res = await fetch(`${API_URL}/admin/marketing/prospects`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Réponse statut:', res.status);
      const data = await res.json();
      console.log('📊 Données reçues:', data);
      
      if (!res.ok) {
        throw new Error(data.message || `Erreur HTTP ${res.status}`);
      }
      
      const prospectsData = data.data || data || [];
      console.log('👥 Prospects à afficher:', prospectsData.length);
      setProspects(Array.isArray(prospectsData) ? prospectsData : []);
      
    } catch (err) {
      console.error('❌ Erreur chargement prospects:', err);
      setError(`Erreur: ${err.message}`);
      setProspects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProspectStatus = async (prospectId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/admin/marketing/prospects/${prospectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur mise à jour statut');
      
      setProspects(prospects.map(p => 
        p._id === prospectId ? { ...p, status: newStatus } : p
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const addInteraction = async () => {
    if (!selectedProspect) return;
    
    try {
      const res = await fetch(`${API_URL}/admin/marketing/prospects/${selectedProspect._id}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(interactionForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur ajout interaction');
      
      // Recharger les prospects pour mettre à jour les interactions
      await loadProspects();
      setShowInteractionModal(false);
      setInteractionForm({
        type: 'email',
        subject: '',
        content: '',
        nextAction: '',
        nextActionDate: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusInfo = (status) => {
    return prospectStatuses.find(s => s.value === status) || prospectStatuses[0];
  };

  return (
    <div>
      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#0f172a' }}>
            👥 CRM & Prospects
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
            Gérez vos prospects et suivez l'historique des interactions
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => window.open('/admin#site-requests', '_blank')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            📋 Voir demandes de sites
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: 12,
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          color: '#dc2626',
          marginBottom: 16
        }}>
          {error}
        </div>
      )}

      {/* Statistiques rapides */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {prospectStatuses.map(status => {
          const count = prospects.filter(p => p.status === status.value).length;
          return (
            <div key={status.value} style={{
              padding: 16,
              backgroundColor: status.bg,
              borderRadius: 8,
              border: `1px solid ${status.color}20`
            }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: status.color }}>
                {count}
              </div>
              <div style={{ fontSize: 14, color: status.color, fontWeight: 500 }}>
                {status.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Liste des prospects */}
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        backgroundColor: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          borderRadius: '12px 12px 0 0'
        }}>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>PROSPECT</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>PROJET</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>STATUT</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>DERNIÈRE INTERACTION</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>VALEUR</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>ACTIONS</div>
        </div>

        {/* Contenu */}
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            Chargement...
          </div>
        ) : prospects.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <p>Aucun prospect trouvé</p>
            <p style={{ fontSize: 14 }}>
              Les prospects sont automatiquement créés à partir des demandes de sites
            </p>
          </div>
        ) : (
          prospects.map(prospect => {
            const statusInfo = getStatusInfo(prospect.status);
            const lastInteraction = prospect.interactions?.[0];
            
            return (
              <div key={prospect._id} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 500, color: '#0f172a' }}>
                    {prospect.companyName || prospect.email}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {prospect.email}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {prospect.projectType || 'Non spécifié'}
                </div>
                <div>
                  <select
                    value={prospect.status}
                    onChange={(e) => updateProspectStatus(prospect._id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 500,
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {prospectStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {lastInteraction ? (
                    <>
                      <div>{interactionTypes.find(t => t.value === lastInteraction.type)?.icon} {lastInteraction.type}</div>
                      <div>{new Date(lastInteraction.createdAt).toLocaleDateString()}</div>
                    </>
                  ) : (
                    'Aucune'
                  )}
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {prospect.estimatedValue ? `${prospect.estimatedValue} FCFA` : '-'}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => {
                      setSelectedProspect(prospect);
                      setShowInteractionModal(true);
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 10
                    }}
                    title="Ajouter interaction"
                  >
                    💬
                  </button>
                  <button
                    onClick={() => {
                      // Ouvrir détail prospect
                      console.log('Détail prospect:', prospect);
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 10
                    }}
                    title="Voir détails"
                  >
                    👁️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal d'ajout d'interaction */}
      {showInteractionModal && selectedProspect && (
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 600 }}>
              Nouvelle interaction - {selectedProspect.companyName || selectedProspect.email}
            </h3>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Type d'interaction
                </label>
                <select
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm({...interactionForm, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                >
                  {interactionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Sujet/Objet
                </label>
                <input
                  type="text"
                  value={interactionForm.subject}
                  onChange={(e) => setInteractionForm({...interactionForm, subject: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                  placeholder="Ex: Suivi devis site e-commerce"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Contenu/Notes
                </label>
                <textarea
                  value={interactionForm.content}
                  onChange={(e) => setInteractionForm({...interactionForm, content: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    minHeight: 100,
                    resize: 'vertical'
                  }}
                  placeholder="Détails de l'interaction..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Prochaine action
                  </label>
                  <input
                    type="text"
                    value={interactionForm.nextAction}
                    onChange={(e) => setInteractionForm({...interactionForm, nextAction: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                    placeholder="Ex: Relancer dans 1 semaine"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Date prochaine action
                  </label>
                  <input
                    type="date"
                    value={interactionForm.nextActionDate}
                    onChange={(e) => setInteractionForm({...interactionForm, nextActionDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 24
            }}>
              <button
                onClick={() => setShowInteractionModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={addInteraction}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Ajouter l'interaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
