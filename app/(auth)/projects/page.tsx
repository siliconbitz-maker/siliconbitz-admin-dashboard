// app/projects/page.tsx
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

  const fetchMe = async () => {
    const res = await fetch('/api/me');
    const json = await res.json();
    setUser(json.user);
  };

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const json = await res.json();
    setProjects(json.projects || []);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMe(), fetchProjects()]).finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    await fetchProjects();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>

      {user?.email === 'admin@siliconbitz.com' ? (
        <div className="mb-6">
          <ProjectForm onCreated={refresh} />
        </div>
      ) : (
        <div className="mb-4 text-sm text-muted-foreground">All Projects Details</div>
      )}

      <ProjectsTable
        projects={projects}
        onRefresh={refresh}
        isAdmin={user?.email === 'admin@siliconbitz.com'}
      />
      {loading && <div className="mt-4">Loading...</div>}
    </div>
  );
}
