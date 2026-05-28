import { useMemo } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const isValid = authService.validateLocalSession();
  const session = isValid ? authService.getSession() : null;
  const token = isValid ? authService.getToken() : null;
  const isAuthenticated = useMemo(() => !!token && !!session, [token, session]);

  return {
    session,
    token,
    isAuthenticated,
    logout: authService.logout,
  };
}
