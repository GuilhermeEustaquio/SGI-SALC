import { api } from './api';

export const TOKEN_KEY = 'sgi_salc_token';
export const SESSION_KEY = 'sgi_salc_session';

type SessionData = {
  is_super_admin?: boolean;
  perfis?: string[];
  deve_trocar_senha?: boolean;
  [key: string]: unknown;
};

export const authService = {
  login: async (payload: { uasg?: string; login: string; senha: string }) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    return data;
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getSession: (): SessionData | null => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setSession: (session: SessionData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  changePassword: ({ senhaAtual, novaSenha }: { senhaAtual: string; novaSenha: string }) =>
    api.post('/auth/change-password', { senha_atual: senhaAtual, nova_senha: novaSenha }),
};
