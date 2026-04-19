'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';

export default function SettingsView() {
  const { user } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName }
      });

      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      setMessage('Password updated successfully!');
      setPassword('');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Profile Settings</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Manage your account settings and preferences.</p>
      </div>

      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '8px', 
          background: message.includes('Error') ? '#fef2f2' : '#ecfdf5',
          color: message.includes('Error') ? '#991b1b' : '#065f46',
          border: `1px solid ${message.includes('Error') ? '#fecaca' : '#a7f3d0'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Profile Info Section */}
        <section className="card">
          <div className="card-header">
            <div className="card-title">Personal Information</div>
          </div>
          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ background: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }} />
              <small style={{ color: '#9ca3af', marginTop: '0.25rem', display: 'block' }}>Email cannot be changed.</small>
            </div>
            
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Enter your full name" 
              />
            </div>
            
            <div>
              <button type="submit" className="btn-primary small" disabled={loading} style={{ margin: 0 }}>
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </section>

        {/* Security Section */}
        <section className="card">
          <div className="card-header">
            <div className="card-title">Security</div>
          </div>
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter new password (min. 6 characters)" 
              />
            </div>
            
            <div>
              <button type="submit" className="btn-primary small" disabled={loading} style={{ margin: 0, background: '#ef4444' }}>
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
