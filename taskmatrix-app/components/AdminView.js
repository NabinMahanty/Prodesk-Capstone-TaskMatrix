'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminView({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('Overview');

  // Hardcoded Mock Data for Admin Showcase
  const systemUsers = [
    { id: 1, name: 'Nabin Mahanty', email: 'nabinmahanty2003@gmail.com', role: 'Superadmin', status: 'Active', joined: '2026-04-19' },
    { id: 2, name: 'Sarah Miller', email: 'sarah.m@example.com', role: 'Premium', status: 'Active', joined: '2026-03-12' },
    { id: 3, name: 'Alex Chen', email: 'achen@example.com', role: 'Member', status: 'Offline', joined: '2026-03-25' },
    { id: 4, name: 'Julian User', email: 'juser@prodesk.in', role: 'Member', status: 'Active', joined: '2026-04-01' },
    { id: 5, name: 'Test Account', email: 'test@example.com', role: 'Member', status: 'Banned', joined: '2026-04-15' },
  ];

  const activityData = [
    { name: 'Mon', logins: 45, signups: 12 },
    { name: 'Tue', logins: 52, signups: 18 },
    { name: 'Wed', logins: 38, signups: 9 },
    { name: 'Thu', logins: 65, signups: 22 },
    { name: 'Fri', logins: 48, signups: 14 },
    { name: 'Sat', logins: 25, signups: 5 },
    { name: 'Sun', logins: 30, signups: 8 },
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
              <div className="stat-label">Total Users</div>
              <div className="stat-value">1,248</div>
              <div className="stat-trend up">↑ +12% this month</div>
            </article>
            <article className="stat-card" style={{ borderTop: '4px solid #10b981' }}>
              <div className="stat-label">Active Subscriptions</div>
              <div className="stat-value">452</div>
              <div className="stat-trend up">↑ +5% this month</div>
            </article>
            <article className="stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
              <div className="stat-label">System Load</div>
              <div className="stat-value">24%</div>
              <div className="stat-trend info">Normal</div>
            </article>
            <article className="stat-card" style={{ borderTop: '4px solid #ef4444' }}>
              <div className="stat-label">Failed Logins</div>
              <div className="stat-value">12</div>
              <div className="stat-trend warn">Needs review</div>
            </article>
          </section>

          <section className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header"><div className="card-title">System Traffic & Signups</div></div>
            <div className="chart-container" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="logins" stroke="#2d3a8c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Logins" />
                  <Line type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Signups" />
                </LineChart>
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
                  <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</th>
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
                    <td style={{ padding: '1rem' }}>
                      <button style={{ color: '#2d3a8c', fontWeight: 600, fontSize: '0.8rem', marginRight: '1rem' }}>Edit</button>
                      <button style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>Ban</button>
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
