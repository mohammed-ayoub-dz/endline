const API_BASE = 'http://127.0.0.1:8080/api';

let refreshPromise: Promise<string> | null = null;

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function setAccessToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('access_token', token);
  }
}

async function refreshAccessToken(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!res.ok) throw new Error('Refresh failed');
    
    const data = await res.json();
    if (!data.access_token) throw new Error('No access token');
    
    setAccessToken(data.access_token);
    return data.access_token;
  } catch (e) {
    setAccessToken(null);
    throw e;
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}, retry = true): Promise<any> {
  const makeRequest = () => {
    const token = getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    return fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  };

  let res = await makeRequest();

  if (res.status === 401 && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise; 
      res = await makeRequest(); 
    } catch (refreshError) {
      throw new Error('Session expired');
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const API = {
  register: (username: string, password: string) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }, false),
  
  login: async (username: string, password: string) => {
    const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }, false);
    setAccessToken(data.access_token);
    return data;
  },
  
  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' }, false);
    } finally {
      setAccessToken(null);
    }
  },
  getProfile: () => apiRequest('/protected/profile'),
  search: (query: string) => apiRequest(`/protected/videos/search?q=${encodeURIComponent(query)}`),
  saveVideo: (data: { title: string; description: string; url: string; thumbnail: string; subjectId: number }) =>
    apiRequest('/protected/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getLibrary: () => apiRequest('/protected/library'),

};