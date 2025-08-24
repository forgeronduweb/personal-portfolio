import { useState, useEffect } from 'react';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [promotionForm, setPromotionForm] = useState({
    name: '',
    code: '',
    type: 'percentage', // percentage, fixed, pack
    value: 0,
    description: '',
    validFrom: '',
    validUntil: '',
    maxUses: 0,
    minOrderValue: 0,
    isActive: true,
    applicableServices: []
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

  const promotionTypes = [
    { value: 'percentage', label: 'Pourcentage', icon: '%', example: '20% de réduction' },
    { value: 'fixed', label: 'Montant fixe', icon: 'FCFA', example: '50000 FCFA de réduction' },
    { value: 'pack', label: 'Pack promotionnel', icon: '📦', example: 'Site + Hébergement + Maintenance' }
  ];

  const services = [
    { value: 'website', label: 'Site web' },
    { value: 'hosting', label: 'Hébergement' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'seo', label: 'SEO' },
    { value: 'design', label: 'Design graphique' }
  ];

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/marketing/promotions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur chargement promotions');
      setPromotions(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createPromotion = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/marketing/promotions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(promotionForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur création promotion');
      
      setPromotions([data.data, ...promotions]);
      setShowCreateModal(false);
      setPromotionForm({
        name: '',
        code: '',
        type: 'percentage',
        value: 0,
        description: '',
        validFrom: '',
        validUntil: '',
        maxUses: 0,
        minOrderValue: 0,
        isActive: true,
        applicableServices: []
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePromotion = async (id, isActive) => {
    try {
      const res = await fetch(`${API_URL}/admin/marketing/promotions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur mise à jour');
      
      setPromotions(promotions.map(promo => 
        promo._id === id ? { ...promo, isActive: !isActive } : promo
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPromotionForm({...promotionForm, code});
  };

  const getPromotionTypeInfo = (type) => {
    return promotionTypes.find(t => t.value === type) || promotionTypes[0];
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#0f172a' }}>
            🎯 Promotions & Offres
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
            Créez et gérez vos codes promo et packs promotionnels
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
          + Nouvelle promotion
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

      {/* Statistiques rapides */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          padding: 16,
          backgroundColor: '#f0f9ff',
          borderRadius: 8,
          border: '1px solid #0ea5e920'
        }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#0ea5e9' }}>
            {promotions.filter(p => p.isActive).length}
          </div>
          <div style={{ fontSize: 14, color: '#0ea5e9', fontWeight: 500 }}>
            Promotions actives
          </div>
        </div>
        <div style={{
          padding: 16,
          backgroundColor: '#f0fdf4',
          borderRadius: 8,
          border: '1px solid #22c55e20'
        }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>
            {promotions.reduce((sum, p) => sum + (p.usedCount || 0), 0)}
          </div>
          <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 500 }}>
            Utilisations totales
          </div>
        </div>
        <div style={{
          padding: 16,
          backgroundColor: '#fef3c7',
          borderRadius: 8,
          border: '1px solid #f59e0b20'
        }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#f59e0b' }}>
            {promotions.filter(p => isExpired(p.validUntil)).length}
          </div>
          <div style={{ fontSize: 14, color: '#f59e0b', fontWeight: 500 }}>
            Expirées
          </div>
        </div>
      </div>

      {/* Liste des promotions */}
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        backgroundColor: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 100px 80px',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          borderRadius: '12px 12px 0 0'
        }}>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>TYPE</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>NOM & CODE</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>RÉDUCTION</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>VALIDITÉ</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>UTILISATIONS</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>STATUT</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>ACTIONS</div>
        </div>

        {/* Contenu */}
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            Chargement...
          </div>
        ) : promotions.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <p>Aucune promotion créée</p>
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
          promotions.map(promotion => {
            const typeInfo = getPromotionTypeInfo(promotion.type);
            const expired = isExpired(promotion.validUntil);
            
            return (
              <div key={promotion._id} style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 100px 80px',
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: 20 }}>{typeInfo.icon}</div>
                <div>
                  <div style={{ fontWeight: 500, color: '#0f172a' }}>{promotion.name}</div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#64748b',
                    fontFamily: 'monospace',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: 4,
                    display: 'inline-block',
                    marginTop: 2
                  }}>
                    {promotion.code}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {promotion.type === 'percentage' && `${promotion.value}%`}
                  {promotion.type === 'fixed' && `${promotion.value} FCFA`}
                  {promotion.type === 'pack' && 'Pack spécial'}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  <div>Du {new Date(promotion.validFrom).toLocaleDateString()}</div>
                  <div>Au {new Date(promotion.validUntil).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {promotion.usedCount || 0}
                  {promotion.maxUses > 0 && ` / ${promotion.maxUses}`}
                </div>
                <div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 500,
                    backgroundColor: expired ? '#fee2e2' : promotion.isActive ? '#dcfce7' : '#f1f5f9',
                    color: expired ? '#dc2626' : promotion.isActive ? '#166534' : '#64748b'
                  }}>
                    {expired ? 'Expirée' : promotion.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {!expired && (
                    <button
                      onClick={() => togglePromotion(promotion._id, promotion.isActive)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: promotion.isActive ? '#f59e0b' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 10
                      }}
                      title={promotion.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {promotion.isActive ? '⏸️' : '▶️'}
                    </button>
                  )}
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
            maxWidth: 700,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 600 }}>
              Nouvelle promotion
            </h3>

            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Nom de la promotion
                  </label>
                  <input
                    type="text"
                    value={promotionForm.name}
                    onChange={(e) => setPromotionForm({...promotionForm, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                    placeholder="Ex: Offre de lancement"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Code promo
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={promotionForm.code}
                      onChange={(e) => setPromotionForm({...promotionForm, code: e.target.value.toUpperCase()})}
                      style={{
                        flex: 1,
                        padding: 8,
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontFamily: 'monospace'
                      }}
                      placeholder="PROMO2024"
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      🎲
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Type de promotion
                  </label>
                  <select
                    value={promotionForm.type}
                    onChange={(e) => setPromotionForm({...promotionForm, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  >
                    {promotionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Valeur
                  </label>
                  <input
                    type="number"
                    value={promotionForm.value}
                    onChange={(e) => setPromotionForm({...promotionForm, value: parseFloat(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                    placeholder={promotionForm.type === 'percentage' ? '20' : '50000'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Description
                </label>
                <textarea
                  value={promotionForm.description}
                  onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    minHeight: 80,
                    resize: 'vertical'
                  }}
                  placeholder="Description de l'offre..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Valide du
                  </label>
                  <input
                    type="date"
                    value={promotionForm.validFrom}
                    onChange={(e) => setPromotionForm({...promotionForm, validFrom: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Valide jusqu'au
                  </label>
                  <input
                    type="date"
                    value={promotionForm.validUntil}
                    onChange={(e) => setPromotionForm({...promotionForm, validUntil: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Nombre max d'utilisations (0 = illimité)
                  </label>
                  <input
                    type="number"
                    value={promotionForm.maxUses}
                    onChange={(e) => setPromotionForm({...promotionForm, maxUses: parseInt(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                    min="0"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Montant minimum commande (FCFA)
                  </label>
                  <input
                    type="number"
                    value={promotionForm.minOrderValue}
                    onChange={(e) => setPromotionForm({...promotionForm, minOrderValue: parseFloat(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  Services applicables
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
                  {services.map(service => (
                    <label key={service.value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={promotionForm.applicableServices.includes(service.value)}
                        onChange={(e) => {
                          const services = e.target.checked 
                            ? [...promotionForm.applicableServices, service.value]
                            : promotionForm.applicableServices.filter(s => s !== service.value);
                          setPromotionForm({...promotionForm, applicableServices: services});
                        }}
                      />
                      <span style={{ fontSize: 14 }}>{service.label}</span>
                    </label>
                  ))}
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
                onClick={createPromotion}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Créer la promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
