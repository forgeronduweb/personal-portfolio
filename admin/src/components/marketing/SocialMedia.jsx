import { useState, useEffect } from 'react';

const SocialMedia = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postForm, setPostForm] = useState({
    content: '',
    platform: 'all', // all, facebook, instagram, twitter, linkedin
    scheduledFor: '',
    status: 'draft', // draft, scheduled, published
    mediaUrl: '',
    hashtags: ''
  });

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

  const platforms = [
    { value: 'all', label: 'Toutes les plateformes', icon: '🌐' },
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' }
  ];

  const postStatuses = [
    { value: 'draft', label: 'Brouillon', color: '#64748b', bg: '#f1f5f9' },
    { value: 'scheduled', label: 'Programmé', color: '#f59e0b', bg: '#fef3c7' },
    { value: 'published', label: 'Publié', color: '#10b981', bg: '#d1fae5' }
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/marketing/social-media`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur chargement posts');
      setPosts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/marketing/social-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(postForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur création post');
      
      setPosts([data.data, ...posts]);
      setShowCreateModal(false);
      setPostForm({
        content: '',
        platform: 'all',
        scheduledFor: '',
        status: 'draft',
        mediaUrl: '',
        hashtags: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePostStatus = async (postId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/admin/marketing/social-media/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur mise à jour');
      
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, status: newStatus } : post
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const getPlatformInfo = (platform) => {
    return platforms.find(p => p.value === platform) || platforms[0];
  };

  const getStatusInfo = (status) => {
    return postStatuses.find(s => s.value === status) || postStatuses[0];
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#0f172a' }}>
            📱 Réseaux Sociaux
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
            Planifiez et gérez vos publications sur les réseaux sociaux
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          + Nouveau post
        </button>
      </div>

      {error && (
        <div style={{
          padding: 12,
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          color: '#dc2626',
          marginBottom: 16
        }}>
          {error}
        </div>
      )}

      {/* Statistiques rapides */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {postStatuses.map(status => {
          const count = posts.filter(p => p.status === status.value).length;
          return (
            <div key={status.value} style={{
              padding: 16,
              backgroundColor: status.bg,
              borderRadius: 8,
              border: `1px solid ${status.color}20`
            }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: status.color }}>
                {count}
              </div>
              <div style={{ fontSize: 14, color: status.color, fontWeight: 500 }}>
                {status.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Liste des posts */}
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        backgroundColor: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 3fr 1fr 1fr 1fr 100px',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          borderRadius: '12px 12px 0 0'
        }}>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>PLATEFORME</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>CONTENU</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>PROGRAMMATION</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>STATUT</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>ENGAGEMENT</div>
          <div style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>ACTIONS</div>
        </div>

        {/* Contenu */}
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            Chargement...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
            <p>Aucun post créé</p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Créer le premier
            </button>
          </div>
        ) : (
          posts.map(post => {
            const platformInfo = getPlatformInfo(post.platform);
            const statusInfo = getStatusInfo(post.status);
            
            return (
              <div key={post._id} style={{
                display: 'grid',
                gridTemplateColumns: '40px 3fr 1fr 1fr 1fr 100px',
                padding: '16px 20px',
                borderBottom: '1px solid #e5e7eb',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: 20 }}>{platformInfo.icon}</div>
                <div>
                  <div style={{ fontWeight: 500, color: '#0f172a', marginBottom: 4 }}>
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 && '...'}
                  </div>
                  {post.hashtags && (
                    <div style={{ fontSize: 12, color: '#3b82f6' }}>
                      {post.hashtags}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {post.scheduledFor ? (
                    <>
                      <div>{new Date(post.scheduledFor).toLocaleDateString()}</div>
                      <div>{new Date(post.scheduledFor).toLocaleTimeString()}</div>
                    </>
                  ) : (
                    'Non programmé'
                  )}
                </div>
                <div>
                  <select
                    value={post.status}
                    onChange={(e) => updatePostStatus(post._id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 500,
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {postStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {post.engagement ? (
                    <>
                      <div>👍 {post.engagement.likes || 0}</div>
                      <div>💬 {post.engagement.comments || 0}</div>
                      <div>🔄 {post.engagement.shares || 0}</div>
                    </>
                  ) : (
                    'Pas encore publié'
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => {
                      // Éditer le post
                      console.log('Éditer post:', post);
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 10
                    }}
                    title="Éditer"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 600 }}>
              Nouveau post réseaux sociaux
            </h3>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Plateforme
                </label>
                <select
                  value={postForm.platform}
                  onChange={(e) => setPostForm({...postForm, platform: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                >
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.icon} {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Contenu du post
                </label>
                <textarea
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    minHeight: 120,
                    resize: 'vertical'
                  }}
                  placeholder="Rédigez votre post..."
                />
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  {postForm.content.length} caractères
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Hashtags
                </label>
                <input
                  type="text"
                  value={postForm.hashtags}
                  onChange={(e) => setPostForm({...postForm, hashtags: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                  placeholder="#webdesign #portfolio #développement"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  URL média (optionnel)
                </label>
                <input
                  type="url"
                  value={postForm.mediaUrl}
                  onChange={(e) => setPostForm({...postForm, mediaUrl: e.target.value})}
                  style={{
                    width: '100%',
                    padding: 8,
                    border: '1px solid #d1d5db',
                    borderRadius: 6
                  }}
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Statut
                  </label>
                  <select
                    value={postForm.status}
                    onChange={(e) => setPostForm({...postForm, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  >
                    {postStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Programmer pour (optionnel)
                  </label>
                  <input
                    type="datetime-local"
                    value={postForm.scheduledFor}
                    onChange={(e) => setPostForm({...postForm, scheduledFor: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 8,
                      border: '1px solid #d1d5db',
                      borderRadius: 6
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 24
            }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={createPost}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Créer le post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMedia;
