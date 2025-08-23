import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSecureAuth } from '../hooks/useSecurity';

const SecurityContext = createContext();

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }) => {
  const [isSecurityActive, setIsSecurityActive] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('normal'); // 'low', 'normal', 'high'
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const { isAuthenticated } = useSecureAuth();

  useEffect(() => {
    // Activer la sécurité en production ou pour les utilisateurs authentifiés
    const shouldActivateSecurity = process.env.NODE_ENV === 'production' || isAuthenticated();
    setIsSecurityActive(shouldActivateSecurity);
  }, [isAuthenticated]);

  const value = {
    isSecurityActive,
    securityLevel,
    devToolsDetected,
    setSecurityLevel,
    setDevToolsDetected,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
