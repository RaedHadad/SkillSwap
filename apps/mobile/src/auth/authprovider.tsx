import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, registerGetToken } from '../api/client';
import type { User } from '../types';

type AuthCtx = {
  token: string | null;
  me: User | null;
  loading: boolean;
  onboardingNeeded: boolean;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  refreshMe(): Promise<void>;
  updateMe(patch: Partial<User>): Promise<void>;
  logout(): Promise<void>;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  registerGetToken(async () => token);

  useEffect(() => { (async () => {
    const t = await SecureStore.getItemAsync('jwt');
    setToken(t);
    setLoading(false);
    if (t) await refreshMe().catch(() => {});
  })(); }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    await SecureStore.setItemAsync('jwt', json.token);
    setToken(json.token);
    await refreshMe().catch(()=>{});
  }

  async function register(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    await login(email, password);
  }

  async function refreshMe() {
    // requires GET /me in API; until then, synthesize minimal user
    try {
      const data = await api('/me');
      setMe(data);
    } catch {
      // fallback: minimal user so UI works
      setMe(m => m ?? { id: 'me', name: 'You', email: 'unknown', skillsTeach: [], skillsLearn: [] });
    }
  }

  async function updateMe(patch: Partial<User>) {
    try {
      const data = await api('/me', { method: 'PUT', body: JSON.stringify(patch) });
      setMe(data);
    } catch (e) {
      // optimistic local merge so you can see changes even before API exists
      setMe(prev => ({ ...(prev as User), ...(patch as User) }));
      throw e;
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync('jwt');
    setToken(null);
    setMe(null);
  }

  const onboardingNeeded = !!token && !!me && (me.skillsTeach?.length ?? 0) === 0 && (me.skillsLearn?.length ?? 0) === 0;

  return (
    <Ctx.Provider value={{ token, me, loading, onboardingNeeded, login, register, refreshMe, updateMe, logout }}>
      {children}
    </Ctx.Provider>
  );
}
