import { useState, useEffect } from 'react';

const AdminDashboard = ({ user, activeSection }) => {
  const [stats, setStats] = useState({});
  const [systemHealth, setSystemHealth] = useState({});
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        premiumUsers: 89,
        activeProjects: 156,
        pendingRequests: 23,
        monthlyRevenue: 15420,
        systemUptime: 99.8
      });
      setSystemHealth({
        server: 'healthy',
        database: 'healthy',
        storage: 'warning',
        api: 'healthy'
      });
      setActivities([
        { id: 1, type: 'user', action: 'Nouvel utilisateur inscrit', user: 'Marie Dubois', time: '5 min', icon: '👤' },
        { id: 2, type: 'project', action: 'Projet terminé', project: 'Portfolio Client A', time: '12 min', icon: '✅' },
        { id: 3, type: 'system', action: 'Sauvegarde automatique', details: 'Base de données', time: '1h', icon: '💾' },
        { id: 4, type: 'payment', action: 'Paiement reçu', amount: '€1,500', time: '2h', icon: '💳' },
        { id: 5, type: 'error', action: 'Erreur système résolue', details: 'API timeout', time: '3h', icon: '🔧' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return { bg: '#f0fdf4', color: '#16a34a', text: 'Sain' };
      case 'warning': return { bg: '#fef3c7', color: '#d97706', text: 'Attention' };
      case 'error': return { bg: '#fef2f2', color: '#dc2626', text: 'Erreur' };
      default: return { bg: '#f3f4f6', color: '#6b7280', text: 'Inconnu' };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'utilisateurs':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Gestion des Utilisateurs
            </h2>
            <div style={{
              backgroundColor: 'white',
              padding: 48,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 600, color: '#1f2937' }}>
                Gestion avancée des utilisateurs
              </h3>
              <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6 }}>
                Cette section sera intégrée avec le système de gestion des utilisateurs existant.
              </p>
            </div>
          </div>
        );

      case 'systeme':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              État du Système
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 32 }}>
              {Object.entries(systemHealth).map(([service, status]) => {
                const healthStyle = getHealthColor(status);
                return (
                  <div key={service} style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1f2937', textTransform: 'capitalize' }}>
                        {service}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        backgroundColor: healthStyle.bg,
                        color: healthStyle.color
                      }}>
                        {healthStyle.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 12,
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                Métriques Système
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{stats.systemUptime}%</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Uptime</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>2.3s</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Temps de réponse moyen</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>847GB</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Stockage utilisé</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'activites':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Activités Récentes
            </h2>
            <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {activities.map((activity, index) => (
                <div key={activity.id} style={{
                  padding: 20,
                  borderBottom: index < activities.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16
                  }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                      {activity.action}
                    </h4>
                    <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 12 }}>
                      {activity.user || activity.project || activity.details || activity.amount} • il y a {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'actions':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Actions Administrateur
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                  Actions Rapides
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { name: 'Sauvegarder la base', icon: '💾', color: '#3b82f6' },
                    { name: 'Redémarrer les services', icon: '🔄', color: '#f59e0b' },
                    { name: 'Nettoyer les logs', icon: '🧹', color: '#10b981' },
                    { name: 'Générer un rapport', icon: '📊', color: '#8b5cf6' }
                  ].map((action, index) => (
                    <button key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}>
                      <span style={{ fontSize: 20 }}>{action.icon}</span>
                      <span style={{ fontWeight: 500, color: '#1f2937', fontSize: 14 }}>{action.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                  Maintenance
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { name: 'Mode maintenance', icon: '🚧', status: 'off' },
                    { name: 'Notifications système', icon: '🔔', status: 'on' },
                    { name: 'Logs détaillés', icon: '📝', status: 'on' },
                    { name: 'Monitoring avancé', icon: '📈', status: 'on' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                        <span style={{ fontWeight: 500, color: '#1f2937', fontSize: 14 }}>{item.name}</span>
                      </div>
                      <div style={{
                        width: 40,
                        height: 20,
                        backgroundColor: item.status === 'on' ? '#10b981' : '#e5e7eb',
                        borderRadius: 10,
                        position: 'relative',
                        cursor: 'pointer'
                      }}>
                        <div style={{
                          width: 16,
                          height: 16,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: 2,
                          left: item.status === 'on' ? 22 : 2,
                          transition: 'left 0.2s'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Tableau de bord Administrateur
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>👥</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>
                    {stats.totalUsers}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Utilisateurs totaux</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>⭐</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                    {stats.premiumUsers}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Utilisateurs premium</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>📁</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>
                    {stats.activeProjects}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Projets actifs</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>💰</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#8b5cf6' }}>
                    €{stats.monthlyRevenue?.toLocaleString()}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Revenus mensuels</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                  Activités Récentes
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8
                    }}>
                      <span style={{ fontSize: 16 }}>{activity.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: '#1f2937', fontSize: 14 }}>{activity.action}</div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>il y a {activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                  État Système
                </h3>
                <div style={{ display: 'grid', gap: 8 }}>
                  {Object.entries(systemHealth).map(([service, status]) => {
                    const healthStyle = getHealthColor(status);
                    return (
                      <div key={service} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 8
                      }}>
                        <span style={{ fontSize: 14, color: '#1f2937', textTransform: 'capitalize' }}>
                          {service}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 500,
                          backgroundColor: healthStyle.bg,
                          color: healthStyle.color
                        }}>
                          {healthStyle.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #dc2626',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#6b7280', margin: 0 }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
