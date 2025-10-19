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
    <div className="bg-white rounded-md shadow-sm p-4 border border-gray-200">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="pb-2">Name</th>
            <th className="pb-2">Team</th>
            <th className="pb-2">Deadline</th>
            <th className="pb-2">Created By</th>
            <th className="pb-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-3">{p.name}</td>
              <td className="py-3">{p.teamMembers}</td>
              <td className="py-3">
                <div className="flex flex-col">
                  <span>{formatCountdown(p.deadline)}</span>
                  <span className="text-sm text-gray-500">{new Date(p.deadline).toLocaleString()}</span>
                </div>
              </td>
              <td className="py-3">{p.createdBy}</td>
              <td className="py-3 text-right">
                {isAdmin ? (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingProject(p)}
                      className="px-3 py-1 rounded border hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 rounded bg-red-500 text-[#780606] hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="text-sm px-3 rounded text-white py-1  bg-[#008000] text-muted-foreground">Assign</span>
                )}
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                No projects yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#FFD9D9] bg-opacity-40">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-semibold">Edit Project</h3>

            <div>
              <label className="block text-sm font-medium">Project Name</label>
              <input
                value={editingProject.name}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Deadline</label>
              <input
                type="datetime-local"
                value={editingProject.deadline.slice(0, 16)}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, deadline: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Team Members (comma separated)</label>
              <textarea
                value={editingProject.teamMembers}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, teamMembers: e.target.value })
                }
                rows={2}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#780606] text-white hover:bg-green-700"
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
