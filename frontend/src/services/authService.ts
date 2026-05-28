import { api } from './api';

export const TOKEN_KEY = 'sgi_salc_token';
export const SESSION_KEY = 'sgi_salc_session';
export const AUTH_VERSION_KEY = 'sgi_salc_auth_version';
const AUTH_VERSION = 'v2';
const LEGACY_KEYS = ['token', 'access_token', 'auth', 'user', 'session'];

export type SessionData = {
  user_id: number;
  login: string;
  nome: string;
  is_super_admin: boolean;
  uasg_atual: { id: number; codigo: string; nome: string } | null;
  perfis: string[];
  deve_trocar_senha: boolean;
};

const isValidSession = (session: unknown): session is SessionData => {
  if (!session || typeof session !== 'object') return false;
  const s = session as Record<string, unknown>;
  return typeof s.login === 'string' && typeof s.nome === 'string' && typeof s.is_super_admin === 'boolean' && Array.isArray(s.perfis) && typeof s.deve_trocar_senha === 'boolean';
};

const clearLegacyKeys = () => LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));

export const authService = {
  login: async (payload: { uasg?: string; login: string; senha: string }) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    localStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION);
    clearLegacyKeys();
    return data;
  },

  logout: () => {
    authService.clearSession();
    window.location.replace('/login');
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(AUTH_VERSION_KEY);
    clearLegacyKeys();
    sessionStorage.clear();
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getSession: (): SessionData | null => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return isValidSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  setSession: (session: SessionData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION);
  },

  validateLocalSession: () => {
    const version = localStorage.getItem(AUTH_VERSION_KEY);
    const token = authService.getToken();
    const session = authService.getSession();
    if (version !== AUTH_VERSION || !token || !session || !isValidSession(session)) {
      authService.clearSession();
      return false;
    }
    return true;
  },

  changePassword: ({ senhaAtual, novaSenha }: { senhaAtual: string; novaSenha: string }) => api.post('/auth/change-password', { senha_atual: senhaAtual, nova_senha: novaSenha }),
};
