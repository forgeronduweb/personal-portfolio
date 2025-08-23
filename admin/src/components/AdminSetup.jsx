import React, { useState } from 'react';

// Configuration API - utilise localhost en développement, production en ligne
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'https://personal-portfolio-back.onrender.com';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_URL = getApiUrl();

const AdminSetup = ({ onSetupComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    validationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      console.log('🔧 Setup admin - API URL:', API_URL);
      console.log('🔧 Setup admin - Data:', {
        name: formData.name,
        email: formData.email,
        validationCode: formData.validationCode
      });

      const response = await fetch(`${API_URL}/auth/setup-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          validationCode: formData.validationCode
        })
      });

      console.log('🔧 Setup response status:', response.status);
      console.log('🔧 Setup response ok:', response.ok);
      console.log('🔧 Setup response headers:', response.headers.get('content-type'));

      // Vérifier si la réponse est du JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log('🔧 Setup response is not JSON:', textResponse.substring(0, 200));
        throw new Error('Le serveur backend ne répond pas correctement. Vérifiez que l\'URL est correcte.');
      }

      const data = await response.json();
      console.log('🔧 Setup response data:', data);

      if (data.success) {
        // Sauvegarder le token
        localStorage.setItem('admin_token', data.data.token);
        
        // Informer le composant parent
        onSetupComplete(data.data.user);
      } else {
        setError(data.message || 'Erreur lors de la création du compte administrateur');
      }
    } catch (error) {
      console.error('Erreur setup admin:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Configuration Admin
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: 0
          }}>
            Créez votre compte administrateur avec le code de validation
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '5px'
            }}>
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Votre nom complet"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '5px'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="votre@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '5px'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '5px'
            }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '5px'
            }}>
              Code de validation
            </label>
            <input
              type="text"
              name="validationCode"
              value={formData.validationCode}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Entrez le code de validation"
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Création en cours...' : 'Créer le compte administrateur'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            textAlign: 'center'
          }}>
            🔒 Cette configuration n'est possible qu'une seule fois.<br/>
            Le code de validation vous a été fourni séparément.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
