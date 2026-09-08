import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Task} from '../types/Task';
import {TokenType} from '../types/TokensType';

export const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api'
    : 'http://127.0.0.1:8000/api';

export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

let accessTokenMemory: string | null = null;
let refreshTokenMemory: string | null = null;
let onAuthFailure: (() => void) | null = null;

export const setAuthTokens = (
  access: string | null,
  refresh: string | null,
) => {
  accessTokenMemory = access;
  refreshTokenMemory = refresh;
};

export const setOnAuthFailure = (cb: (() => void) | null) => {
  onAuthFailure = cb;
};

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const parseError = async (response: Response, fallback: string) => {
  try {
    const data = await response.json();
    if (typeof data === 'string') {
      return data;
    }
    if (data.detail) {
      return String(data.detail);
    }
    const first = Object.values(data)[0];
    if (Array.isArray(first)) {
      return String(first[0]);
    }
    if (first) {
      return String(first);
    }
  } catch {
    // ignore non-JSON
  }
  return fallback;
};

async function refreshAccess(): Promise<string> {
  if (!refreshTokenMemory) {
    throw new AuthError();
  }
  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({refresh: refreshTokenMemory}),
  });
  if (!response.ok) {
    throw new AuthError();
  }
  const data: TokenType = await response.json();
  accessTokenMemory = data.access;
  if (data.refresh) {
    refreshTokenMemory = data.refresh;
    await AsyncStorage.setItem('refreshToken', data.refresh);
  }
  await AsyncStorage.setItem('accessToken', data.access);
  return data.access;
}

async function authedFetch(
  url: string,
  init: RequestInit = {},
  retry = true,
): Promise<Response> {
  const token = accessTokenMemory;
  if (!token) {
    throw new AuthError();
  }
  const headers = {
    ...(init.headers as Record<string, string> | undefined),
    ...authHeaders(token),
  };
  const response = await fetch(url, {...init, headers});
  if (response.status === 401 && retry) {
    try {
      await refreshAccess();
      return authedFetch(url, init, false);
    } catch {
      onAuthFailure?.();
      throw new AuthError();
    }
  }
  return response;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await authedFetch(`${API_URL}/tasks/`);
  if (!response.ok) {
    throw new Error(await parseError(response, `HTTP ${response.status}`));
  }
  return response.json();
};

export const createTask = async (
  title: string,
  description: string,
): Promise<Task> => {
  const response = await authedFetch(`${API_URL}/tasks/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      title,
      description,
      completed: false,
    }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, `HTTP ${response.status}`));
  }
  return response.json();
};

export const updateTask = async (
  id: number,
  patch: Partial<Pick<Task, 'title' | 'description' | 'completed'>>,
): Promise<Task> => {
  const response = await authedFetch(`${API_URL}/tasks/${id}/`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(patch),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, `HTTP ${response.status}`));
  }
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await authedFetch(`${API_URL}/tasks/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(await parseError(response, `HTTP ${response.status}`));
  }
};

export const loginAPI = async (
  username: string,
  password: string,
): Promise<TokenType> => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password}),
  });
  if (!response.ok) {
    throw new Error('Wrong login or password');
  }
  return response.json();
};

export const register = async (
  username: string,
  password: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password}),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, 'Registration failed'));
  }
};
