import { api } from './api';

export const TOKEN_KEY = 'sgi_salc_token';
export const SESSION_KEY = 'sgi_salc_session';

export const authService = {
  login: async (payload: { uasg?: string; login: string; senha: string }) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    return data;
  },
  changePassword: (payload: { senha_atual: string; nova_senha: string }) => api.post('/auth/change-password', payload),
  getSession: () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  logout: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(SESSION_KEY); },
};
