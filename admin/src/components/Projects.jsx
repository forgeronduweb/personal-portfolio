import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    category: '',
    alt: '',
    technologies: [],
    order: 0
  });

  const [techForm, setTechForm] = useState({
    name: '',
    shortName: '',
    icon: '',
    color: ''
  });

  // Mapping des couleurs pour les badges
  const getColorClasses = (color) => {
    const colorMap = {
      'text-blue-500': 'bg-blue-100 text-blue-600 border-blue-200',
      'text-cyan-500': 'bg-cyan-100 text-cyan-600 border-cyan-200',
      'text-green-600': 'bg-green-100 text-green-700 border-green-200',
      'text-emerald-500': 'bg-emerald-100 text-emerald-600 border-emerald-200',
      'text-purple-600': 'bg-purple-100 text-purple-600 border-purple-200',
      'text-pink-500': 'bg-pink-100 text-pink-600 border-pink-200',
      'text-gray-800': 'bg-gray-100 text-gray-800 border-gray-200',
      'text-blue-600': 'bg-blue-100 text-blue-700 border-blue-200',
      'text-green-500': 'bg-green-100 text-green-600 border-green-200',
      'text-yellow-500': 'bg-yellow-100 text-yellow-600 border-yellow-200',
      'text-black': 'bg-gray-100 text-gray-900 border-gray-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600 border-gray-200';
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
      const response = await fetch('http://localhost:5000/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const url = editingProject 
        ? `http://localhost:5000/api/admin/projects/${editingProject._id}`
        : 'http://localhost:5000/api/admin/projects';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        fetchProjects();
        resetForm();
        alert(editingProject ? 'Projet mis à jour!' : 'Projet créé!');
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`http://localhost:5000/api/admin/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          fetchProjects();
          alert('Projet supprimé!');
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
      alt: project.alt,
      technologies: project.technologies,
      order: project.order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      image: '',
      title: '',
      category: '',
      alt: '',
      technologies: [],
      order: 0
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const addTechnology = (tech) => {
    if (!formData.technologies.some(t => t.name === tech.name)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
    }
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/admin/projects/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image: data.data.url
        }));
      } else {
        alert('Erreur lors de l\'upload: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Projets</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter un Projet
        </button>
      </div>

      {/* Liste des projets */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative">
              <img 
                className="w-full h-16 object-cover" 
                src={project.image.startsWith('/uploads') ? `http://localhost:5000${project.image}` : project.image} 
                alt={project.alt}
                loading="lazy"
              />
            </div>
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-900 mb-1 truncate">
                {project.title}
              </h3>
              <p className="text-xs text-indigo-600 font-medium mb-1 truncate">{project.category}</p>
              
              <div className="flex flex-wrap gap-0.5 mb-2">
                {project.technologies.slice(0, 2).map((tech, techIndex) => (
                  <span 
                    key={techIndex} 
                    className={`px-1.5 py-0.5 text-xs font-medium rounded ${getColorClasses(tech.color)}`}
                  >
                    {tech.shortName}
                  </span>
                ))}
                {project.technologies.length > 2 && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">
                    +{project.technologies.length - 2}
                  </span>
                )}
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 bg-blue-500 text-white px-1.5 py-0.5 rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs hover:bg-red-600 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProject ? 'Modifier le Projet' : 'Ajouter un Projet'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Image du projet</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border rounded px-3 py-2"
                  />
                  {formData.image && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={formData.image.startsWith('/uploads') ? `http://localhost:5000${formData.image}` : formData.image}
                        alt="Aperçu" 
                        className="w-16 h-10 object-cover rounded border border-gray-300"
                      />
                      <div className="text-xs text-gray-600">
                        ✓ Image uploadée
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description Alt</label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Technologies prédéfinies */}
              <div>
                <label className="block text-sm font-medium mb-2">Technologies (cliquez pour ajouter)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {predefinedTechs.map((tech, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addPredefinedTech(tech)}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm border"
                    >
                      {tech.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technologies sélectionnées */}
              <div>
                <label className="block text-sm font-medium mb-2">Technologies sélectionnées</label>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span key={index} className={`px-3 py-1 bg-gray-100 rounded text-sm ${tech.color} flex items-center gap-2`}>
                      {tech.name}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingProject ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div className="text-center py-8">Chargement...</div>}
    </div>
  );
};

export default Projects;
