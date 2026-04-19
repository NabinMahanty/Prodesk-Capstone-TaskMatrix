'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ── Icon set ─────────────────────────────────────────────────────────────────
const ic = {
  grid: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  ),
  board: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" width="16" height="16">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  task: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  comment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
};

function Sidebar({ user, onLogout }) {
  const navItems = [
    { label: 'Dashboard', icon: ic.grid,     active: true  },
    { label: 'Projects',  icon: ic.folder,   active: false },
    { label: 'Boards',    icon: ic.board,    active: false },
    { label: 'Tasks',     icon: ic.check,    active: false },
    { label: 'Team',      icon: ic.users,    active: false },
    { label: 'Settings',  icon: ic.settings, active: false },
  ];

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">{ic.grid}</div>
        <div className="sidebar-brand-info">
          <div className="sidebar-brand-name">TaskMatrix</div>
          <div className="sidebar-brand-role">Provider</div>
        </div>
      </div>

      <div className="sidebar-nav">
        {navItems.map(({ label, icon, active }) => (
          <button
            key={label}
            className={`nav-item${active ? ' active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout} aria-label="Log out">
          {ic.logout}
          Log Out
        </button>
      </div>
    </nav>
  );
}

function Avatar({ user, size = 34 }) {
  const initial = (user?.displayName || user?.email || 'U')[0].toUpperCase();
  if (user?.photoURL) {
    return (
      <div className="avatar" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.photoURL} alt={user.displayName || 'User'} referrerPolicy="no-referrer" />
      </div>
    );
  }
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initial}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { tasks, loading: tasksLoading, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo'); // todo, in-progress, done

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch {/* ignored */}
  };

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('todo');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status || 'todo');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask.id, { title, description, status });
      } else {
        await addTask({ title, description, status });
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        alert('Error deleting task');
      }
    }
  };

  const chartData = useMemo(() => {
    let todo = 0; let inProgress = 0; let done = 0;
    tasks.forEach(t => {
      if (t.status === 'in-progress') inProgress++;
      else if (t.status === 'done') done++;
      else todo++;
    });

    return [
      { name: 'To Do', count: todo, color: '#f97316' },
      { name: 'In Progress', count: inProgress, color: '#2d3a8c' },
      { name: 'Completed', count: done, color: '#10b981' }
    ];
  }, [tasks]);

  if (authLoading || !user) {
    return (
      <div className="loading-screen" aria-label="Loading dashboard">
        <div className="loading-ring" />
        <p className="loading-text">Loading dashboard…</p>
      </div>
    );
  }

  const displayName = user.displayName || user.email.split('@')[0];

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="dashboard-main">
        {/* ── Top bar ── */}
        <header className="topbar">
          <div className="topbar-search" role="search">
            {ic.search}
            <input type="text" placeholder="Search tasks..." aria-label="Search" />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" aria-label="Notifications">{ic.bell}</button>
            <div className="topbar-user" role="button" tabIndex={0} aria-label="User profile">
              <div className="topbar-user-info">
                <div className="topbar-user-name">{displayName}</div>
                <div className="topbar-user-role">Member</div>
              </div>
              <Avatar user={user} />
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="dashboard-content">
          <section className="dashboard-hero">
            <h1>Welcome back, {displayName.split(' ')[0]} 👋</h1>
            <p>You have <strong>{tasks.filter(t => t.status !== 'done').length} pending tasks</strong> today.</p>
          </section>

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon blue">{ic.check}</div>
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </article>
            <article className="stat-card">
              <div className="stat-icon orange">{ic.task}</div>
              <div className="stat-value">{tasks.filter(t => t.status === 'todo').length}</div>
              <div className="stat-label">To Do</div>
            </article>
            <article className="stat-card">
              <div className="stat-icon green">{ic.comment}</div>
              <div className="stat-value">{tasks.filter(t => t.status === 'done').length}</div>
              <div className="stat-label">Completed</div>
            </article>
          </section>

          <div className="dashboard-grid">
            {/* My Tasks */}
            <section className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">My Tasks</div>
                  <div className="card-subtitle">Manage your daily stream</div>
                </div>
              </div>
              
              <div className="task-list">
                {tasksLoading ? (
                  <p>Loading...</p>
                ) : tasks.length === 0 ? (
                  <p>No tasks yet. Create one!</p>
                ) : (
                  tasks.map((task) => (
                    <article key={task.id} className={`task-item ${task.status}`}>
                      <div className="task-info">
                        <div className="task-info-title">{task.title}</div>
                        <div className="task-info-desc">{task.description}</div>
                      </div>
                      <div className="task-actions">
                        <button className="task-btn edit" onClick={() => openEditModal(task)}>Edit</button>
                        <button className="task-btn delete" onClick={() => handleDelete(task.id)}>Delete</button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* Analytics */}
            <section className="card">
              <div className="card-header">
                <div className="card-title">Task Analytics</div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </main>
      </div>

      <button className="fab" onClick={openAddModal} aria-label="Add new task">
        {ic.plus}
        Add Task
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Update Database Schema"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about the task..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary small">{editingTask ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
