import React from 'react';

const SessionWarning = ({ timeLeft, onExtend, onLogout }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 32,
        maxWidth: 400,
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#fef3c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 24
        }}>
          ⏰
        </div>
        
        <h2 style={{
          margin: '0 0 12px 0',
          fontSize: 20,
          fontWeight: 600,
          color: '#0f172a'
        }}>
          Session expirée bientôt
        </h2>
        
        <p style={{
          margin: '0 0 20px 0',
          color: '#64748b',
          lineHeight: 1.5
        }}>
          Votre session va expirer dans <strong style={{ color: '#dc2626' }}>{formatTime(timeLeft)}</strong>.
          Voulez-vous prolonger votre session ?
        </p>
        
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center'
        }}>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
            }}
          >
            Se déconnecter
          </button>
          
          <button
            onClick={onExtend}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            Prolonger la session
          </button>
        </div>
        
        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#f8fafc',
          borderRadius: 6,
          fontSize: 12,
          color: '#64748b'
        }}>
          💡 Votre session sera automatiquement prolongée si vous restez actif
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;
