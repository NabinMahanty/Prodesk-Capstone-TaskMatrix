'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useProjectStore from '@/store/projectStore';

import DashboardOverview from '@/components/DashboardOverview';
import ProjectsView from '@/components/ProjectsView';
import TasksView from '@/components/TasksView';
import BoardsView from '@/components/BoardsView';

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
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

function Sidebar({ user, onLogout, activeTab, setActiveTab }) {
  const navItems = [
    { label: 'Dashboard', icon: ic.grid },
    { label: 'Projects',  icon: ic.folder },
    { label: 'Boards',    icon: ic.board },
    { label: 'Tasks',     icon: ic.check },
  ];

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">{ic.grid}</div>
        <div className="sidebar-brand-info">
          <div className="sidebar-brand-name">TaskMatrix</div>
          <div className="sidebar-brand-role">Pro Account</div>
        </div>
      </div>

      <div className="sidebar-nav">
        {navItems.map(({ label, icon }) => (
          <button
            key={label}
            className={`nav-item ${activeTab === label ? ' active' : ''}`}
            onClick={() => setActiveTab(label)}
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

function Avatar({ user }) {
  const initial = (user?.displayName || user?.email || 'U')[0].toUpperCase();
  return (
    <div className="avatar">
      {user?.photoURL ? <img src={user.photoURL} alt="Avatar" referrerPolicy="no-referrer" /> : initial}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { fetchTasks } = useTaskStore();
  const { fetchProjects } = useProjectStore();

  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchProjects();
    }
  }, [user, fetchTasks, fetchProjects]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch {/* ignored */}
  };

  if (authLoading || !user) {
    return (
      <div className="loading-screen">
        <div className="loading-ring" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  const displayName = user.displayName || user.email.split('@')[0];

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dashboard-main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-search">
            {ic.search}
            <input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">{ic.bell}</button>
            <div className="topbar-user" tabIndex={0}>
              <div className="topbar-user-info">
                <div className="topbar-user-name">{displayName}</div>
                <div className="topbar-user-role">Member</div>
              </div>
              <Avatar user={user} />
            </div>
          </div>
        </header>

        {/* Dynamic View based on Active Tab */}
        {activeTab === 'Dashboard' && <DashboardOverview user={user} />}
        {activeTab === 'Projects' && <ProjectsView user={user} />}
        {activeTab === 'Tasks' && <TasksView user={user} />}
        {activeTab === 'Boards' && <BoardsView user={user} />}
      </div>
    </div>
  );
}
