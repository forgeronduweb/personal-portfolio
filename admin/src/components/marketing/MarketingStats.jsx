import { useState, useEffect } from 'react';

const MarketingStats = () => {
  const [stats, setStats] = useState({
    prospects: {
      total: 0,
      byStatus: {},
      bySource: {},
      conversionRate: 0
    },
    campaigns: {
      total: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0
    },
    promotions: {
      total: 0,
      totalUsed: 0,
      revenue: 0
    },
    revenue: {
      total: 0,
      byMonth: [],
      roi: 0
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, 365 jours

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

  useEffect(() => {
    loadStats();
  }, [dateRange]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/marketing/stats?days=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur chargement statistiques');
      setStats(data.data || stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div>
      {/* Header avec sélecteur de période */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#0f172a' }}>
            📊 Statistiques Marketing
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
            Analysez les performances de vos campagnes et prospects
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            backgroundColor: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">3 derniers mois</option>
          <option value="365">12 derniers mois</option>
        </select>
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

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
          Chargement des statistiques...
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* KPIs principaux */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 16
          }}>
            <div style={{
              padding: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 24 }}>👥</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#374151' }}>
                  Prospects
                </h3>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                {formatNumber(stats.prospects.total)}
              </div>
              <div style={{ fontSize: 14, color: '#64748b' }}>
                Taux de conversion: {formatPercentage(stats.prospects.conversionRate)}
              </div>
            </div>

            <div style={{
              padding: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 24 }}>📧</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#374151' }}>
                  Campagnes Email
                </h3>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                {formatNumber(stats.campaigns.total)}
              </div>
              <div style={{ fontSize: 14, color: '#64748b' }}>
                Taux d'ouverture: {formatPercentage(stats.campaigns.openRate)}
              </div>
            </div>

            <div style={{
              padding: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 24 }}>🎯</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#374151' }}>
                  Promotions
                </h3>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                {formatNumber(stats.promotions.totalUsed)}
              </div>
              <div style={{ fontSize: 14, color: '#64748b' }}>
                Sur {formatNumber(stats.promotions.total)} créées
              </div>
            </div>

            <div style={{
              padding: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 24 }}>💰</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#374151' }}>
                  Chiffre d'affaires
                </h3>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                {formatCurrency(stats.revenue.total)}
              </div>
              <div style={{ fontSize: 14, color: '#64748b' }}>
                ROI: {formatPercentage(stats.revenue.roi)}
              </div>
            </div>
          </div>

          {/* Graphiques et détails */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24
          }}>
            {/* Répartition des prospects par statut */}
            <div style={{
              padding: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#374151' }}>
                Prospects par statut
              </h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {Object.entries(stats.prospects.byStatus).map(([status, count]) => {
                  const percentage = stats.prospects.total > 0 ? (count / stats.prospects.total) * 100 : 0;
                  const statusLabels = {
                    new: { label: 'Nouveau', color: '#3b82f6' },
                    interested: { label: 'Intéressé', color: '#f59e0b' },
                    negotiating: { label: 'En négociation', color: '#8b5cf6' },
                    confirmed: { label: 'Client confirmé', color: '#10b981' },
                    lost: { label: 'Perdu', color: '#ef4444' }
                  };
                  const statusInfo = statusLabels[status] || { label: status, color: '#64748b' };
                  
                  return (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: statusInfo.color
                      }} />
                      <div style={{ flex: 1, fontSize: 14, color: '#374151' }}>
                        {statusInfo.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>
                        {count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sources de prospects */}
            <div style={{
              padding: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#374151' }}>
                Sources d'acquisition
              </h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {Object.entries(stats.prospects.bySource).map(([source, count]) => {
                  const percentage = stats.prospects.total > 0 ? (count / stats.prospects.total) * 100 : 0;
                  const sourceLabels = {
                    website: { label: 'Site web', icon: '🌐' },
                    newsletter: { label: 'Newsletter', icon: '📧' },
                    social: { label: 'Réseaux sociaux', icon: '📱' },
                    referral: { label: 'Recommandation', icon: '👥' },
                    direct: { label: 'Contact direct', icon: '📞' }
                  };
                  const sourceInfo = sourceLabels[source] || { label: source, icon: '📊' };
                  
                  return (
                    <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 16 }}>{sourceInfo.icon}</div>
                      <div style={{ flex: 1, fontSize: 14, color: '#374151' }}>
                        {sourceInfo.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>
                        {count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Performance des campagnes email */}
          <div style={{
            padding: 20,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#374151' }}>
              Performance des campagnes email
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>
                  {formatPercentage(stats.campaigns.openRate)}
                </div>
                <div style={{ fontSize: 14, color: '#64748b' }}>Taux d'ouverture</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#10b981' }}>
                  {formatPercentage(stats.campaigns.clickRate)}
                </div>
                <div style={{ fontSize: 14, color: '#64748b' }}>Taux de clic</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#ef4444' }}>
                  {formatPercentage(stats.campaigns.unsubscribeRate)}
                </div>
                <div style={{ fontSize: 14, color: '#64748b' }}>Taux de désabonnement</div>
              </div>
            </div>
          </div>

          {/* Évolution du chiffre d'affaires */}
          {stats.revenue.byMonth && stats.revenue.byMonth.length > 0 && (
            <div style={{
              padding: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#374151' }}>
                Évolution du chiffre d'affaires
              </h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'end', height: 200 }}>
                {stats.revenue.byMonth.map((monthData, index) => {
                  const maxRevenue = Math.max(...stats.revenue.byMonth.map(m => m.revenue));
                  const height = maxRevenue > 0 ? (monthData.revenue / maxRevenue) * 160 : 0;
                  
                  return (
                    <div key={index} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <div style={{
                        width: '100%',
                        height: height,
                        backgroundColor: '#3b82f6',
                        borderRadius: '4px 4px 0 0',
                        minHeight: 2
                      }} />
                      <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                        {monthData.month}
                      </div>
                      <div style={{ fontSize: 10, color: '#374151', textAlign: 'center' }}>
                        {formatCurrency(monthData.revenue)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div style={{
            padding: 20,
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: 12
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#374151' }}>
              Actions rapides
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12
            }}>
              <button
                onClick={() => window.open('/admin#marketing/newsletter', '_self')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14
                }}
              >
                📧 Créer une campagne
              </button>
              <button
                onClick={() => window.open('/admin#marketing/promotions', '_self')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14
                }}
              >
                🎯 Nouvelle promotion
              </button>
              <button
                onClick={() => window.open('/admin#marketing/crm', '_self')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14
                }}
              >
                👥 Gérer prospects
              </button>
              <button
                onClick={() => window.open('/admin#marketing/automations', '_self')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14
                }}
              >
                ⚡ Configurer automatisations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingStats;
