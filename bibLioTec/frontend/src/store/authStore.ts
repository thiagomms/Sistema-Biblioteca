import { create } from 'zustand';
import { AuthState, User } from '../types';
import { api } from '../services/api';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  get token() {
    return localStorage.getItem('token') || '';
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true });
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      set({ user: null, isAuthenticated: false });
      return false;
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  }
}));

// Função para inicializar o estado de autenticação da sessão armazenada
export const initAuth = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as User;
      useAuthStore.setState({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Falha ao inicializar estado de autenticação:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
};