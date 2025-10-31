// src/services/adminApi.ts

import type { User } from '../types/User';


const API_URL = 'http://localhost:8000/api/admin';

function getToken() {
  return localStorage.getItem('token'); // You may use context for more advanced JWT handling
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  return request<User[]>(`${API_URL}/users`);
}

export async function suspendUser(userId: string): Promise<User> {
  return request<User>(`${API_URL}/users/${userId}/suspend`, { method: 'POST' });
}

export async function reactivateUser(userId: string): Promise<User> {
  return request<User>(`${API_URL}/users/${userId}/reactivate`, { method: 'POST' });
}

export async function makeAdmin(userId: string): Promise<User> {
  return request<User>(`${API_URL}/users/${userId}/make-admin`, { method: 'POST' });
}

export async function revokeAdmin(userId: string): Promise<User> {
  return request<User>(`${API_URL}/users/${userId}/revoke-admin`, { method: 'DELETE' });
}

export async function getUserDetails(userId: string): Promise<User> {
  return request<User>(`${API_URL}/users/${userId}`);
}

export async function getUserStats(): Promise<Record<string, number>> {
  return request<Record<string, number>>(`${API_URL}/users/stats`);
}

