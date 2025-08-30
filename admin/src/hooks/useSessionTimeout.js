import { useEffect, useRef, useState } from 'react';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes en millisecondes
const WARNING_TIME = 5 * 60 * 1000; // Avertissement 5 minutes avant expiration

export const useSessionTimeout = (onLogout, isAuthenticated) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Réinitialiser le timer d'activité
  const resetTimer = () => {
    if (!isAuthenticated) return;
    
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    
    // Nettoyer les anciens timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Timer d'avertissement
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(WARNING_TIME / 1000);
      
      // Décompte pour l'avertissement
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);
    
    // Timer de déconnexion automatique
    timeoutRef.current = setTimeout(() => {
      setShowWarning(false);
      onLogout();
    }, SESSION_TIMEOUT);
  };

  // Prolonger la session
  const extendSession = () => {
    resetTimer();
  };

  // Détecter l'activité utilisateur
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      const now = Date.now();
      // Éviter de réinitialiser trop souvent (max une fois par minute)
      if (now - lastActivityRef.current > 60000) {
        resetTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialiser le timer
    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, onLogout]);

  return {
    showWarning,
    timeLeft,
    extendSession
  };
};
