'use client';

import React, { useEffect, useState } from 'react';
import ProjectsTable from '../../../components/ProjectsTable';
import ProjectForm from '../../../components/ProjectForm';

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
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#023E8A]">Projects</h1>
        {user?.email === 'admin@siliconbitz.com' && (
          <button
            className="px-4 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#005F86] transition flex items-center justify-center"
            onClick={refresh}
          >
            Refresh
            {refreshing && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></span>
            )}
          </button>
        )}
      </div>

      {user?.email === 'admin@siliconbitz.com' ? (
        <div className="mb-6">
          <ProjectForm onCreated={refresh} />
        </div>
      ) : (
        <div className="mb-4 text-sm text-[#495057]">
          All Projects Details
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-[#00000050] flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-[#0077B6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <ProjectsTable
          projects={projects}
          onRefresh={refresh}
          isAdmin={user?.email === 'admin@siliconbitz.com'}
        />
      </div>
    </div>
  );
}
