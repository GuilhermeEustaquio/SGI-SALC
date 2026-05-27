import { useMemo, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [session, setSession] = useState<any>(() => JSON.parse(localStorage.getItem('session') || 'null'));
  const isAuthenticated = useMemo(() => !!token, [token]);
  const login = (accessToken: string, sessionData: any) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('session', JSON.stringify(sessionData));
    setToken(accessToken); setSession(sessionData);
  };
  const logout = () => { localStorage.clear(); setToken(null); setSession(null); };
  return { token, session, isAuthenticated, login, logout };
}
