'use client';

import useTaskStore from '@/store/taskStore';
import useAuthStore from '@/store/authStore';
import { useState } from 'react';

export default function BoardsView() {
  const { tasks, updateTask } = useTaskStore();
  const { user } = useAuthStore();
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedItem(taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDraggedItem(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      await updateTask(taskId, { status: newStatus });
    }
  };

  const columns = [
    { title: 'To Do', id: 'todo', border: '#f97316' },
    { title: 'In Progress', id: 'in-progress', border: '#2d3a8c' },
    { title: 'Done', id: 'done', border: '#10b981' }
  ];

  return (
    <div className="dashboard-content" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Kanban Board</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Drag and drop tasks to move them between statuses.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
        {columns.map(col => (
          <div 
            key={col.id} 
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{ 
              background: '#f8fafc', 
              borderRadius: '12px', 
              padding: '1rem',
              display: 'flex', 
              flexDirection: 'column',
              borderTop: `4px solid ${col.border}`,
              height: '100%',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{col.title}</h3>
              <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{ 
                    background: '#fff', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    cursor: 'grab',
                    opacity: draggedItem === task.id ? 0.5 : 1
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                    {task.title}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }}>
                    <span>{task.priority || 'Medium'}</span>
                    <div className="avatar" style={{ width: 24, height: 24, fontSize: '0.6rem' }}>
                      {user?.displayName?.[0] || 'U'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
