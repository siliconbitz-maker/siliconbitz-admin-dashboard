'use client';

import React, { useEffect, useState } from 'react';
import ProjectForm from '../../../components/ProjectForm';
import ProjectsTable from '../../../components/ProjectsTable';

type User = { id: string; name: string; email: string } | null;
type Project = {
  id: string;
  name: string;
  deadline: string;
  teamMembers: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectsPage() {
  const [user, setUser] = useState<User>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/me');
      const json = await res.json();
      setUser(json.user);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/projects');
      const json = await res.json();
      setProjects(json.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMe(), fetchProjects()]).finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    await fetchProjects();
  };

  return (
    <div
      className="min-h-screen p-4 md:p-10"
      style={{ backgroundColor: '#f5f6f7' }}
    >
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-6 md:p-10"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: '#023E8A' }}
          >
            Projects
          </h1>

          {user?.email === 'admin@siliconbitz.com' && (
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition"
              style={{ backgroundColor: '#0077B6' }}
            >
              Refresh
              {refreshing && (
                <span
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
              )}
            </button>
          )}
        </div>

        {/* Admin Project Form */}
        {user?.email === 'admin@siliconbitz.com' && (
          <div className="mb-6">
            <ProjectForm onCreated={refresh} />
          </div>
        )}

        {user?.email !== 'admin@siliconbitz.com' && (
          <p style={{ color: '#495057', marginBottom: '16px' }}>
            All Projects Details
          </p>
        )}

        {/* Projects Table */}
        <div className="relative">
          {loading && (
            <div
              className="absolute inset-0 flex items-center justify-center z-50"
              style={{ backgroundColor: '#00000050' }}
            >
              <div
                className="w-12 h-12 border-4 border-[#0077B6] border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
          )}

          <ProjectsTable
            projects={projects}
            onRefresh={refresh}
            isAdmin={user?.email === 'admin@siliconbitz.com'}
          />
        </div>
      </div>
    </div>
  );
}
