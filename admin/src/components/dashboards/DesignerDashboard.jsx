import { useState, useEffect } from 'react';

const DesignerDashboard = ({ user, activeSection }) => {
  const [designs, setDesigns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDesigns([
        { id: 1, name: 'Maquette Homepage', project: 'Portfolio Client A', status: 'completed', type: 'UI/UX', lastModified: '2024-08-25' },
        { id: 2, name: 'Design System', project: 'E-commerce B', status: 'in_progress', type: 'Design System', lastModified: '2024-08-24' },
        { id: 3, name: 'Logo & Branding', project: 'Startup C', status: 'review', type: 'Branding', lastModified: '2024-08-23' }
      ]);
      setProjects([
        { id: 1, name: 'Portfolio Client A', progress: 90, deadline: '2024-09-15', status: 'active', priority: 'high' },
        { id: 2, name: 'E-commerce B', progress: 65, deadline: '2024-10-01', status: 'active', priority: 'medium' },
        { id: 3, name: 'Startup C', progress: 40, deadline: '2024-10-20', status: 'planning', priority: 'low' }
      ]);
      setAssets([
        { id: 1, name: 'Icons Pack', type: 'Icons', size: '2.4 MB', downloads: 15 },
        { id: 2, name: 'Color Palette', type: 'Colors', size: '0.8 MB', downloads: 8 },
        { id: 3, name: 'Typography Guide', type: 'Fonts', size: '1.2 MB', downloads: 12 }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#f0fdf4', color: '#16a34a' };
      case 'in_progress': return { bg: '#dbeafe', color: '#2563eb' };
      case 'review': return { bg: '#fef3c7', color: '#d97706' };
      case 'active': return { bg: '#dbeafe', color: '#2563eb' };
      case 'planning': return { bg: '#f3e8ff', color: '#9333ea' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#fef2f2', color: '#dc2626' };
      case 'medium': return { bg: '#fef3c7', color: '#d97706' };
      case 'low': return { bg: '#f0fdf4', color: '#16a34a' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'designs':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Mes Designs
            </h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {designs.map(design => {
                const statusStyle = getStatusColor(design.status);
                return (
                  <div key={design.id} style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1f2937' }}>
                          {design.name}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14 }}>
                          {design.project} • {design.type}
                        </p>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {design.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: 12 }}>
                      Modifié le {design.lastModified}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'projets':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Mes Projets
            </h2>
            <div style={{ display: 'grid', gap: 20 }}>
              {projects.map(project => {
                const statusStyle = getStatusColor(project.status);
                const priorityStyle = getPriorityColor(project.priority);
                return (
                  <div key={project.id} style={{
                    backgroundColor: 'white',
                    padding: 24,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                          {project.name}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 14 }}>
                          Échéance: {project.deadline}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 500,
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.color
                        }}>
                          {project.priority}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 500,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color
                        }}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, color: '#6b7280' }}>Progression</span>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#1f2937' }}>{project.progress}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: 8,
                        backgroundColor: '#f3f4f6',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${project.progress}%`,
                          height: '100%',
                          backgroundColor: '#8b5cf6',
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

      case 'assets':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Bibliothèque d'Assets
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {assets.map(asset => (
                <div key={asset.id} style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '100%',
                    height: 120,
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32
                  }}>
                    {asset.type === 'Icons' ? '🎨' : asset.type === 'Colors' ? '🎨' : '📝'}
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: '#1f2937' }}>
                    {asset.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#6b7280', fontSize: 14 }}>{asset.type}</span>
                    <span style={{ color: '#6b7280', fontSize: 14 }}>{asset.size}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>
                      {asset.downloads} téléchargements
                    </span>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}>
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'outils':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Outils de Design
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                  Outils Favoris
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { name: 'Figma', desc: 'Design collaboratif', icon: '🎨' },
                    { name: 'Adobe XD', desc: 'Prototypage', icon: '✨' },
                    { name: 'Sketch', desc: 'Design UI/UX', icon: '📐' },
                    { name: 'Photoshop', desc: 'Retouche photo', icon: '🖼️' }
                  ].map((tool, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8
                    }}>
                      <span style={{ fontSize: 20 }}>{tool.icon}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: '#1f2937', fontSize: 14 }}>{tool.name}</div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>{tool.desc}</div>
                      </div>
                    </div>
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
                  Ressources
                </h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { name: 'Unsplash', desc: 'Photos gratuites', icon: '📸' },
                    { name: 'Google Fonts', desc: 'Polices web', icon: '🔤' },
                    { name: 'Dribbble', desc: 'Inspiration', icon: '💡' },
                    { name: 'Behance', desc: 'Portfolio', icon: '🎭' }
                  ].map((resource, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8
                    }}>
                      <span style={{ fontSize: 20 }}>{resource.icon}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: '#1f2937', fontSize: 14 }}>{resource.name}</div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>{resource.desc}</div>
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
              Tableau de bord Designer
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>🎨</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#8b5cf6' }}>
                    {designs.length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Designs actifs</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>📁</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                    {projects.filter(p => p.status === 'active').length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Projets actifs</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>📦</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>
                    {assets.length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Assets disponibles</p>
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

export default DesignerDashboard;
