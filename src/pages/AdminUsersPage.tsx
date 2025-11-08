import React, { useEffect, useState } from 'react';
import {
  fetchUsers,
  suspendUser,
  reactivateUser,
  makeAdmin,
  revokeAdmin,
  inviteAdmin,
  bulkActions,
} from '../services/adminApi';

interface User {
  id: string;
  email: string;
  username?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at?: string;
  last_login?: string;
}

function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  async function refetch() {
    setLoading(true);
    setError(undefined);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load users');
    }
    setLoading(false);
  }

  useEffect(() => { refetch(); }, []);

  async function handleSuspend(id: string) { await suspendUser(id); refetch(); }
  async function handleReactivate(id: string) { await reactivateUser(id); refetch(); }
  async function handleMakeAdmin(id: string) { await makeAdmin(id); refetch(); }
  async function handleRevokeAdmin(id: string) { await revokeAdmin(id); refetch(); }
  async function handleInvite(email: string) { await inviteAdmin(email); refetch(); }
  async function handleBulkActions(action: string, ids: string[]) { await bulkActions(action, ids); refetch(); }

  return {
    users, loading, error,
    suspend: handleSuspend,
    reactivate: handleReactivate,
    makeAdmin: handleMakeAdmin,
    revokeAdmin: handleRevokeAdmin,
    inviteAdmin: handleInvite,
    bulkActions: handleBulkActions,
  };
}

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    suspend,
    reactivate,
    makeAdmin,
    revokeAdmin,
    inviteAdmin,
    bulkActions,
  } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: string, user?: User } | null>(null);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedUserIds(e.target.checked ? filteredUsers.map(u => u.id) : []);
  }

  function handleUserSelect(id: string, checked: boolean) {
    setSelectedUserIds(checked
      ? [...selectedUserIds, id]
      : selectedUserIds.filter(uid => uid !== id)
    );
  }

  function handleBulkAction(action: 'suspend' | 'reactivate' | 'makeAdmin' | 'revokeAdmin') {
    if (selectedUserIds.length > 0) {
      bulkActions(action, selectedUserIds);
      setSelectedUserIds([]);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin User Management</h1>
      <div className="flex gap-2 mb-4 items-center">
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setShowInvite(true)}
        >
          Invite Admin
        </button>
      </div>
      {selectedUserIds.length > 0 && (
        <div className="mb-2 flex gap-2 items-center">
          <span>{selectedUserIds.length} selected:</span>
          <button onClick={() => handleBulkAction('suspend')} className="px-2 py-1 bg-yellow-500 text-white rounded">Suspend</button>
          <button onClick={() => handleBulkAction('reactivate')} className="px-2 py-1 bg-green-500 text-white rounded">Reactivate</button>
          <button onClick={() => handleBulkAction('makeAdmin')} className="px-2 py-1 bg-blue-500 text-white rounded">Make Admin</button>
          <button onClick={() => handleBulkAction('revokeAdmin')} className="px-2 py-1 bg-gray-500 text-white rounded">Revoke Admin</button>
        </div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="py-10 text-gray-500">Loading...</div>
      ) : (
        <table className="min-w-full border rounded shadow bg-white">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0} onChange={handleSelectAll} /></th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Username</th>
              <th className="p-2 border-b">Admin</th>
              <th className="p-2 border-b">Active</th>
              <th className="p-2 border-b">Created</th>
              <th className="p-2 border-b">Last Login</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={e => handleUserSelect(user.id, e.target.checked)}
                  />
                </td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.username || '-'}</td>
                <td className="p-2">
                  {user.is_admin
                    ? <span className="inline-flex items-center gap-1 text-green-600"><b>●</b> Admin</span>
                    : <span className="inline-flex items-center gap-1 text-gray-600"><b>●</b> User</span>
                  }
                </td>
                <td className="p-2">
                  {user.is_active
                    ? <span className="inline-flex items-center gap-1 text-green-600"><b>●</b> Active</span>
                    : <span className="inline-flex items-center gap-1 text-red-600"><b>●</b> Suspended</span>
                  }
                </td>
                <td className="p-2">{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</td>
                <td className="p-2">{user.last_login ? new Date(user.last_login).toLocaleString() : '-'}</td>
                <td className="p-2 space-x-2">
                  {user.is_active ? (
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => setConfirmAction({ type: 'suspend', user })}
                      disabled={user.is_admin}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => setConfirmAction({ type: 'reactivate', user })}
                    >
                      Reactivate
                    </button>
                  )}
                  {user.is_admin ? (
                    <button
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      onClick={() => setConfirmAction({ type: 'revokeAdmin', user })}
                      disabled={!user.is_active}
                    >
                      Revoke Admin
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setConfirmAction({ type: 'makeAdmin', user })}
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
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded p-6 shadow max-w-md w-full">
            <p className="mb-4">
              {confirmAction.type === 'suspend' && <>Are you sure you want to <b>suspend</b> <i>{confirmAction.user?.email}</i>?</>}
              {confirmAction.type === 'reactivate' && <>Reactivate <i>{confirmAction.user?.email}</i>?</>}
              {confirmAction.type === 'makeAdmin' && <>Make <i>{confirmAction.user?.email}</i> an <b>admin</b>?</>}
              {confirmAction.type === 'revokeAdmin' && <>Revoke admin privileges for <i>{confirmAction.user?.email}</i>?</>}
            </p>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setConfirmAction(null)}>Cancel</button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => {
                  if (!confirmAction.user) return;
                  if (confirmAction.type === 'suspend') suspend(confirmAction.user.id);
                  if (confirmAction.type === 'reactivate') reactivate(confirmAction.user.id);
                  if (confirmAction.type === 'makeAdmin') makeAdmin(confirmAction.user.id);
                  if (confirmAction.type === 'revokeAdmin') revokeAdmin(confirmAction.user.id);
                  setConfirmAction(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showInvite && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded p-6 shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Invite New Admin</h2>
            <input
              type="email"
              placeholder="Admin Email"
              value={inviteEmail}
              className="px-2 py-1 border mb-4 w-full rounded"
              onChange={e => setInviteEmail(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setShowInvite(false)}>Cancel</button>
              <button className="px-3 py-1 bg-green-700 text-white rounded" disabled={!inviteEmail}
                onClick={() => { inviteAdmin(inviteEmail); setShowInvite(false); setInviteEmail(''); }}>
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
