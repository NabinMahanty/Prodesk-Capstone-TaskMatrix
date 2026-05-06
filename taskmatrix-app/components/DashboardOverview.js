'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import useTaskStore from '@/store/taskStore';
import useProjectStore from '@/store/projectStore';

const TaskStatusChart = dynamic(() => import('@/components/TaskStatusChart'), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: 250, width: '100%' }} />,
});

export default function DashboardOverview({ user }) {
  const { tasks, loading: tasksLoading } = useTaskStore();
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
  const pendingTaskCount = useMemo(
    () => tasks.filter(t => t.status !== 'done').length,
    [tasks]
  );
  const completedTaskCount = useMemo(
    () => tasks.filter(t => t.status === 'done').length,
    [tasks]
  );

  return (
    <div className="dashboard-content">
      <section className="dashboard-hero">
        <h1>Welcome Back, {user.displayName?.split(' ')[0]} 👋</h1>
        <p>You have <strong>{pendingTaskCount} pending tasks</strong> today across <strong>{projects.length}</strong> projects.</p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          {/* <div className="stat-icon blue"></div> */}
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">Active Projects</div>
        </article>
        <article className="stat-card">
          {/* <div className="stat-icon orange"></div> */}
          <div className="stat-value">{pendingTaskCount}</div>
          <div className="stat-label">To Do / In Progress</div>
        </article>
        <article className="stat-card">
          {/* <div className="stat-icon green"></div> */}
          <div className="stat-value">{completedTaskCount}</div>
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
            <TaskStatusChart chartData={chartData} />
          </div>
        </section>
      </div>
    </div>
  );
}
