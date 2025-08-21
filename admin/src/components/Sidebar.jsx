const Sidebar = ({ activeSection, onSectionChange, onLogout, currentUser }) => {
  // Navigation basée sur les permissions de rôle
  const getNavigationForRole = (userRole) => {
    const baseNavigation = [
      { name: 'Dashboard', section: 'dashboard' }
    ];

    // Seuls les admins ont accès à toutes les sections
    if (userRole === 'admin') {
      return [
        ...baseNavigation,
        { name: 'Utilisateurs', section: 'users' },
        { name: 'Demandes de sites', section: 'site-requests' },
        { name: 'Projets', section: 'projects' },
        { name: 'Paiements', section: 'payments' },
        { name: 'Statistiques', section: 'stats' },
        { name: 'Paramètres', section: 'settings' }
      ];
    }

    // Modérateurs ont accès limité
    if (userRole === 'moderator') {
      return [
        ...baseNavigation,
        { name: 'Utilisateurs', section: 'users' },
        { name: 'Demandes de sites', section: 'site-requests' },
        { name: 'Projets', section: 'projects' }
      ];
    }

    // Autres rôles ont accès très limité
    return [
      ...baseNavigation,
      { name: 'Mes Projets', section: 'my-projects' },
      { name: 'Mon Profil', section: 'profile' }
    ];
  };

  const navigation = getNavigationForRole(currentUser?.role || 'user');

  return (
    <div style={{ width: 256, backgroundColor: '#000000', height: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ padding: 24, borderBottom: '1px solid #333333' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Admin</h2>
        {currentUser && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#888888' }}>
            {currentUser.email}
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: 16 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navigation.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <li key={item.name} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => onSectionChange(item.section)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: isActive ? '#333333' : 'transparent',
                    color: isActive ? '#ffffff' : '#888888',
                    cursor: 'pointer',
                    fontSize: 14,
                    textAlign: 'left',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#222222';
                      e.target.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#888888';
                    }
                  }}
                >
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ padding: 16, borderTop: '1px solid #333333' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#888888',
            cursor: 'pointer',
            fontSize: 14,
            textAlign: 'left',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#222222';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#888888';
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
