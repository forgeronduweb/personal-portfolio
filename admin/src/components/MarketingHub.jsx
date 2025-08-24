import { useState, useEffect } from 'react';
import Newsletter from './Newsletter';
import Automations from './marketing/Automations';
import CRM from './marketing/CRM';
import Promotions from './marketing/Promotions';
import MarketingStats from './marketing/MarketingStats';
import SocialMedia from './marketing/SocialMedia';
import DataSync from './marketing/DataSync';
import TestSync from './marketing/TestSync';

const MarketingHub = () => {
  const [activeSubSection, setActiveSubSection] = useState('newsletter');
  const [moduleConfig, setModuleConfig] = useState({
    newsletter: true,
    automations: true,
    crm: true,
    promotions: true,
    stats: true,
    social: false, // Désactivé par défaut
    dataSync: true,
    testSync: true
  });

  const subSections = [
    { 
      id: 'newsletter', 
      name: 'Newsletter & Emailing', 
      icon: '📧',
      enabled: moduleConfig.newsletter 
    },
    { 
      id: 'automations', 
      name: 'Automatisations', 
      icon: '⚡',
      enabled: moduleConfig.automations 
    },
    { 
      id: 'crm', 
      name: 'CRM & Prospects', 
      icon: '👥',
      enabled: moduleConfig.crm 
    },
    { 
      id: 'promotions', 
      name: 'Promotions & Offres', 
      icon: '🎯',
      enabled: moduleConfig.promotions 
    },
    { 
      id: 'stats', 
      name: 'Statistiques Marketing', 
      icon: '📊',
      enabled: moduleConfig.stats 
    },
    { 
      id: 'social', 
      name: 'Réseaux Sociaux', 
      icon: '📱',
      enabled: moduleConfig.social 
    },
    { 
      id: 'dataSync', 
      name: 'Sync Données', 
      icon: '🔄',
      enabled: moduleConfig.dataSync 
    },
    { 
      id: 'testSync', 
      name: 'Test Debug', 
      icon: '🧪',
      enabled: moduleConfig.testSync 
    }
  ].filter(section => section.enabled);

  const renderSubSection = () => {
    switch (activeSubSection) {
      case 'newsletter':
        return <Newsletter />;
      case 'automations':
        return <Automations />;
      case 'crm':
        return <CRM />;
      case 'promotions':
        return <Promotions />;
      case 'stats':
        return <MarketingStats />;
      case 'social':
        return <SocialMedia />;
      case 'dataSync':
        return <DataSync />;
      case 'testSync':
        return <TestSync />;
      default:
        return <Newsletter />;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header fixe */}
      <div style={{
        position: 'fixed',
        top: 64,
        left: 256,
        right: 0,
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 20,
        padding: '16px 24px'
      }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#0f172a' }}>
          📧 Marketing Hub
        </h1>
        
        {/* Navigation sous-sections */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 16,
          flexWrap: 'wrap'
        }}>
          {subSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSubSection(section.id)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 8,
                backgroundColor: activeSubSection === section.id ? '#000000' : '#ffffff',
                color: activeSubSection === section.id ? '#ffffff' : '#374151',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeSubSection !== section.id) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSubSection !== section.id) {
                  e.target.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <span>{section.icon}</span>
              {section.name}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu avec padding pour le header fixe */}
      <div style={{
        flex: 1,
        marginTop: 120,
        padding: '0 24px 24px 24px',
        overflow: 'auto'
      }}>
        {renderSubSection()}
      </div>
    </div>
  );
};

export default MarketingHub;
