'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';

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
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

const PROJECTS = [
  { name: 'Brand Identity Redesign', icon: '✏️', percent: 84, color: 'blue',   members: ['JC', 'SM', 'AC'] },
  { name: 'Financial Portal UI',     icon: '💳', percent: 42, color: 'green',  members: ['JC', 'LT'] },
  { name: 'Q4 Marketing Campaign',   icon: '🚀', percent: 12, color: 'orange', members: ['AC', 'SM'] },
];

const ACTIVITY = [
  {
    color: 'blue', initials: 'SM',
    text: <><strong>Sarah Miller</strong> moved &ldquo;User Onboarding&rdquo; to <span className="activity-badge completed">COMPLETED</span></>,
    time: '12 Minutes Ago',
  },
  {
    color: 'orange', initials: 'AC',
    text: <><strong>Alex Chen</strong> commented on &ldquo;API Documentation&rdquo;</>,
    quote: '"Should we include the new authentication endpoints in this sprint?"',
    time: '2 Hours Ago',
  },
  {
    color: 'teal', initials: 'JU',
    text: <><strong>Julian</strong> uploaded 3 attachments to &ldquo;Brand Guidelines&rdquo;</>,
    time: 'Yesterday',
  },
  {
    color: 'red', initials: 'SY',
    text: <><strong>System</strong> flagged &ldquo;Database Migration&rdquo; as Overdue</>,
    time: '2 Days Ago',
  },
];

function Sidebar({ user, onLogout }) {
  const initial = (user?.displayName || user?.email || 'U')[0].toUpperCase();
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
          <div className="sidebar-brand-role">Digital Curator</div>
        </div>
      </div>

      <div className="sidebar-nav">
        {navItems.map(({ label, icon, active }) => (
          <button
            key={label}
            className={`nav-item${active ? ' active' : ''}`}
            aria-current={active ? 'page' : undefined}
            id={`nav-${label.toLowerCase()}`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button
          id="logout-btn"
          className="logout-btn"
          onClick={onLogout}
          aria-label="Log out"
        >
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
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.35, background: `hsl(${(initial.charCodeAt(0) * 47) % 360}, 60%, 40%)` }}>
      {initial}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch {/* cookie cleared by AuthProvider's onAuthStateChange */}
  };

  if (loading || !user) {
    return (
      <div className="loading-screen" aria-label="Loading dashboard">
        <div className="loading-ring" />
        <p className="loading-text">Loading dashboard…</p>
      </div>
    );
  }

  const pendingCount = 12;
  const activeStreams = 4;
  const displayName = user.displayName || user.email.split('@')[0];

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="dashboard-main">
        {/* ── Top bar ── */}
        <header className="topbar">
          <div className="topbar-search" role="search">
            {ic.search}
            <input
              id="dashboard-search"
              type="text"
              placeholder="Search curated insights..."
              aria-label="Search"
            />
          </div>

          <div className="topbar-actions">
            <button id="notifications-btn" className="icon-btn" aria-label="Notifications">
              {ic.bell}
            </button>
            <button id="help-btn" className="icon-btn" aria-label="Help">
              {ic.help}
            </button>
            <div className="topbar-user" id="user-profile-pill" role="button" tabIndex={0} aria-label="User profile">
              <div className="topbar-user-info">
                <div className="topbar-user-name">{displayName}</div>
                <div className="topbar-user-role">Project Curator</div>
              </div>
              <Avatar user={user} />
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="dashboard-content" id="dashboard-content">
          {/* Hero */}
          <section className="dashboard-hero" aria-label="Welcome section">
            <h1>Welcome back, {displayName.split(' ')[0]} 👋</h1>
            <p>
              You have <strong>{pendingCount} pending tasks</strong> across{' '}
              <strong>{activeStreams} active streams</strong> today.
            </p>
          </section>

          {/* Stats */}
          <section className="stats-grid" aria-label="Key metrics">
            <article className="stat-card">
              <div className="stat-icon blue">{ic.check}</div>
              <div className="stat-value">24</div>
              <div className="stat-label">Tasks Assigned</div>
              <div className="stat-trend up">
                <span>↑</span> +4 this week
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon orange">{ic.task}</div>
              <div className="stat-value">08</div>
              <div className="stat-label">Due This Week</div>
              <div className="stat-trend warn">
                <span>⚠</span> 3 high priority
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon green">{ic.comment}</div>
              <div className="stat-value">15</div>
              <div className="stat-label">Recent Comments</div>
              <div className="stat-trend info">Updated 12m ago</div>
            </article>
          </section>

          {/* Main grid */}
          <div className="dashboard-grid">
            {/* Projects at a Glance */}
            <section className="card" aria-label="Projects at a glance">
              <div className="card-header">
                <div>
                  <div className="card-title">Projects at a Glance</div>
                  <div className="card-subtitle">Active creative streams and their health</div>
                </div>
                <a href="#" className="view-all-link" id="view-all-projects">View All Projects</a>
              </div>

              {PROJECTS.map((p) => (
                <article key={p.name} className="project-item">
                  <div className="project-icon-wrap" aria-hidden="true">{p.icon}</div>
                  <div className="project-info">
                    <div className="project-name">{p.name}</div>
                    <div className="project-meta">
                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${p.color}`}
                          style={{ width: `${p.percent}%` }}
                          role="progressbar"
                          aria-valuenow={p.percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${p.name} progress`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="project-right">
                    <div className="project-percent">{p.percent}%</div>
                    <div className="project-avatars" aria-label={`${p.members.length} team members`}>
                      {p.members.map((m) => (
                        <div key={m} className="avatar-xs" title={m}>{m[0]}</div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Activity Feed */}
            <section className="card" aria-label="Activity feed">
              <div className="card-header">
                <div className="card-title">Activity Feed</div>
              </div>
              <div className="activity-feed">
                {ACTIVITY.map((a, i) => (
                  <article key={i} className="activity-item">
                    <div className={`activity-dot ${a.color}`} aria-hidden="true">{a.initials}</div>
                    <div className="activity-body">
                      <p className="activity-text">{a.text}</p>
                      {a.quote && <div className="quote-box">{a.quote}</div>}
                      <time className="activity-time">{a.time}</time>
                    </div>
                  </article>
                ))}
              </div>
              <button className="load-more-btn" id="load-more-activity">Load More Activity</button>
            </section>
          </div>
        </main>
      </div>

      {/* FAB */}
      <button className="fab" id="add-task-fab" aria-label="Add new task">
        {ic.plus}
        Add Task
      </button>
    </div>
  );
}
