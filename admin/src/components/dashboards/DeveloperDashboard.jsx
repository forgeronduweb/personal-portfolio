import { useState, useEffect } from 'react';

const DeveloperDashboard = ({ user, activeSection }) => {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTickets([
        { id: 1, title: 'Bug correction formulaire contact', priority: 'high', status: 'in_progress', project: 'Portfolio Client A' },
        { id: 2, title: 'Optimisation performance', priority: 'medium', status: 'pending', project: 'E-commerce B' },
        { id: 3, title: 'Nouvelle fonctionnalité API', priority: 'low', status: 'completed', project: 'App Mobile C' }
      ]);
      setProjects([
        { id: 1, name: 'Portfolio Client A', progress: 85, deadline: '2024-09-20', status: 'active' },
        { id: 2, name: 'E-commerce B', progress: 60, deadline: '2024-10-15', status: 'active' },
        { id: 3, name: 'App Mobile C', progress: 30, deadline: '2024-11-01', status: 'planning' }
      ]);
      setCommits([
        { id: 1, message: 'Fix: Correction bug formulaire', project: 'Portfolio Client A', time: '2h', branch: 'bugfix/contact-form' },
        { id: 2, message: 'Feature: Ajout système de cache', project: 'E-commerce B', time: '4h', branch: 'feature/caching' },
        { id: 3, message: 'Update: Documentation API', project: 'App Mobile C', time: '1h', branch: 'docs/api-update' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#fef2f2', color: '#dc2626' };
      case 'medium': return { bg: '#fef3c7', color: '#d97706' };
      case 'low': return { bg: '#f0fdf4', color: '#16a34a' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#f0fdf4', color: '#16a34a' };
      case 'in_progress': return { bg: '#dbeafe', color: '#2563eb' };
      case 'pending': return { bg: '#fef3c7', color: '#d97706' };
      case 'active': return { bg: '#dbeafe', color: '#2563eb' };
      case 'planning': return { bg: '#f3e8ff', color: '#9333ea' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tickets':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Mes Tickets
            </h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {tickets.map(ticket => {
                const priorityStyle = getPriorityColor(ticket.priority);
                const statusStyle = getStatusColor(ticket.status);
                return (
                  <div key={ticket.id} style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1f2937' }}>
                        {ticket.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 500,
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.color
                        }}>
                          {ticket.priority}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 500,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color
                        }}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
                      Projet: {ticket.project}
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
                          backgroundColor: '#10b981',
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

      case 'commits':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Commits Récents
            </h2>
            <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {commits.map((commit, index) => (
                <div key={commit.id} style={{
                  padding: 20,
                  borderBottom: index < commits.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16
                  }}>
                    📝
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                      {commit.message}
                    </h4>
                    <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: 12 }}>
                      {commit.project} • {commit.branch} • il y a {commit.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'planning':
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Planning
            </h2>
            <div style={{
              backgroundColor: 'white',
              padding: 48,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 600, color: '#1f2937' }}>
                Planning en développement
              </h3>
              <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6 }}>
                La fonctionnalité de planning sera bientôt disponible pour organiser vos tâches.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>
              Tableau de bord Développeur
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>🎫</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>
                    {tickets.filter(t => t.status !== 'completed').length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Tickets actifs</p>
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
                  <span style={{ fontSize: 24 }}>📝</span>
                  <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>
                    {commits.length}
                  </h3>
                </div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Commits aujourd'hui</p>
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
          borderTop: '3px solid #3b82f6',
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

export default DeveloperDashboard;
