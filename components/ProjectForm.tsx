'use client';

import React, { useState } from 'react';

type Props = {
  onCreated?: () => void;
};

export default function ProjectForm({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);

  const updateMember = (idx: number, value: string) => {
    const copy = [...teamMembers];
    copy[idx] = value;
    setTeamMembers(copy);
  };

  const addMember = () => setTeamMembers((s) => [...s, '']);
  const removeMember = (idx: number) => setTeamMembers((s) => s.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          deadline,
          teamMembers: teamMembers.filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setName('');
      setDeadline('');
      setTeamMembers(['']);
      alert('✅ Project submitted successfully');
      onCreated?.();
    } catch (err: any) {
      alert('❌ ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-md shadow-sm border border-gray-200"
    >
      <h2 className="text-lg font-semibold">Create New Project</h2>

      <div>
        <label className="block text-sm font-medium">Project Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Deadline</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Team Members</label>
        <div className="space-y-2 mt-2">
          {teamMembers.map((m, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={m}
                onChange={(e) => updateMember(idx, e.target.value)}
                placeholder="Member name"
                className="flex-1 rounded-md border px-3 py-2"
              />
              {teamMembers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(idx)}
                  className="px-3 text-sm text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addMember} className="text-sm text-green-600">
            + Add member
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-[#780606] text-white px-4 py-2 hover:bg-green-700 transition"
        >
          {submitting ? 'Submitting...' : 'Submit Project'}
        </button>
      </div>
    </form>
  );
}
