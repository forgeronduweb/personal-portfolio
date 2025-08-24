import React, { useState, useEffect } from 'react';

// Configuration API - utilise localhost en développement
const getApiUrl = () => {
  // En développement local, utiliser localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // En production, utiliser l'URL de production
  return import.meta.env.VITE_API_URL || 'https://personal-portfolio-back.onrender.com/api';
};

const API_URL = getApiUrl();

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    category: '',
    type: '',
    technologies: []
  });

  // Handler pour les champs de texte
  const handleInputChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New formData:', newData);
      return newData;
    });
  };

  // Handler spécifique pour l'image qui ne bloque pas les autres champs
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Début upload image:', file.name);

    // Validation du fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.');
      e.target.value = ''; // Reset input
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      alert('Fichier trop volumineux. Maximum 5MB.');
      e.target.value = ''; // Reset input
      return;
    }

    // Conversion en base64 de manière non-bloquante
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      console.log('Image convertie en base64, taille:', base64String.length);
      
      setFormData(prev => ({
        ...prev,
        image: base64String
      }));
      
      console.log('Image mise à jour dans formData');
    };
    
    reader.onerror = (error) => {
      console.error('Erreur lecture fichier:', error);
      alert('Erreur lors du chargement de l\'image');
      e.target.value = ''; // Reset input
    };
    
    reader.readAsDataURL(file);
  };

  // Technologies prédéfinies avec leurs icônes
  const predefinedTechs = [
    { name: "React", shortName: "React", icon: "SiReact", color: "text-blue-500" },
    { name: "Vue.js", shortName: "Vue", icon: "SiVuedotjs", color: "text-green-500" },
    { name: "Node.js", shortName: "Node", icon: "SiNodedotjs", color: "text-green-600" },
    { name: "MongoDB", shortName: "Mongo", icon: "SiMongodb", color: "text-green-700" },
    { name: "Tailwind CSS", shortName: "CSS", icon: "SiTailwindcss", color: "text-cyan-500" },
    { name: "JavaScript", shortName: "JS", icon: "SiJavascript", color: "text-yellow-500" },
    { name: "TypeScript", shortName: "TS", icon: "SiTypescript", color: "text-blue-600" },
    { name: "Next.js", shortName: "Next", icon: "SiNextdotjs", color: "text-black" },
    { name: "Sass", shortName: "Sass", icon: "SiSass", color: "text-pink-500" },
    { name: "GitHub", shortName: "Git", icon: "SiGithub", color: "text-gray-800" }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      console.log('API URL utilisée:', API_URL);
      console.log('Token admin:', token ? 'Présent' : 'Absent');
      
      const response = await fetch(`${API_URL}/admin/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      console.error('Détails de l\'erreur:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Début soumission formulaire:', formData);
    
    // Validation des champs requis
    if (!formData.title || !formData.category || !formData.type) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Token d\'authentification manquant');
        return;
      }

      const url = editingProject 
        ? `${API_URL}/admin/projects/${editingProject._id}`
        : `${API_URL}/admin/projects`;
      
      const method = editingProject ? 'PUT' : 'POST';
      
      console.log('Envoi vers:', url, 'méthode:', method);
      console.log('Données envoyées:', JSON.stringify(formData, null, 2));

      // Vérifier la taille des données
      const dataSize = JSON.stringify(formData).length;
      console.log('Taille des données:', dataSize, 'caractères');
      
      if (dataSize > 16 * 1024 * 1024) { // 16MB
        alert('Image trop volumineuse pour la base de données');
        return;
      }

      console.log('Début de l\'appel fetch...');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Status response:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur HTTP:', response.status, errorText);
        alert(`Erreur HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('Réponse serveur:', data);
      
      if (data.success) {
        await fetchProjects(); // Recharger la liste
        resetForm();
        alert(editingProject ? 'Projet mis à jour!' : 'Projet créé!');
        
        // Déclencher un événement pour notifier le frontend
        window.dispatchEvent(new CustomEvent('projectsUpdated'));
      } else {
        console.error('Erreur métier:', data.message);
        alert('Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Stack trace:', error.stack);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL}/admin/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          await fetchProjects(); // Recharger la liste
          alert('Projet supprimé!');
          
          // Déclencher un événement pour notifier le frontend
          window.dispatchEvent(new CustomEvent('projectsUpdated'));
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      image: project.image,
      title: project.title,
      category: project.category,
      type: project.type || '',
      technologies: project.technologies
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      image: '',
      title: '',
      category: '',
      type: '',
      technologies: []
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const addPredefinedTech = (tech) => {
    const exists = formData.technologies.find(t => t.name === tech.name);
    if (!exists) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
    }
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };


  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24,
        position: 'fixed',
        top: 64,
        left: 280,
        right: 24,
        backgroundColor: '#f8fafc',
        zIndex: 15,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Gestion des Projets</h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Ajouter un Projet
        </button>
      </div>
        
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {projects.map((project) => (
            <div key={project._id} style={{ 
              padding: 16, 
              backgroundColor: 'white', 
              borderRadius: 12, 
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <img 
                  style={{ 
                    borderRadius: 8, 
                    width: '100%', 
                    height: 160, 
                    objectFit: 'cover' 
                  }} 
                  src={project.image.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${project.image}` : project.image} 
                  alt={project.alt}
                />
              </div>
              
              <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 600 }}>
                {project.title}
              </h3>
              <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: 14 }}>
                {project.category} {project.type && `• ${project.type}`}
              </p>
              
              {project.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span key={techIndex} style={{
                      fontSize: 12,
                      color: '#64748b',
                      backgroundColor: '#f1f5f9',
                      padding: '2px 8px',
                      borderRadius: 4
                    }}>
                      {tech.name}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span style={{ fontSize: 12, color: '#64748b' }}>+{project.technologies.length - 3}</span>
                  )}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleEdit(project)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {editingProject ? 'Modifier le projet' : 'Ajouter un projet'}
              </h2>
              <button
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Image URL ou Upload</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="URL de l'image ou laissez vide pour upload"
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                  />
                  {formData.image && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img 
                        src={formData.image.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${formData.image}` : formData.image}
                        alt="Aperçu" 
                        style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #d1d5db' }}
                      />
                      <span style={{ fontSize: 12, color: '#10b981' }}>✓ Image uploadée</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Web">Web</option>
                </select>
              </div>


              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Technologies (cliquez pour ajouter)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {predefinedTechs.map((tech, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addPredefinedTech(tech)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      {tech.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technologies sélectionnées */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Technologies sélectionnées</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {formData.technologies.map((tech, index) => (
                    <span key={index} style={{
                      padding: '6px 12px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: 6,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      {tech.name}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#64748b',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  {editingProject ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
