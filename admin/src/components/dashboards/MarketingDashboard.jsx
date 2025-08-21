import { useState, useEffect } from 'react';

const MarketingDashboard = ({ user, activeSection }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCampaigns([
        { id: 1, name: 'Portfolio Pro Launch', type: 'Email', status: 'active', budget: '€1,200', spent: '€850', conversions: 45, roi: 180 },
        { id: 2, name: 'Google Ads - Design', type: 'PPC', status: 'active', budget: '€800', spent: '€650', conversions: 28, roi: 220 },
        { id: 3, name: 'Social Media Boost', type: 'Social', status: 'completed', budget: '€500', spent: '€480', conversions: 35, roi: 150 },
        { id: 4, name: 'Content Marketing', type: 'Content', status: 'planning', budget: '€600', spent: '€0', conversions: 0, roi: 0 }
      ]);
      setAnalytics({
        websiteVisits: 15420,
        conversionRate: 3.2,
        avgOrderValue: 1850,
        totalRevenue: 45600,
        emailSubscribers: 2340,
        socialFollowers: 8920
      });
      setLeads([
        { id: 1, source: 'Google Ads', name: 'Marie Dubois', email: 'marie@example.com', score: 85, value: '€2,500', date: '2024-08-25' },
        { id: 2, source: 'Social Media', name: 'Pierre Martin', email: 'pierre@example.com', score: 72, value: '€1,800', date: '2024-08-24' },
        { id: 3, source: 'Email Campaign', name: 'Sophie Laurent', email: 'sophie@example.com', score: 90, value: '€3,200', date: '2024-08-23' },
        { id: 4, source: 'Organic Search', name: 'Jean Dupont', email: 'jean@example.com', score: 65, value: '€1,500', date: '2024-08-22' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#dbeafe', color: '#2563eb' };
      case 'completed': return { bg: '#f0fdf4', color: '#16a34a' };
      case 'planning': return { bg: '#f3e8ff', color: '#9333ea' };
      case 'paused': return { bg: '#fef3c7', color: '#d97706' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getLeadScoreColor = (score) => {
    if (score >= 80) return { bg: '#f0fdf4', color: '#16a34a' };
    if (score >= 60) return { bg: '#fef3c7', color: '#d97706' };
    return { bg: '#fef2f2', color: '#dc2626' };
  };

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'Email': return '📧';
      case 'PPC': return '🎯';
      case 'Social': return '📱';
      case 'Content': return '📝';
      default: return '📊';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'campagnes':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Campagnes Marketing
            </h2>
            <div style={{ display: 'grid', gap: 20 }}>
              {campaigns.map(campaign => {
                const statusStyle = getStatusColor(campaign.status);
                const budgetUsed = campaign.budget !== '€0' ? (parseFloat(campaign.spent.replace(/[€,]/g, '')) / parseFloat(campaign.budget.replace(/[€,]/g, ''))) * 100 : 0;
                
                return (
                  <div key={campaign.id} style={{
                    backgroundColor: 'white',
                    padding: 24,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{getCampaignIcon(campaign.type)}</span>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                            {campaign.name}
                          </h3>
                          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14 }}>
                            {campaign.type}
                          </p>
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginBottom: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6' }}>
                          {campaign.budget}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>Budget</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>
                          {campaign.spent}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>Dépensé</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>
                          {campaign.conversions}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>Conversions</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#8b5cf6' }}>
                          {campaign.roi}%
                        </div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>ROI</div>
                      </div>
                    </div>
                    
                    {campaign.budget !== '€0' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 14, color: '#6b7280' }}>Budget utilisé</span>
                          <span style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{Math.round(budgetUsed)}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: 8,
                          backgroundColor: '#f3f4f6',
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${budgetUsed}%`,
                            height: '100%',
                            backgroundColor: budgetUsed > 80 ? '#ef4444' : budgetUsed > 60 ? '#f59e0b' : '#10b981',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Analytics Marketing
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>👁️</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>
                    {analytics.websiteVisits?.toLocaleString()}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Visites site web</p>
                <div style={{ marginTop: 8, fontSize: 12, color: '#10b981' }}>+12% vs mois dernier</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>🎯</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                    {analytics.conversionRate}%
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Taux de conversion</p>
                <div style={{ marginTop: 8, fontSize: 12, color: '#10b981' }}>+0.8% vs mois dernier</div>
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
                    €{analytics.avgOrderValue?.toLocaleString()}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Panier moyen</p>
                <div style={{ marginTop: 8, fontSize: 12, color: '#10b981' }}>+€150 vs mois dernier</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>📈</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#8b5cf6' }}>
                    €{analytics.totalRevenue?.toLocaleString()}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Revenus totaux</p>
                <div style={{ marginTop: 8, fontSize: 12, color: '#10b981' }}>+€5,200 vs mois dernier</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>📧</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#06b6d4' }}>
                    {analytics.emailSubscribers?.toLocaleString()}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Abonnés email</p>
                <div style={{ marginTop: 8, fontSize: 12, color: '#10b981' }}>+180 ce mois</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>👥</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#ec4899' }}>
                    {analytics.socialFollowers?.toLocaleString()}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Followers sociaux</p>
                <div style={{ marginTop: 8, fontSize: 12, color: '#10b981' }}>+320 ce mois</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 12,
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                Performance par Canal
              </h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { channel: 'Google Ads', visits: 4520, conversions: 145, cost: '€850' },
                  { channel: 'Facebook Ads', visits: 3240, conversions: 98, cost: '€620' },
                  { channel: 'Email Marketing', visits: 2890, conversions: 156, cost: '€120' },
                  { channel: 'Organic Search', visits: 4770, conversions: 89, cost: '€0' }
                ].map((channel, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    padding: 16,
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    alignItems: 'center'
                  }}>
                    <div style={{ fontWeight: 500, color: '#1f2937' }}>{channel.channel}</div>
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>{channel.visits.toLocaleString()}</div>
                    <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{channel.conversions}</div>
                    <div style={{ textAlign: 'center', color: '#f59e0b', fontWeight: 600 }}>{channel.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'leads':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Leads Marketing
            </h2>
            <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr', padding: '16px 24px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#374151' }}>
                <div>Source</div>
                <div>Contact</div>
                <div>Score</div>
                <div>Valeur</div>
                <div>Date</div>
                <div>Actions</div>
              </div>
              {leads.map(lead => {
                const scoreStyle = getLeadScoreColor(lead.score);
                return (
                  <div key={lead.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>{lead.source}</div>
                    <div>
                      <div style={{ fontWeight: 500, color: '#1f2937' }}>{lead.name}</div>
                      <div style={{ color: '#6b7280', fontSize: 12 }}>{lead.email}</div>
                    </div>
                    <div>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 500,
                        backgroundColor: scoreStyle.bg,
                        color: scoreStyle.color
                      }}>
                        {lead.score}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#059669' }}>{lead.value}</div>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>{lead.date}</div>
                    <div>
                      <button style={{
                        padding: '4px 8px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer'
                      }}>
                        Contacter
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'actions':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Actions Marketing
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                  Campagnes
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { name: 'Nouvelle Campagne', icon: '🚀', color: '#3b82f6' },
                    { name: 'A/B Test Email', icon: '🧪', color: '#10b981' },
                    { name: 'Optimiser SEO', icon: '🔍', color: '#f59e0b' },
                    { name: 'Landing Page', icon: '📄', color: '#8b5cf6' }
                  ].map((action, index) => (
                    <button key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
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

              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                  Outils d'Analyse
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { name: 'Google Analytics', icon: '📊', desc: 'Trafic et conversions' },
                    { name: 'Heatmaps', icon: '🔥', desc: 'Comportement utilisateur' },
                    { name: 'Keyword Research', icon: '🔑', desc: 'Recherche de mots-clés' },
                    { name: 'Competitor Analysis', icon: '🎯', desc: 'Analyse concurrentielle' }
                  ].map((tool, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}>
                      <span style={{ fontSize: 16 }}>{tool.icon}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: '#1f2937', fontSize: 14 }}>{tool.name}</div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>{tool.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Tableau de bord Marketing
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>🎯</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>
                    {campaigns.filter(c => c.status === 'active').length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Campagnes actives</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>👥</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                    {leads.length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Nouveaux leads</p>
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
                    {Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.filter(c => c.roi > 0).length)}%
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>ROI moyen</p>
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
          borderTop: '3px solid #8b5cf6',
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

export default MarketingDashboard;
