import { useState, useEffect } from 'react';

const DataSync = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [error, setError] = useState('');

  // Configuration API
  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'https://personal-portfolio-back.onrender.com';
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  };

  const API_URL = getApiUrl();
  const token = localStorage.getItem('admin_token');

  // Analyser les données existantes
  const analyzeExistingData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/admin/marketing/analyze-existing-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse des données');
      }

      const result = await response.json();
      setAnalysisData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Synchroniser toutes les données
  const syncAllData = async () => {
    setIsLoading(true);
    setError('');
    setSyncStatus(null);
    
    try {
      const response = await fetch(`${API_URL}/admin/marketing/sync-all-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la synchronisation');
      }

      const result = await response.json();
      setSyncStatus(result);
      
      // Recharger l'analyse après synchronisation
      setTimeout(() => {
        analyzeExistingData();
        // Notifier les autres composants de recharger
        window.dispatchEvent(new CustomEvent('prospectsUpdated'));
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'analyse au montage du composant
  useEffect(() => {
    analyzeExistingData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#0f172a' }}>
          🔄 Synchronisation des Données Existantes
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
          Convertissez vos utilisateurs premium, demandes de devis et abonnés newsletter en prospects marketing
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ❌ {error}
        </div>
      )}

      {syncStatus && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#15803d', fontSize: '16px' }}>
            ✅ Synchronisation Réussie
          </h3>
          <p style={{ margin: '0 0 12px 0', color: '#166534' }}>
            {syncStatus.message}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>
                {syncStatus.stats?.fromSiteRequests || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Demandes de sites</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>
                {syncStatus.stats?.fromPremiumUsers || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Utilisateurs premium</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>
                {syncStatus.stats?.fromNewsletters || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Abonnés newsletter</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>
                {syncStatus.stats?.total || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Total créés</div>
            </div>
          </div>
        </div>
      )}

      {analysisData && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
            📊 Analyse de vos Données
          </h3>
          
          {/* Résumé général */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>
                {analysisData.summary.totalUsers}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Utilisateurs totaux</div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                💎 {analysisData.summary.premiumUsers} premium
              </div>
            </div>
            
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>
                {analysisData.summary.siteRequests}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Demandes de sites</div>
              <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>
                📈 {analysisData.siteRequests.conversionRate} conversion
              </div>
            </div>
            
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>
                {analysisData.summary.newsletterSubscribers}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Abonnés newsletter</div>
            </div>
            
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: analysisData.prospects.potentialNew > 0 ? '#ef4444' : '#10b981' }}>
                {analysisData.prospects.potentialNew}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Prospects à synchroniser</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                ✅ {analysisData.prospects.existing} déjà synchronisés
              </div>
            </div>
          </div>

          {/* Détails des demandes de sites */}
          {analysisData.siteRequests.totalQuoteValue > 0 && (
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                💰 Revenus Potentiels
              </h4>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                {analysisData.siteRequests.totalQuoteValue.toLocaleString()} XOF
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                Valeur totale des devis envoyés ({analysisData.siteRequests.withQuotes} devis)
              </div>
            </div>
          )}

          {/* Statuts des demandes */}
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              📋 Répartition des Demandes de Sites
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {Object.entries(analysisData.siteRequests.byStatus).map(([status, count]) => (
                <div key={status} style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{count}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                    {status === 'pending' ? '⏳ En attente' :
                     status === 'in_progress' ? '🔄 En cours' :
                     status === 'completed' ? '✅ Terminé' :
                     status === 'cancelled' ? '❌ Annulé' : status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={analyzeExistingData}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            color: '#374151',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            opacity: isLoading ? 0.5 : 1
          }}
        >
          {isLoading ? '🔄 Analyse...' : '🔍 Réanalyser les Données'}
        </button>

        {analysisData?.prospects.readyToSync && (
          <button
            onClick={syncAllData}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0f172a',
              border: '1px solid #0f172a',
              borderRadius: '8px',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              opacity: isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? '⏳ Synchronisation...' : `🚀 Synchroniser ${analysisData.prospects.potentialNew} Prospects`}
          </button>
        )}
      </div>

      {/* Guide d'utilisation */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
          💡 Comment ça fonctionne
        </h4>
        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>🎯 Classification automatique :</strong>
          </p>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
            <li><strong>Clients :</strong> Utilisateurs premium + demandes terminées</li>
            <li><strong>Négociation :</strong> Demandes avec devis en cours</li>
            <li><strong>Qualifiés :</strong> Demandes avec devis envoyé</li>
            <li><strong>Intéressés :</strong> Demandes en cours de traitement</li>
            <li><strong>Nouveaux :</strong> Abonnés newsletter et nouveaux prospects</li>
          </ul>
          <p style={{ margin: '0' }}>
            <strong>📈 Historique préservé :</strong> Toutes les interactions passées sont automatiquement ajoutées à l'historique de chaque prospect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataSync;
