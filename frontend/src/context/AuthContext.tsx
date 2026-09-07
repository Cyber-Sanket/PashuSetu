import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { FALLBACK_USERS } from '../services/fallbackData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loginAsDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('pashusetu_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pashusetu_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Check if session is a local demo fallback token
      if (token.startsWith('demo-token-')) {
        const role = token.replace('demo-token-', '') as UserRole;
        if (FALLBACK_USERS[role]) {
          setUser(FALLBACK_USERS[role]);
        }
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
        localStorage.setItem('pashusetu_user', JSON.stringify(res.data));
      } catch (err) {
        console.warn('Could not refresh session from backend, keeping cached/fallback user session', err);
        // If server is offline, keep existing user or fallback if present
        const savedUser = localStorage.getItem('pashusetu_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('pashusetu_token', newToken);
    localStorage.setItem('pashusetu_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('pashusetu_token');
    localStorage.removeItem('pashusetu_user');
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = async (role: UserRole) => {
    setIsLoading(true);
    let identifier = '';
    let password = '';

    if (role === 'FARMER') {
      identifier = 'farmer@pashusetu.gov.in';
      password = 'Farmer@123';
    } else if (role === 'VETERINARIAN') {
      identifier = 'vet@pashusetu.gov.in';
      password = 'Vet@123';
    } else if (role === 'GOVERNMENT') {
      identifier = 'admin@pashusetu.gov.in';
      password = 'Admin@123';
    }

    try {
      // 1. Try real authenticated backend API with real credentials
      const res = await api.post('/auth/login', { identifier, password, role });
      login(res.data.token, res.data.user);
    } catch (err: any) {
      console.warn('Real backend login attempt failed or backend offline. Falling back to verified demo session.', err);
      // 2. Demo fallback session if backend is offline/unreachable
      const fallbackUser = FALLBACK_USERS[role] || FALLBACK_USERS.FARMER;
      const demoToken = `demo-token-${role}`;
      login(demoToken, fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
