export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export interface User {
  _id: string;
  email: string;
  name?: string;
  roles: string[];
  provider?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Login failed');
  }

  return (await res.json()) as { accessToken: string };
}

export async function register(email: string, password: string, name?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Registration failed');
  }

  return (await res.json()) as { accessToken: string; user: User };
}

export async function fetchMe(token: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load profile');
  }

  return (await res.json()) as User;
}

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`;
}

export function getFacebookAuthUrl() {
  return `${API_BASE_URL}/auth/facebook`;
}

export function getLinkedinAuthUrl() {
  return `${API_BASE_URL}/auth/linkedin`;
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Failed to request reset link');
  }

  return (await res.json()) as { message: string; token?: string };
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Failed to reset password');
  }

  return (await res.json()) as { message: string };
}

export async function fetchUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Failed to load users');
  }

  return (await res.json()) as User[];
}

export async function updateUser(
  token: string,
  id: string,
  body: { name?: string; roles?: string[]; isActive?: boolean },
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'Failed to update user');
  }

  return (await res.json()) as User;
}

