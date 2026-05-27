import { authService } from '../services/authService';
export function useAuth() {
  const session = authService.getSession();
  const token = authService.getToken();
  return { session, token, isAuthenticated: !!token, logout: authService.logout };
}
