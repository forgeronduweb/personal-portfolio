import { useEffect, useCallback } from 'react';
import { RouteProtection } from '../utils/security';

// Hook pour la protection des routes
export const useRouteProtection = (currentPath, userRole = null) => {
  useEffect(() => {
    RouteProtection.checkRouteAccess(currentPath, userRole);
  }, [currentPath, userRole]);
};

// Hook pour la gestion sécurisée des tokens
export const useSecureAuth = () => {
  const setToken = useCallback((token) => {
    RouteProtection.setSecureToken(token);
  }, []);

  const getToken = useCallback(() => {
    return RouteProtection.getSecureToken();
  }, []);

  const clearAuth = useCallback(() => {
    RouteProtection.clearSecureData();
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!RouteProtection.getSecureToken();
  }, []);

  return {
    setToken,
    getToken,
    clearAuth,
    isAuthenticated
  };
};

// Hook pour la détection des DevTools (version React)
export const useDevToolsDetection = (onDetected) => {
  useEffect(() => {
    let isOpen = false;
    
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!isOpen) {
          isOpen = true;
          onDetected?.();
        }
      } else {
        isOpen = false;
      }
    };

    const interval = setInterval(detectDevTools, 1000);
    
    return () => clearInterval(interval);
  }, [onDetected]);
};
