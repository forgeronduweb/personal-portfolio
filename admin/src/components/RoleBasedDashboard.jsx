import { useState, useEffect } from 'react';
import { getDashboardConfig, getRoleNavigation, isAdminRole } from '../utils/roleConfig';

// Import des composants de dashboard spécialisés
import DeveloperDashboard from './dashboards/DeveloperDashboard';
import DesignerDashboard from './dashboards/DesignerDashboard';
import CommercialDashboard from './dashboards/CommercialDashboard';
import MarketingDashboard from './dashboards/MarketingDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const RoleBasedDashboard = ({ user, activeSection, setActiveSection, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);

  const dashboardConfig = getDashboardConfig(user.role);
  const navigation = getRoleNavigation(user.role);

  useEffect(() => {
    // Définir la section par défaut selon le rôle
    if (navigation.length > 0 && !activeSection) {
      setActiveSection(navigation[0].id);
    }
    setIsLoading(false);
  }, [user.role, navigation, activeSection, setActiveSection]);

  // Fonction pour rendre le bon composant de dashboard selon le rôle
  const renderDashboardContent = () => {
    const commonProps = { user, activeSection, setActiveSection };

    // Si c'est un rôle admin traditionnel, retourner null pour utiliser l'interface admin existante
    if (isAdminRole(user.role)) {
      return null;
    }

    switch (user.role) {
      case 'developer_frontend':
      case 'developer_backend':
      case 'developer_fullstack':
        return <DeveloperDashboard {...commonProps} />;
      
      case 'designer_ux':
      case 'designer_ui':
        return <DesignerDashboard {...commonProps} />;
      
      case 'commercial':
        return <CommercialDashboard {...commonProps} />;
      
      case 'marketing':
        return <MarketingDashboard {...commonProps} />;
      
      default:
        return <DeveloperDashboard {...commonProps} />;
    }
  };

  const dashboardContent = renderDashboardContent();

  // Si c'est un rôle admin, retourner null pour laisser l'interface admin existante
  if (!dashboardContent) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#64748b', margin: 0 }}>Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  // Composant de sidebar adapté au rôle
  const RoleSidebar = () => (
    <div style={{
      width: 280,
      backgroundColor: dashboardConfig.color,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10
    }}>
      {/* Header du dashboard */}
      <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{dashboardConfig.icon}</span>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            {dashboardConfig.name}
          </h2>
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          {user.name || user.email}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 16 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navigation.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 14,
                    textAlign: 'left',
                    borderRadius: 8,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer avec déconnexion */}
      <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'white',
            cursor: 'pointer',
            fontSize: 14,
            textAlign: 'left',
            borderRadius: 8,
            opacity: 0.8,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.opacity = '0.8';
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <RoleSidebar />
      <div style={{
        flex: 1,
        marginLeft: 280,
        backgroundColor: '#f8fafc',
        overflow: 'auto'
      }}>
        {dashboardContent}
      </div>
    </div>
  );
};

export default RoleBasedDashboard;
