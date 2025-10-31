// src/pages/AdminUsersPage.tsx

import React from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';

export default function AdminUsersPage() {
  const { users, loading, error, suspend, reactivate, makeAdmin, revokeAdmin } = useAdminUsers();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin User Management</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="py-10 text-gray-500">Loading...</div>
      ) : (
        <table className="min-w-full border rounded shadow bg-white">
          <thead>
            <tr>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Username</th>
              <th className="p-2 border-b">Admin</th>
              <th className="p-2 border-b">Active</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.username || '-'}</td>
                <td className="p-2">{user.is_admin ? <span className="text-green-600">Admin</span> : 'User'}</td>
                <td className="p-2">{user.is_active ? <span className="text-green-600">Active</span> : <span className="text-red-600">Suspended</span>}</td>
                <td className="p-2 space-x-2">
                  {user.is_active ? (
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => suspend(user.id)}
                      disabled={user.is_admin}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => reactivate(user.id)}
                    >
                      Reactivate
                    </button>
                  )}
                  {user.is_admin ? (
                    <button
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      onClick={() => revokeAdmin(user.id)}
                      disabled={!user.is_active}
                    >
                      Revoke Admin
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => makeAdmin(user.id)}
                      disabled={!user.is_active}
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


