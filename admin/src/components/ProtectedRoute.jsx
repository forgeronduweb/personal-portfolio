import React, { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, token, onLogout }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        // Vérifier la validité du token avec le backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Vérifier que l'utilisateur a les permissions admin
          if (data.user && ['admin', 'moderator', 'developer_frontend', 'developer_backend', 'developer_fullstack', 'designer_ux', 'designer_ui', 'graphiste', 'commercial', 'chef_projet', 'community_manager', 'marketing', 'support', 'finance'].includes(data.user.role)) {
            setIsValid(true);
          } else {
            setIsValid(false);
            onLogout();
          }
        } else {
          setIsValid(false);
          onLogout();
        }
      } catch (error) {
        console.error('Erreur de validation du token:', error);
        setIsValid(false);
        onLogout();
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, onLogout]);

  if (isValidating) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: 40
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            color: '#64748b',
            fontSize: 14,
            margin: 0
          }}>
            Vérification de l'accès...
          </p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: 40,
          backgroundColor: 'white',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          maxWidth: 400
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 24
          }}>
            🔒
          </div>
          <h2 style={{
            margin: '0 0 12px 0',
            fontSize: 20,
            fontWeight: 600,
            color: '#dc2626'
          }}>
            Accès non autorisé
          </h2>
          <p style={{
            margin: '0 0 20px 0',
            color: '#64748b',
            lineHeight: 1.5
          }}>
            Vous devez être connecté avec un compte autorisé pour accéder à cette interface.
          </p>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
