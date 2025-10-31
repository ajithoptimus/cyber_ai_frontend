// src/types/User.ts

export interface User {
  id: string;
  email: string;
  username?: string;
  is_active: boolean;
  is_admin: boolean;
  github_username?: string;
  google_id?: string;
  created_at?: string;
  updated_at?: string;
}

localStorage.getItem('token')