// src/hooks/useAdminUsers.ts

import { useCallback, useEffect, useState } from 'react';
import type { User } from '../types/User';

import { fetchUsers, suspendUser, reactivateUser, makeAdmin, revokeAdmin } from '../services/adminApi';

interface UseAdminUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  suspend: (userId: string) => Promise<void>;
  reactivate: (userId: string) => Promise<void>;
  makeAdmin: (userId: string) => Promise<void>;
  revokeAdmin: (userId: string) => Promise<void>;
}

export function useAdminUsers(): UseAdminUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function wrapper(action: (id: string) => Promise<User | void>, userId: string) {
    setLoading(true);
    try {
      await action(userId);
      refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return {
    users,
    loading,
    error,
    refresh,
    suspend: userId => wrapper(suspendUser, userId),
    reactivate: userId => wrapper(reactivateUser, userId),
    makeAdmin: userId => wrapper(makeAdmin, userId),
    revokeAdmin: userId => wrapper(revokeAdmin, userId),
  };
}
