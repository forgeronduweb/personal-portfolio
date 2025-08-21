import { useState, useEffect } from 'react';

const CommercialDashboard = ({ user, activeSection }) => {
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [performance, setPerformance] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLeads([
        { id: 1, name: 'Marie Dubois', company: 'Tech Startup', status: 'hot', value: '€5,000', source: 'LinkedIn', date: '2024-08-25' },
        { id: 2, name: 'Pierre Martin', company: 'E-commerce Store', status: 'warm', value: '€3,200', source: 'Référence', date: '2024-08-24' },
        { id: 3, name: 'Sophie Laurent', company: 'Restaurant Chain', status: 'cold', value: '€8,500', source: 'Site web', date: '2024-08-23' },
        { id: 4, name: 'Jean Dupont', company: 'Consulting Firm', status: 'qualified', value: '€12,000', source: 'Email', date: '2024-08-22' }
      ]);
      setDeals([
        { id: 1, client: 'Tech Startup', project: 'App Mobile', value: '€15,000', stage: 'negotiation', probability: 80, closeDate: '2024-09-15' },
        { id: 2, client: 'E-commerce Store', project: 'Site Web', value: '€8,500', stage: 'proposal', probability: 60, closeDate: '2024-09-30' },
        { id: 3, client: 'Restaurant Chain', project: 'Système de commande', value: '€25,000', stage: 'discovery', probability: 30, closeDate: '2024-10-15' }
      ]);
      setPerformance({
        monthlyTarget: 50000,
        currentRevenue: 32500,
        leadsGenerated: 45,
        dealsWon: 8,
        conversionRate: 18
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const getLeadStatusColor = (status) => {
    switch (status) {
      case 'hot': return { bg: '#fef2f2', color: '#dc2626' };
      case 'warm': return { bg: '#fef3c7', color: '#d97706' };
      case 'cold': return { bg: '#dbeafe', color: '#2563eb' };
      case 'qualified': return { bg: '#f0fdf4', color: '#16a34a' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getDealStageColor = (stage) => {
    switch (stage) {
      case 'discovery': return { bg: '#dbeafe', color: '#2563eb' };
      case 'proposal': return { bg: '#fef3c7', color: '#d97706' };
      case 'negotiation': return { bg: '#f0fdf4', color: '#16a34a' };
      case 'closed': return { bg: '#f3e8ff', color: '#9333ea' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'leads':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Mes Leads
            </h2>
            <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', padding: '16px 24px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#374151' }}>
                <div>Contact</div>
                <div>Entreprise</div>
                <div>Statut</div>
                <div>Valeur</div>
                <div>Source</div>
                <div>Date</div>
              </div>
              {leads.map(lead => {
                const statusStyle = getLeadStatusColor(lead.status);
                return (
                  <div key={lead.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                    <div style={{ fontWeight: 500, color: '#1f2937' }}>{lead.name}</div>
                    <div style={{ color: '#6b7280' }}>{lead.company}</div>
                    <div>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 500,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {lead.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#059669' }}>{lead.value}</div>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>{lead.source}</div>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>{lead.date}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'deals':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Mes Deals
            </h2>
            <div style={{ display: 'grid', gap: 20 }}>
              {deals.map(deal => {
                const stageStyle = getDealStageColor(deal.stage);
                return (
                  <div key={deal.id} style={{
                    backgroundColor: 'white',
                    padding: 24,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                          {deal.project}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14 }}>
                          {deal.client} • Clôture prévue: {deal.closeDate}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#059669', marginBottom: 4 }}>
                          {deal.value}
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 500,
                          backgroundColor: stageStyle.bg,
                          color: stageStyle.color
                        }}>
                          {deal.stage}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, color: '#6b7280' }}>Probabilité de réussite</span>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{deal.probability}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: 8,
                        backgroundColor: '#f3f4f6',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${deal.probability}%`,
                          height: '100%',
                          backgroundColor: deal.probability > 70 ? '#10b981' : deal.probability > 40 ? '#f59e0b' : '#ef4444',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Performance Commerciale
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500, color: '#6b7280' }}>
                  Objectif Mensuel
                </h3>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6', marginBottom: 8 }}>
                  €{performance.monthlyTarget?.toLocaleString()}
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  Réalisé: €{performance.currentRevenue?.toLocaleString()} ({Math.round((performance.currentRevenue / performance.monthlyTarget) * 100)}%)
                </div>
                <div style={{
                  width: '100%',
                  height: 6,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 3,
                  marginTop: 8,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min((performance.currentRevenue / performance.monthlyTarget) * 100, 100)}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500, color: '#6b7280' }}>
                  Leads Générés
                </h3>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>
                  {performance.leadsGenerated}
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  Ce mois-ci
                </div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500, color: '#6b7280' }}>
                  Deals Gagnés
                </h3>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>
                  {performance.dealsWon}
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  Ce mois-ci
                </div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500, color: '#6b7280' }}>
                  Taux de Conversion
                </h3>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#8b5cf6' }}>
                  {performance.conversionRate}%
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  Lead → Deal
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 12,
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                Actions Rapides
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[
                  { name: 'Nouveau Lead', icon: '➕', color: '#3b82f6' },
                  { name: 'Planifier Appel', icon: '📞', color: '#10b981' },
                  { name: 'Envoyer Proposition', icon: '📧', color: '#f59e0b' },
                  { name: 'Mettre à jour Deal', icon: '✏️', color: '#8b5cf6' }
                ].map((action, index) => (
                  <button key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}>
                    <span style={{ fontSize: 16 }}>{action.icon}</span>
                    <span style={{ fontWeight: 500, color: '#1f2937', fontSize: 14 }}>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Tableau de bord Commercial
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>👥</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>
                    {leads.length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Leads actifs</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>💼</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                    {deals.length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Deals en cours</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>💰</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>
                    €{deals.reduce((sum, deal) => sum + parseInt(deal.value.replace(/[€,]/g, '')), 0).toLocaleString()}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Pipeline total</p>
              </div>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#6b7280', margin: 0 }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      {renderContent()}
    </div>
  );
};

export default CommercialDashboard;
