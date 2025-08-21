// Configuration des rôles et permissions
export const ROLES = {
  CLIENT: 'client',
  DEVELOPER_FRONTEND: 'developer_frontend',
  DEVELOPER_BACKEND: 'developer_backend',
  DEVELOPER_FULLSTACK: 'developer_fullstack',
  DESIGNER_UX: 'designer_ux',
  DESIGNER_UI: 'designer_ui',
  GRAPHISTE: 'graphiste',
  COMMERCIAL: 'commercial',
  CHEF_PROJET: 'chef_projet',
  COMMUNITY_MANAGER: 'community_manager',
  MARKETING: 'marketing',
  SUPPORT: 'support',
  FINANCE: 'finance',
  ADMIN: 'admin'
};

// Configuration des dashboards par rôle
export const ROLE_DASHBOARDS = {
  [ROLES.CLIENT]: {
    name: 'Dashboard Client',
    icon: '👤',
    color: '#3b82f6',
    sections: ['mes-projets', 'mes-devis', 'mon-portfolio', 'support']
  },
  [ROLES.DEVELOPER_FRONTEND]: {
    name: 'Dashboard Développeur Frontend',
    icon: '💻',
    color: '#10b981',
    sections: ['tickets', 'documentation', 'versions', 'logs', 'monitoring']
  },
  [ROLES.DEVELOPER_BACKEND]: {
    name: 'Dashboard Développeur Backend',
    icon: '⚙️',
    color: '#10b981',
    sections: ['tickets', 'api-docs', 'database', 'logs', 'monitoring']
  },
  [ROLES.DEVELOPER_FULLSTACK]: {
    name: 'Dashboard Développeur Fullstack',
    icon: '🔧',
    color: '#10b981',
    sections: ['tickets', 'documentation', 'versions', 'database', 'logs', 'monitoring']
  },
  [ROLES.DESIGNER_UX]: {
    name: 'Dashboard UX Designer',
    icon: '🎨',
    color: '#8b5cf6',
    sections: ['maquettes', 'wireframes', 'user-research', 'prototypes']
  },
  [ROLES.DESIGNER_UI]: {
    name: 'Dashboard UI Designer',
    icon: '🎭',
    color: '#8b5cf6',
    sections: ['maquettes', 'templates', 'design-system', 'previsualisations']
  },
  [ROLES.GRAPHISTE]: {
    name: 'Dashboard Graphiste',
    icon: '🖼️',
    color: '#f59e0b',
    sections: ['visuels', 'librairie-media', 'projets-clients', 'assets']
  },
  [ROLES.COMMERCIAL]: {
    name: 'Dashboard Commercial',
    icon: '📈',
    color: '#ef4444',
    sections: ['leads', 'devis', 'conversions', 'relances', 'pipeline']
  },
  [ROLES.CHEF_PROJET]: {
    name: 'Dashboard Chef de Projet',
    icon: '📋',
    color: '#06b6d4',
    sections: ['projets-actifs', 'attribution-taches', 'deadlines', 'equipes', 'planning']
  },
  [ROLES.COMMUNITY_MANAGER]: {
    name: 'Dashboard Community Manager',
    icon: '📱',
    color: '#ec4899',
    sections: ['publications', 'newsletters', 'engagement', 'calendrier-editorial']
  },
  [ROLES.MARKETING]: {
    name: 'Dashboard Marketing',
    icon: '📊',
    color: '#f97316',
    sections: ['analytics', 'campagnes', 'seo', 'conversions', 'trafic']
  },
  [ROLES.SUPPORT]: {
    name: 'Dashboard Support',
    icon: '🎧',
    color: '#84cc16',
    sections: ['tickets-clients', 'chat', 'faq', 'satisfaction', 'base-connaissances']
  },
  [ROLES.FINANCE]: {
    name: 'Dashboard Finance',
    icon: '💰',
    color: '#eab308',
    sections: ['paiements', 'abonnements', 'factures', 'remboursements', 'comptabilite']
  },
  [ROLES.ADMIN]: {
    name: 'Dashboard Administrateur',
    icon: '👑',
    color: '#6366f1',
    sections: ['vue-globale', 'utilisateurs', 'collaborateurs', 'parametrage', 'statistiques']
  }
};

// Navigation par section pour chaque rôle
export const ROLE_NAVIGATION = {
  [ROLES.CLIENT]: [
    { id: 'mes-projets', name: 'Mes Projets', icon: '📁' },
    { id: 'mes-devis', name: 'Mes Devis', icon: '📄' },
    { id: 'mon-portfolio', name: 'Mon Portfolio', icon: '🌐' },
    { id: 'support', name: 'Support', icon: '💬' }
  ],
  [ROLES.DEVELOPER_FRONTEND]: [
    { id: 'tickets', name: 'Tickets', icon: '🐛' },
    { id: 'documentation', name: 'Documentation', icon: '📚' },
    { id: 'versions', name: 'Versions', icon: '🔄' },
    { id: 'logs', name: 'Logs', icon: '📝' },
    { id: 'monitoring', name: 'Monitoring', icon: '📡' }
  ],
  [ROLES.DEVELOPER_BACKEND]: [
    { id: 'tickets', name: 'Tickets', icon: '🐛' },
    { id: 'api-docs', name: 'API Docs', icon: '📋' },
    { id: 'database', name: 'Base de données', icon: '🗄️' },
    { id: 'logs', name: 'Logs', icon: '📝' },
    { id: 'monitoring', name: 'Monitoring', icon: '📡' }
  ],
  [ROLES.DEVELOPER_FULLSTACK]: [
    { id: 'tickets', name: 'Tickets', icon: '🐛' },
    { id: 'documentation', name: 'Documentation', icon: '📚' },
    { id: 'versions', name: 'Versions', icon: '🔄' },
    { id: 'database', name: 'Base de données', icon: '🗄️' },
    { id: 'logs', name: 'Logs', icon: '📝' },
    { id: 'monitoring', name: 'Monitoring', icon: '📡' }
  ],
  [ROLES.DESIGNER_UX]: [
    { id: 'maquettes', name: 'Maquettes', icon: '🎨' },
    { id: 'wireframes', name: 'Wireframes', icon: '📐' },
    { id: 'user-research', name: 'User Research', icon: '🔍' },
    { id: 'prototypes', name: 'Prototypes', icon: '🖼️' }
  ],
  [ROLES.DESIGNER_UI]: [
    { id: 'maquettes', name: 'Maquettes', icon: '🎨' },
    { id: 'templates', name: 'Templates', icon: '📄' },
    { id: 'design-system', name: 'Design System', icon: '🎭' },
    { id: 'previsualisations', name: 'Prévisualisations', icon: '👁️' }
  ],
  [ROLES.GRAPHISTE]: [
    { id: 'visuels', name: 'Visuels', icon: '🖼️' },
    { id: 'librairie-media', name: 'Librairie Média', icon: '📚' },
    { id: 'projets-clients', name: 'Projets Clients', icon: '👥' },
    { id: 'assets', name: 'Assets', icon: '🎯' }
  ],
  [ROLES.COMMERCIAL]: [
    { id: 'leads', name: 'Leads', icon: '🎯' },
    { id: 'devis', name: 'Devis', icon: '📄' },
    { id: 'conversions', name: 'Conversions', icon: '📈' },
    { id: 'relances', name: 'Relances', icon: '📞' },
    { id: 'pipeline', name: 'Pipeline', icon: '🔄' }
  ],
  [ROLES.CHEF_PROJET]: [
    { id: 'projets-actifs', name: 'Projets Actifs', icon: '📋' },
    { id: 'attribution-taches', name: 'Attribution Tâches', icon: '👥' },
    { id: 'deadlines', name: 'Deadlines', icon: '⏰' },
    { id: 'equipes', name: 'Équipes', icon: '👨‍💼' },
    { id: 'planning', name: 'Planning', icon: '📅' }
  ],
  [ROLES.COMMUNITY_MANAGER]: [
    { id: 'publications', name: 'Publications', icon: '📱' },
    { id: 'newsletters', name: 'Newsletters', icon: '📧' },
    { id: 'engagement', name: 'Engagement', icon: '❤️' },
    { id: 'calendrier-editorial', name: 'Calendrier Éditorial', icon: '📅' }
  ],
  [ROLES.MARKETING]: [
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'campagnes', name: 'Campagnes', icon: '🎯' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'conversions', name: 'Conversions', icon: '📈' },
    { id: 'trafic', name: 'Trafic', icon: '🚦' }
  ],
  [ROLES.SUPPORT]: [
    { id: 'tickets-clients', name: 'Tickets Clients', icon: '🎧' },
    { id: 'chat', name: 'Chat en Direct', icon: '💬' },
    { id: 'faq', name: 'FAQ', icon: '❓' },
    { id: 'satisfaction', name: 'Satisfaction', icon: '⭐' },
    { id: 'base-connaissances', name: 'Base de Connaissances', icon: '📚' }
  ],
  [ROLES.FINANCE]: [
    { id: 'paiements', name: 'Paiements', icon: '💳' },
    { id: 'abonnements', name: 'Abonnements', icon: '🔄' },
    { id: 'factures', name: 'Factures', icon: '📄' },
    { id: 'remboursements', name: 'Remboursements', icon: '↩️' },
    { id: 'comptabilite', name: 'Comptabilité', icon: '📊' }
  ],
  [ROLES.ADMIN]: [
    { id: 'vue-globale', name: 'Vue Globale', icon: '🌍' },
    { id: 'utilisateurs', name: 'Utilisateurs', icon: '👥' },
    { id: 'collaborateurs', name: 'Collaborateurs', icon: '👨‍💼' },
    { id: 'parametrage', name: 'Paramétrage', icon: '⚙️' },
    { id: 'statistiques', name: 'Statistiques', icon: '📈' }
  ]
};

// Permissions par rôle
export const ROLE_PERMISSIONS = {
  [ROLES.CLIENT]: ['view_own_projects', 'view_own_quotes', 'create_support_ticket'],
  [ROLES.DEVELOPER_FRONTEND]: ['view_tickets', 'update_tickets', 'view_docs', 'manage_versions'],
  [ROLES.DEVELOPER_BACKEND]: ['view_tickets', 'update_tickets', 'view_api_docs', 'manage_database'],
  [ROLES.DEVELOPER_FULLSTACK]: ['view_tickets', 'update_tickets', 'view_docs', 'manage_versions', 'manage_database'],
  [ROLES.DESIGNER_UX]: ['upload_mockups', 'manage_wireframes', 'view_user_research'],
  [ROLES.DESIGNER_UI]: ['upload_mockups', 'manage_templates', 'manage_design_system'],
  [ROLES.GRAPHISTE]: ['upload_visuals', 'manage_media_library', 'assign_content_to_projects'],
  [ROLES.COMMERCIAL]: ['view_leads', 'manage_quotes', 'view_conversions', 'send_follow_ups'],
  [ROLES.CHEF_PROJET]: ['manage_projects', 'assign_tasks', 'view_deadlines', 'manage_teams'],
  [ROLES.COMMUNITY_MANAGER]: ['manage_publications', 'send_newsletters', 'view_engagement'],
  [ROLES.MARKETING]: ['view_analytics', 'manage_campaigns', 'view_seo', 'view_traffic'],
  [ROLES.SUPPORT]: ['view_client_tickets', 'manage_chat', 'manage_faq', 'view_satisfaction'],
  [ROLES.FINANCE]: ['manage_payments', 'manage_subscriptions', 'manage_invoices', 'manage_refunds'],
  [ROLES.ADMIN]: ['manage_all', 'view_all', 'create_users', 'manage_settings']
};

// Fonction utilitaire pour vérifier les permissions
export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission) || permissions.includes('manage_all');
};

// Fonction pour obtenir la configuration du dashboard d'un rôle
export const getDashboardConfig = (role) => {
  return ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS[ROLES.CLIENT];
};

// Fonction pour obtenir la navigation d'un rôle
export const getRoleNavigation = (role) => {
  return ROLE_NAVIGATION[role] || ROLE_NAVIGATION[ROLES.CLIENT];
};
