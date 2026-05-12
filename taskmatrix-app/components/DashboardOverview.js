'use client';

import { useState, useMemo } from 'react';
import useTaskStore from '@/store/taskStore';
import useProjectStore from '@/store/projectStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function DashboardOverview({ user }) {
  const { tasks, loading: tasksLoading, deleteTask } = useTaskStore();
  const { projects, loading: projectsLoading } = useProjectStore();

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

  const recentTasks = tasks.slice(0, 5); // 5 most recent tasks

  return (
    <div className="dashboard-content">
      <section className="dashboard-hero">
        <h1>Welcome Back, {user.displayName?.split(' ')[0]} 👋</h1>
        <p>You have <strong>{tasks.filter(t => t.status !== 'done').length} pending tasks</strong> today across <strong>{projects.length}</strong> projects.</p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          {/* <div className="stat-icon blue"></div> */}
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">Active Projects</div>
        </article>
        <article className="stat-card">
          {/* <div className="stat-icon orange"></div> */}
          <div className="stat-value">{tasks.filter(t => t.status !== 'done').length}</div>
          <div className="stat-label">To Do / In Progress</div>
        </article>
        <article className="stat-card">
          {/* <div className="stat-icon green"></div> */}
          <div className="stat-value">{tasks.filter(t => t.status === 'done').length}</div>
          <div className="stat-label">Completed</div>
        </article>
      </section>

      <div className="dashboard-grid">
        {/* Recent Tasks */}
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Tasks</div>
              <div className="card-subtitle">Your latest assignments</div>
            </div>
          </div>
          
          <div className="task-list">
            {tasksLoading ? (
              <p>Loading...</p>
            ) : recentTasks.length === 0 ? (
              <p>No tasks yet.</p>
            ) : (
              recentTasks.map((task) => (
                <article key={task.id} className={`task-item ${task.status}`}>
                  <div className="task-info">
                    <div className="task-info-title">{task.title}</div>
                    <div className="task-info-desc" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Priority: {task.priority || 'Normal'} | Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                    </div>
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
          <div className="chart-container" style={{ height: 250 }}>
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
    </div>
  );
}
