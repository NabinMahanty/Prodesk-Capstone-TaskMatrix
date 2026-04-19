'use client';

import { useState } from 'react';
import useProjectStore from '@/store/projectStore';

export default function ProjectsView({ user }) {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2d3a8c');

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setColor('#2d3a8c');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setColor(project.color || '#2d3a8c');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject.id, { title, description, color });
      } else {
        await addProject({ title, description, color });
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving project');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  return (
    <div className="dashboard-content" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Projects Management</h2>
        <button className="btn-primary small" onClick={openAddModal} style={{ margin: 0 }}>+ Create Project</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? <p>Loading projects...</p> : projects.length === 0 ? <p>No projects found.</p> : projects.map(proj => (
          <div key={proj.id} className="card" style={{ borderTop: `4px solid ${proj.color || '#ccc'}` }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{proj.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px' }}>{proj.description}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="task-btn edit" onClick={() => openEditModal(proj)}>Edit</button>
              <button className="task-btn delete" onClick={() => handleDelete(proj.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingProject ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input required type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Brand Color</label>
                <input type="color" className="form-input" value={color} onChange={(e) => setColor(e.target.value)} style={{ height: '40px', padding: '0.2rem' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary small">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
