'use client';

import { useState } from 'react';
import useTaskStore from '@/store/taskStore';
import useProjectStore from '@/store/projectStore';
import useUserStore from '@/store/userStore';

export default function TasksView({ user }) {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filters
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('todo');
    setDueDate('');
    setProjectId('');
    setAssigneeId('');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'Medium');
    setStatus(task.status || 'todo');
    setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setProjectId(task.project_id || '');
    setAssigneeId(task.assignee_id || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      title, 
      description, 
      status, 
      priority, 
      due_date: dueDate || null,
      project_id: projectId || null,
      assignee_id: assigneeId || null
    };
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await addTask(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this task forever?')) {
      await deleteTask(id);
    }
  };

  const displayedTasks = tasks.filter(t => {
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="dashboard-content" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Task Management</h2>
        <button className="btn-primary small" onClick={openAddModal} style={{ margin: 0 }}>+ Create Task</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="form-input" 
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="All">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="form-input" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ width: 'auto' }}>
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="card">
        <div className="task-list">
          {loading ? <p>Loading tasks...</p> : displayedTasks.length === 0 ? <p>No tasks match your filters.</p> : displayedTasks.map(task => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <div className="task-info">
                <div className="task-info-title">{task.title} <span style={{ fontSize: '0.7em', padding: '2px 6px', background: '#e5e7eb', borderRadius: '4px', marginLeft: '6px'}}>{task.priority}</span></div>
                <div className="task-info-desc">
                  Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'None'} | Project: {task.project_id ? projects.find(p => p.id === task.project_id)?.title : 'None'} | Assignee: {task.assignee_id ? users.find(u => u.id === task.assignee_id)?.email : 'Unassigned'}
                </div>
              </div>
              <div className="task-actions">
                <button className="task-btn edit" onClick={() => openEditModal(task)}>Edit</button>
                <button className="task-btn delete" onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input required type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Project</label>
                  <select className="form-input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                    <option value="">None</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To User</label>
                  <select className="form-input" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary small">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
