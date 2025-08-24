import { useState } from 'react';

const TestSync = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const testAllEndpoints = async () => {
    setIsLoading(true);
    const results = {
      auth: null,
      analyze: null,
      sync: null,
      prospects: null
    };

    try {
      // Test 1: Vérifier l'authentification
      console.log('🔐 Test authentification...');
      const authTest = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      results.auth = {
        status: authTest.status,
        ok: authTest.ok,
        message: authTest.ok ? 'Authentification OK' : 'Erreur auth'
      };

      // Test 2: Analyser les données
      console.log('📊 Test analyse données...');
      const analyzeTest = await fetch(`${API_URL}/admin/marketing/analyze-existing-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const analyzeData = await analyzeTest.json();
      results.analyze = {
        status: analyzeTest.status,
        ok: analyzeTest.ok,
        data: analyzeData,
        message: analyzeTest.ok ? `${analyzeData.data?.summary?.potentialNewProspects || 0} prospects potentiels` : 'Erreur analyse'
      };

      // Test 3: Synchronisation (seulement si des prospects à sync)
      if (analyzeData.data?.summary?.potentialNewProspects > 0) {
        console.log('🔄 Test synchronisation...');
        const syncTest = await fetch(`${API_URL}/admin/marketing/sync-all-data`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const syncData = await syncTest.json();
        results.sync = {
          status: syncTest.status,
          ok: syncTest.ok,
          data: syncData,
          message: syncTest.ok ? `${syncData.stats?.total || 0} prospects créés` : 'Erreur sync'
        };
      } else {
        results.sync = {
          status: 200,
          ok: true,
          message: 'Aucun prospect à synchroniser'
        };
      }

      // Test 4: Récupération prospects
      console.log('👥 Test récupération prospects...');
      const prospectsTest = await fetch(`${API_URL}/admin/marketing/prospects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const prospectsData = await prospectsTest.json();
      results.prospects = {
        status: prospectsTest.status,
        ok: prospectsTest.ok,
        data: prospectsData,
        message: prospectsTest.ok ? `${prospectsData.data?.length || 0} prospects trouvés` : 'Erreur prospects'
      };

    } catch (error) {
      console.error('❌ Erreur test:', error);
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#0f172a' }}>
          🧪 Test de Synchronisation CRM
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
          Diagnostiquer les problèmes de synchronisation et de récupération des données
        </p>
      </div>

      <button
        onClick={testAllEndpoints}
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
          opacity: isLoading ? 0.5 : 1,
          marginBottom: '24px'
        }}
      >
        {isLoading ? '🔄 Test en cours...' : '🚀 Lancer les Tests'}
      </button>

      {testResults && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Test Authentification */}
          <div style={{
            padding: '16px',
            border: `1px solid ${testResults.auth?.ok ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            backgroundColor: testResults.auth?.ok ? '#f0fdf4' : '#fef2f2'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: testResults.auth?.ok ? '#15803d' : '#dc2626' }}>
              🔐 Authentification
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Status: {testResults.auth?.status} - {testResults.auth?.message}
            </p>
          </div>

          {/* Test Analyse */}
          <div style={{
            padding: '16px',
            border: `1px solid ${testResults.analyze?.ok ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            backgroundColor: testResults.analyze?.ok ? '#f0fdf4' : '#fef2f2'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: testResults.analyze?.ok ? '#15803d' : '#dc2626' }}>
              📊 Analyse des Données
            </h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              Status: {testResults.analyze?.status} - {testResults.analyze?.message}
            </p>
            {testResults.analyze?.data?.data && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                <p>Utilisateurs: {testResults.analyze.data.data.summary.totalUsers}</p>
                <p>Premium: {testResults.analyze.data.data.summary.premiumUsers}</p>
                <p>Demandes: {testResults.analyze.data.data.summary.siteRequests}</p>
                <p>Newsletter: {testResults.analyze.data.data.summary.newsletterSubscribers}</p>
              </div>
            )}
          </div>

          {/* Test Synchronisation */}
          <div style={{
            padding: '16px',
            border: `1px solid ${testResults.sync?.ok ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            backgroundColor: testResults.sync?.ok ? '#f0fdf4' : '#fef2f2'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: testResults.sync?.ok ? '#15803d' : '#dc2626' }}>
              🔄 Synchronisation
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Status: {testResults.sync?.status} - {testResults.sync?.message}
            </p>
            {testResults.sync?.data?.stats && (
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                <p>Site Requests: {testResults.sync.data.stats.fromSiteRequests}</p>
                <p>Premium Users: {testResults.sync.data.stats.fromPremiumUsers}</p>
                <p>Newsletters: {testResults.sync.data.stats.fromNewsletters}</p>
                <p>Total créés: {testResults.sync.data.stats.total}</p>
              </div>
            )}
          </div>

          {/* Test Prospects */}
          <div style={{
            padding: '16px',
            border: `1px solid ${testResults.prospects?.ok ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            backgroundColor: testResults.prospects?.ok ? '#f0fdf4' : '#fef2f2'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: testResults.prospects?.ok ? '#15803d' : '#dc2626' }}>
              👥 Récupération Prospects
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Status: {testResults.prospects?.status} - {testResults.prospects?.message}
            </p>
            {testResults.prospects?.data?.data && (
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                <p>Prospects dans la base: {testResults.prospects.data.data.length}</p>
                {testResults.prospects.data.data.slice(0, 3).map((prospect, i) => (
                  <p key={i}>• {prospect.email} - {prospect.status}</p>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              🔧 Actions Recommandées
            </h4>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              {!testResults.auth?.ok && (
                <p style={{ margin: '0 0 8px 0', color: '#dc2626' }}>
                  ❌ Problème d'authentification - Vérifiez votre token admin
                </p>
              )}
              {testResults.auth?.ok && !testResults.analyze?.ok && (
                <p style={{ margin: '0 0 8px 0', color: '#dc2626' }}>
                  ❌ Problème d'analyse - Vérifiez les routes marketing backend
                </p>
              )}
              {testResults.analyze?.ok && testResults.sync?.ok && testResults.prospects?.ok && (
                <p style={{ margin: '0 0 8px 0', color: '#15803d' }}>
                  ✅ Tout fonctionne ! Allez dans CRM pour voir vos prospects
                </p>
              )}
              {testResults.prospects?.data?.data?.length === 0 && (
                <p style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>
                  ⚠️ Aucun prospect trouvé - Lancez d'abord la synchronisation
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSync;
