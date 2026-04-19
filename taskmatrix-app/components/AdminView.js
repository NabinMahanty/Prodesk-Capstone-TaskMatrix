'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import useTaskStore from '@/store/taskStore';
import useProjectStore from '@/store/projectStore';
import useUserStore from '@/store/userStore';

export default function AdminView({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const { users, loading: usersLoading } = useUserStore();

  const systemUsers = users.map(u => ({
    id: u.id,
    name: u.full_name || u.email.split('@')[0],
    email: u.email,
    role: u.email === 'nabinmahanty2003@gmail.com' ? 'Superadmin' : 'Member',
    status: 'Active',
  }));

  const priorityData = [
    { name: 'Critical', tasks: tasks.filter(t => t.priority === 'Critical').length },
    { name: 'High', tasks: tasks.filter(t => t.priority === 'High').length },
    { name: 'Medium', tasks: tasks.filter(t => t.priority === 'Medium').length },
    { name: 'Low', tasks: tasks.filter(t => t.priority === 'Low').length },
  ];

  return (
    <div className="dashboard-content" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>System Admin Panel</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Restricted Access Level: Superadmin</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn-secondary ${activeSubTab === 'Overview' ? 'active' : ''}`} onClick={() => setActiveSubTab('Overview')}>Overview</button>
          <button className={`btn-secondary ${activeSubTab === 'Users' ? 'active' : ''}`} onClick={() => setActiveSubTab('Users')}>User Management</button>
        </div>
      </div>

      {activeSubTab === 'Overview' && (
        <>
          <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
            <article className="stat-card" style={{ borderTop: '4px solid #2d3a8c' }}>
              <div className="stat-label">Total Projects</div>
              <div className="stat-value">{projects.length}</div>
              <div className="stat-trend info">System Wide</div>
            </article>
            <article className="stat-card" style={{ borderTop: '4px solid #10b981' }}>
              <div className="stat-label">Total Tasks</div>
              <div className="stat-value">{tasks.length}</div>
              <div className="stat-trend info">System Wide</div>
            </article>
            <article className="stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
              <div className="stat-label">Completion Rate</div>
              <div className="stat-value">{tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0}%</div>
              <div className="stat-trend up">For active projects</div>
            </article>
            <article className="stat-card" style={{ borderTop: '4px solid #ef4444' }}>
              <div className="stat-label">Critical Tasks</div>
              <div className="stat-value">{tasks.filter(t => t.priority === 'Critical').length}</div>
              <div className="stat-trend warn">Needs review</div>
            </article>
          </section>

          <section className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header"><div className="card-title">Task Distribution by Priority</div></div>
            <div className="chart-container" style={{ height: 300, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="tasks" fill="#2d3a8c" radius={[4,4,0,0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}

      {activeSubTab === 'Users' && (
        <section className="card">
          <div className="card-header">
            <div className="card-title">User Management Database</div>
            <input type="text" className="form-input" placeholder="Search by email..." style={{ width: '250px', padding: '0.5rem 1rem' }} />
          </div>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f4f5fb', color: '#6b7280' }}>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {systemUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#111827' }}>{u.name}</td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: u.role === 'Superadmin' ? '#2d3a8c' : '#f3f4f6', color: u.role === 'Superadmin' ? '#fff' : '#4b5563', fontSize: '0.75rem', fontWeight: 600 }}>{u.role}</span></td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        color: u.status === 'Active' ? '#10b981' : u.status === 'Banned' ? '#ef4444' : '#6b7280', 
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' 
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.status === 'Active' ? '#10b981' : u.status === 'Banned' ? '#ef4444' : '#6b7280' }} />
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
