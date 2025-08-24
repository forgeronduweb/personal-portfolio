import { useState, useEffect } from 'react';

const Automations = () => {
  const [automations, setAutomations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [automationForm, setAutomationForm] = useState({
    name: '',
    type: 'welcome', // welcome, follow_up, reminder, abandoned_quote
    trigger: 'user_registration',
    delay: 0, // en heures
    subject: '',
    message: '',
    isActive: true
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

  const automationTypes = [
    { value: 'welcome', label: 'Email de bienvenue', icon: '👋' },
    { value: 'follow_up', label: 'Relance prospects', icon: '📞' },
    { value: 'reminder', label: 'Rappel facture', icon: '💰' },
    { value: 'abandoned_quote', label: 'Devis abandonné', icon: '📋' }
  ];

  const triggers = [
    { value: 'user_registration', label: 'Inscription utilisateur' },
    { value: 'quote_request', label: 'Demande de devis' },
    { value: 'quote_sent', label: 'Devis envoyé' },
    { value: 'payment_due', label: 'Échéance paiement' }
  ];

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/marketing/automations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur chargement automatisations');
      setAutomations(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createAutomation = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/marketing/automations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(automationForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur création automatisation');
      
      setAutomations([data.data, ...automations]);
      setShowCreateModal(false);
      setAutomationForm({
        name: '',
        type: 'welcome',
        trigger: 'user_registration',
        delay: 0,
        subject: '',
        message: '',
        isActive: true
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAutomation = async (id, isActive) => {
    try {
      const res = await fetch(`${API_URL}/admin/marketing/automations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur mise à jour');
      
      setAutomations(automations.map(auto => 
        auto._id === id ? { ...auto, isActive: !isActive } : auto
      ));
    } catch (err) {
      setError(err.message);
    }
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
            ⚡ Automatisations Email
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
            Configurez des emails automatiques basés sur les actions utilisateurs
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          + Nouvelle automatisation
        </button>
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

      {/* Liste des automatisations */}
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        backgroundColor: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 100px 80px',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          borderRadius: '12px 12px 0 0'
        }}>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>TYPE</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>NOM</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>DÉCLENCHEUR</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>DÉLAI</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>ENVOIS</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>STATUT</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>ACTIONS</div>
        </div>

        {/* Contenu */}
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            Chargement...
          </div>
        ) : automations.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <p>Aucune automatisation configurée</p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Créer la première
            </button>
          </div>
        ) : (
          automations.map(automation => {
            const typeInfo = automationTypes.find(t => t.value === automation.type);
            const triggerInfo = triggers.find(t => t.value === automation.trigger);
            
            return (
              <div key={automation._id} style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 100px 80px',
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: 20 }}>{typeInfo?.icon || '⚡'}</div>
                <div>
                  <div style={{ fontWeight: 500, color: '#0f172a' }}>{automation.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{automation.subject}</div>
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {triggerInfo?.label || automation.trigger}
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {automation.delay > 0 ? `${automation.delay}h` : 'Immédiat'}
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {automation.sentCount || 0}
                </div>
                <div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 500,
                    backgroundColor: automation.isActive ? '#dcfce7' : '#f1f5f9',
                    color: automation.isActive ? '#166534' : '#64748b'
                  }}>
                    {automation.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => toggleAutomation(automation._id, automation.isActive)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: automation.isActive ? '#f59e0b' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 10
                    }}
                    title={automation.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {automation.isActive ? '⏸️' : '▶️'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
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
              Nouvelle automatisation
            </h3>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Nom de l'automatisation
                </label>
                <input
                  type="text"
                  value={automationForm.name}
                  onChange={(e) => setAutomationForm({...automationForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                  placeholder="Ex: Email de bienvenue nouveaux clients"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Type d'automatisation
                  </label>
                  <select
                    value={automationForm.type}
                    onChange={(e) => setAutomationForm({...automationForm, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  >
                    {automationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Déclencheur
                  </label>
                  <select
                    value={automationForm.trigger}
                    onChange={(e) => setAutomationForm({...automationForm, trigger: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  >
                    {triggers.map(trigger => (
                      <option key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Délai d'envoi (heures)
                </label>
                <input
                  type="number"
                  value={automationForm.delay}
                  onChange={(e) => setAutomationForm({...automationForm, delay: parseInt(e.target.value) || 0})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                  placeholder="0 = immédiat"
                  min="0"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Sujet de l'email
                </label>
                <input
                  type="text"
                  value={automationForm.subject}
                  onChange={(e) => setAutomationForm({...automationForm, subject: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                  placeholder="Ex: Bienvenue chez [Nom de l'entreprise] !"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Message
                </label>
                <textarea
                  value={automationForm.message}
                  onChange={(e) => setAutomationForm({...automationForm, message: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    minHeight: 120,
                    resize: 'vertical'
                  }}
                  placeholder="Contenu de l'email..."
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 24
            }}>
              <button
                onClick={() => setShowCreateModal(false)}
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
                onClick={createAutomation}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Créer l'automatisation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
