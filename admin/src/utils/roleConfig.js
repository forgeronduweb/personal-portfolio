// Configuration des rôles et dashboards pour l'interface admin
export const ROLES = {
  // Rôles clients
  CLIENT: 'client',
  
  // Rôles développeurs
  DEVELOPER_FRONTEND: 'developer_frontend',
  DEVELOPER_BACKEND: 'developer_backend', 
  DEVELOPER_FULLSTACK: 'developer_fullstack',
  
  // Rôles design
  DESIGNER_UX: 'designer_ux',
  DESIGNER_UI: 'designer_ui',
  GRAPHISTE: 'graphiste',
  
  // Rôles business
  COMMERCIAL: 'commercial',
  CHEF_PROJET: 'chef_projet',
  COMMUNITY_MANAGER: 'community_manager',
  MARKETING: 'marketing',
  SUPPORT: 'support',
  FINANCE: 'finance',
  
  // Rôles admin
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Configuration des dashboards par rôle
export const ROLE_DASHBOARDS = {
  [ROLES.CLIENT]: {
    name: 'Dashboard Client',
    icon: '👤',
    color: '#3b82f6',
    sections: ['dashboard', 'mes-projets', 'mes-devis', 'mon-portfolio', 'support']
  },
  
  [ROLES.DEVELOPER_FRONTEND]: {
    name: 'Dashboard Développeur Frontend', 
    icon: '💻',
    color: '#10b981',
    sections: ['dashboard', 'tickets', 'projets', 'code', 'planning']
  },
  
  [ROLES.DEVELOPER_BACKEND]: {
    name: 'Dashboard Développeur Backend',
    icon: '⚙️', 
    color: '#10b981',
    sections: ['dashboard', 'tickets', 'projets', 'code', 'planning']
  },
  
  [ROLES.DEVELOPER_FULLSTACK]: {
    name: 'Dashboard Développeur Fullstack',
    icon: '🚀',
    color: '#10b981', 
    sections: ['dashboard', 'tickets', 'projets', 'code', 'planning']
  },
  
  [ROLES.DESIGNER_UX]: {
    name: 'Dashboard Designer UX',
    icon: '🎨',
    color: '#8b5cf6',
    sections: ['dashboard', 'mes-designs', 'projets', 'bibliotheque', 'outils']
  },
  
  [ROLES.DESIGNER_UI]: {
    name: 'Dashboard Designer UI',
    icon: '🎭',
    color: '#8b5cf6',
    sections: ['dashboard', 'mes-designs', 'projets', 'bibliotheque', 'outils']
  },
  
  [ROLES.GRAPHISTE]: {
    name: 'Dashboard Graphiste',
    icon: '🖼️',
    color: '#f59e0b',
    sections: ['dashboard', 'mediatheque', 'projets']
  },
  
  [ROLES.COMMERCIAL]: {
    name: 'Dashboard Commercial',
    icon: '💼',
    color: '#059669',
    sections: ['dashboard', 'leads', 'pipeline', 'objectifs']
  },
  
  [ROLES.CHEF_PROJET]: {
    name: 'Dashboard Chef de Projet',
    icon: '📋',
    color: '#3b82f6',
    sections: ['dashboard', 'projets', 'equipe', 'taches', 'planning']
  },
  
  [ROLES.COMMUNITY_MANAGER]: {
    name: 'Dashboard Community Manager',
    icon: '📱',
    color: '#8b5cf6',
    sections: ['dashboard', 'reseaux-sociaux', 'publications', 'campagnes']
  },
  
  [ROLES.MARKETING]: {
    name: 'Dashboard Marketing',
    icon: '📊',
    color: '#f59e0b',
    sections: ['dashboard', 'campagnes', 'analytics', 'leads']
  },
  
  [ROLES.SUPPORT]: {
    name: 'Dashboard Support',
    icon: '🎧',
    color: '#3b82f6',
    sections: ['dashboard', 'tickets', 'base-connaissance', 'statistiques']
  },
  
  [ROLES.FINANCE]: {
    name: 'Dashboard Finance',
    icon: '💰',
    color: '#10b981',
    sections: ['dashboard', 'factures', 'depenses', 'rapports']
  },
  
  [ROLES.ADMIN]: {
    name: 'Dashboard Administrateur',
    icon: '⚡',
    color: '#dc2626',
    sections: ['dashboard', 'utilisateurs', 'systeme', 'analytics']
  },
  
  [ROLES.MODERATOR]: {
    name: 'Dashboard Modérateur',
    icon: '🛡️',
    color: '#7c3aed',
    sections: ['dashboard', 'utilisateurs', 'moderation']
  }
};

// Navigation par rôle
export const ROLE_NAVIGATION = {
  [ROLES.CLIENT]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'mes-projets', name: 'Mes Projets', icon: '📁' },
    { id: 'mes-devis', name: 'Mes Devis', icon: '📄' },
    { id: 'mon-portfolio', name: 'Mon Portfolio', icon: '🎨' },
    { id: 'support', name: 'Support', icon: '🎧' }
  ],
  
  [ROLES.DEVELOPER_FRONTEND]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'tickets', name: 'Mes Tickets', icon: '🎫' },
    { id: 'projets', name: 'Projets', icon: '📁' },
    { id: 'code', name: 'Code & Git', icon: '💻' },
    { id: 'planning', name: 'Planning', icon: '📅' }
  ],
  
  [ROLES.DEVELOPER_BACKEND]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'tickets', name: 'Mes Tickets', icon: '🎫' },
    { id: 'projets', name: 'Projets', icon: '📁' },
    { id: 'code', name: 'Code & Git', icon: '⚙️' },
    { id: 'planning', name: 'Planning', icon: '📅' }
  ],
  
  [ROLES.DEVELOPER_FULLSTACK]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'tickets', name: 'Mes Tickets', icon: '🎫' },
    { id: 'projets', name: 'Projets', icon: '📁' },
    { id: 'code', name: 'Code & Git', icon: '🚀' },
    { id: 'planning', name: 'Planning', icon: '📅' }
  ],
  
  [ROLES.DESIGNER_UX]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'mes-designs', name: 'Mes Designs', icon: '🎨' },
    { id: 'projets', name: 'Projets', icon: '📁' },
    { id: 'bibliotheque', name: 'Bibliothèque', icon: '📚' },
    { id: 'outils', name: 'Outils', icon: '🛠️' }
  ],
  
  [ROLES.DESIGNER_UI]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'mes-designs', name: 'Mes Designs', icon: '🎭' },
    { id: 'projets', name: 'Projets', icon: '📁' },
    { id: 'bibliotheque', name: 'Bibliothèque', icon: '📚' },
    { id: 'outils', name: 'Outils', icon: '🛠️' }
  ],
  
  [ROLES.GRAPHISTE]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'mediatheque', name: 'Médiathèque', icon: '🖼️' },
    { id: 'projets', name: 'Projets', icon: '📁' }
  ],
  
  [ROLES.COMMERCIAL]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'leads', name: 'Leads', icon: '👥' },
    { id: 'pipeline', name: 'Pipeline', icon: '🔄' },
    { id: 'objectifs', name: 'Objectifs', icon: '🎯' }
  ],
  
  [ROLES.CHEF_PROJET]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'projets', name: 'Projets', icon: '📁' },
    { id: 'equipe', name: 'Équipe', icon: '👥' },
    { id: 'taches', name: 'Tâches', icon: '✅' },
    { id: 'planning', name: 'Planning', icon: '📅' }
  ],
  
  [ROLES.COMMUNITY_MANAGER]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'reseaux-sociaux', name: 'Réseaux Sociaux', icon: '📱' },
    { id: 'publications', name: 'Publications', icon: '✍️' },
    { id: 'campagnes', name: 'Campagnes', icon: '🚀' }
  ],
  
  [ROLES.MARKETING]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'campagnes', name: 'Campagnes', icon: '🚀' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'leads', name: 'Leads', icon: '👥' }
  ],
  
  [ROLES.SUPPORT]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'tickets', name: 'Tickets', icon: '🎫' },
    { id: 'base-connaissance', name: 'Base de Connaissance', icon: '📚' },
    { id: 'statistiques', name: 'Statistiques', icon: '📈' }
  ],
  
  [ROLES.FINANCE]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'factures', name: 'Factures', icon: '📄' },
    { id: 'depenses', name: 'Dépenses', icon: '💸' },
    { id: 'rapports', name: 'Rapports', icon: '📋' }
  ],
  
  [ROLES.ADMIN]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'utilisateurs', name: 'Utilisateurs', icon: '👥' },
    { id: 'systeme', name: 'Système', icon: '⚙️' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ],
  
  [ROLES.MODERATOR]: [
    { id: 'dashboard', name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'utilisateurs', name: 'Utilisateurs', icon: '👥' },
    { id: 'moderation', name: 'Modération', icon: '🛡️' }
  ]
};

// Permissions par rôle
export const ROLE_PERMISSIONS = {
  [ROLES.CLIENT]: ['view_own_projects', 'view_own_quotes', 'create_support_ticket'],
  [ROLES.DEVELOPER_FRONTEND]: ['view_assigned_tickets', 'update_code', 'view_projects'],
  [ROLES.DEVELOPER_BACKEND]: ['view_assigned_tickets', 'update_code', 'view_projects', 'manage_database'],
  [ROLES.DEVELOPER_FULLSTACK]: ['view_assigned_tickets', 'update_code', 'view_projects', 'manage_database'],
  [ROLES.DESIGNER_UX]: ['create_designs', 'view_projects', 'manage_assets'],
  [ROLES.DESIGNER_UI]: ['create_designs', 'view_projects', 'manage_assets'],
  [ROLES.GRAPHISTE]: ['create_media', 'manage_assets'],
  [ROLES.COMMERCIAL]: ['manage_leads', 'view_pipeline', 'create_quotes'],
  [ROLES.CHEF_PROJET]: ['manage_projects', 'assign_tasks', 'view_team'],
  [ROLES.COMMUNITY_MANAGER]: ['manage_social_media', 'create_content'],
  [ROLES.MARKETING]: ['manage_campaigns', 'view_analytics'],
  [ROLES.SUPPORT]: ['manage_tickets', 'view_knowledge_base'],
  [ROLES.FINANCE]: ['manage_invoices', 'view_financials'],
  [ROLES.ADMIN]: ['manage_all', 'system_admin'],
  [ROLES.MODERATOR]: ['moderate_users', 'view_reports']
};

// Fonctions utilitaires
export function getDashboardConfig(userRole) {
  return ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS[ROLES.CLIENT];
}

export function getRoleNavigation(userRole) {
  return ROLE_NAVIGATION[userRole] || ROLE_NAVIGATION[ROLES.CLIENT];
}

export function hasPermission(userRole, permission) {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission) || permissions.includes('manage_all');
}

export function isAdminRole(userRole) {
  return userRole === ROLES.ADMIN || userRole === ROLES.MODERATOR;
}
