'use client';

import React, { useEffect, useState } from 'react';

type Project = {
  id: string;
  name: string;
  deadline: string;
  teamMembers: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectsTable({
  projects,
  onRefresh,
  isAdmin,
}: {
  projects: Project[];
  onRefresh?: () => void;
  isAdmin?: boolean;
}) {
  const [now, setNow] = useState(Date.now());
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure to delete this project?')) return;
    const res = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) return alert('❌ Failed to delete');
    alert('🗑️ Deleted successfully');
    onRefresh?.();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    const res = await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingProject.id,
        name: editingProject.name,
        deadline: editingProject.deadline,
        teamMembers: editingProject.teamMembers.split(',').map((m) => m.trim()),
      }),
    });
    if (!res.ok) return alert('❌ Update failed');
    alert('✅ Project updated successfully');
    setEditingProject(null);
    onRefresh?.();
  };

  const formatCountdown = (deadlineIso: string) => {
    const diff = new Date(deadlineIso).getTime() - now;
    if (diff <= 0) return 'Expired';
    const sec = Math.floor(diff / 1000);
    const d = Math.floor(sec / (3600 * 24));
    const h = Math.floor((sec % (3600 * 24)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <div
      className="overflow-x-auto rounded-lg shadow-lg p-2"
      style={{ backgroundColor: '#f5f6f7' }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <th className="p-3 text-left font-semibold" style={{ color: '#1f2937' }}>Name</th>
            <th className="p-3 text-left font-semibold" style={{ color: '#1f2937' }}>Team</th>
            <th className="p-3 text-left font-semibold" style={{ color: '#1f2937' }}>Deadline</th>
            <th className="p-3 text-left font-semibold" style={{ color: '#1f2937' }}>Created By</th>
            <th className="p-3 text-center font-semibold" style={{ color: '#1f2937' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-sm" style={{ color: '#6b7280' }}>
                No projects yet
              </td>
            </tr>
          )}
          {projects.map((p) => (
            <tr key={p.id} className="border-t" style={{ borderColor: '#d1d5db' }}>
              <td className="p-3" style={{ color: '#1f2937' }}>{p.name}</td>
              <td className="p-3" style={{ color: '#374151' }}>{p.teamMembers}</td>
              <td className="p-3">
                <div className="flex flex-col" style={{ color: '#6b7280' }}>
                  <span style={{ color: '#f59e0b' }}>{formatCountdown(p.deadline)}</span>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(p.deadline).toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="p-3" style={{ color: '#374151' }}>{p.createdBy}</td>
              <td className="p-3 text-center">
                {isAdmin ? (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setEditingProject(p)}
                      className="px-3 py-1 rounded border"
                      style={{ borderColor: '#9ca3af', color: '#1f2937' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 rounded"
                      style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: '#10b981' }}
                  >
                    Assign
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingProject && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: '#00000040' }}
        >
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-semibold" style={{ color: '#1f2937' }}>
              Edit Project
            </h3>

            <div>
              <label className="block text-sm font-medium" style={{ color: '#374151' }}>
                Project Name
              </label>
              <input
                value={editingProject.name}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: '#374151' }}>
                Deadline
              </label>
              <input
                type="datetime-local"
                value={editingProject.deadline.slice(0, 16)}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, deadline: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: '#374151' }}>
                Team Members (comma separated)
              </label>
              <textarea
                value={editingProject.teamMembers}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, teamMembers: e.target.value })
                }
                rows={2}
                className="w-full border rounded px-3 py-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded border"
                style={{ borderColor: '#9ca3af', color: '#1f2937' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded"
                style={{ backgroundColor: '#0077B6', color: '#ffffff' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
