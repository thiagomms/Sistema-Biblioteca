import type { User } from './types/index';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
} 