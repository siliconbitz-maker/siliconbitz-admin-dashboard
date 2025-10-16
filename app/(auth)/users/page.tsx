'use client';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (data.users) setUsers(data.users);
  };

  const deleteUser = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.error) fetchUsers();
    else alert(data.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Created At</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{new Date(user.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <button
                  className="bg-[#ff0000] text-white px-2 py-1 rounded"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
