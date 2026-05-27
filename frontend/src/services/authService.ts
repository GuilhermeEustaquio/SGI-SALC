import { api } from './api';
export const authService = {
  login: (payload: { uasg?: string; login: string; senha: string }) => api.post('/auth/login', payload),
  changePassword: (payload: { senha_atual: string; nova_senha: string }) => api.post('/auth/change-password', payload),
};
