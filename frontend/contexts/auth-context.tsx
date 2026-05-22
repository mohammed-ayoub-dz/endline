
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API, setAccessToken } from '@/lib/api';

interface User {
  id: number;
  username: string;
  points: number;
  level: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const profile = await API.getProfile();
        if (mounted && profile.user) {
          setUser(profile.user);
        } else if (mounted && profile.user_id) {
          setUser({ id: profile.user_id, username: profile.username, points: 0, level: 'beginner' });
        }
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadUser();
    return () => { mounted = false; };
  }, []);

  const login = async (username: string, password: string) => {
    const data = await API.login(username, password);
    setUser(data.user);
  };

  const register = async (username: string, password: string) => {
    const data = await API.register(username, password);
    setAccessToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    await API.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};