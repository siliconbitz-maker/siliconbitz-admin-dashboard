'use client';

import { useEffect, useState } from 'react';
import { FiTrash2, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    if (data.users) setUsers(data.users);
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    const confirmed = confirm('⚠️ Are you sure you want to delete this user?');
    if (!confirmed) return;

    const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!data.error) {
      alert('✅ User deleted successfully');
      fetchUsers();
    } else {
      alert(`❌ ${data.error}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f6f7' }}>
      <div
        className="max-w-7xl mx-auto my-10 p-6 rounded-2xl shadow-lg"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: '#1f2937' }}
          >
            User Management
          </h1>
          <p style={{ color: '#6b7280' }}>
            Total Users:{' '}
            <span className="font-semibold" style={{ color: '#0072ff' }}>
              {users.length}
            </span>
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="min-w-full border-collapse w-full"
            style={{ borderColor: '#d1d5db' }}
          >
            <thead>
              <tr style={{ backgroundColor: '#e5e7eb' }}>
                <th className="p-3 text-left text-sm font-semibold" style={{ color: '#374151' }}>
                  Name
                </th>
                <th className="p-3 text-left text-sm font-semibold" style={{ color: '#374151' }}>
                  Email
                </th>
                <th className="p-3 text-left text-sm font-semibold" style={{ color: '#374151' }}>
                  Created At
                </th>
                <th className="p-3 text-center text-sm font-semibold" style={{ color: '#374151' }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center p-6" style={{ color: '#6b7280' }}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-6" style={{ color: '#9ca3af' }}>
                    No users found 😕
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t"
                    style={{
                      borderColor: '#e5e7eb',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-base font-medium" style={{ color: '#1f2937' }}>
                        <FiUser color="#3b82f6" /> {user.name}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2" style={{ color: '#374151' }}>
                        <FiMail color="#10b981" /> {user.email}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                        <FiCalendar color="#f59e0b" />
                        {new Date(user.createdAt).toLocaleDateString()} •{' '}
                        {new Date(user.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-transform hover:scale-105"
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                        }}
                      >
                        <FiTrash2 className="inline-block mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
