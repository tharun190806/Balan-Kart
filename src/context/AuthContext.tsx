import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { authApi } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  adminUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  adminLogout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from tokens
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userToken = localStorage.getItem('balan_token');
        const adminToken = localStorage.getItem('balan_admin_token');

        if (userToken) {
          try {
            const res = await authApi.getMe(userToken);
            setUser(res.user);
          } catch (e) {
            localStorage.removeItem('balan_token');
          }
        }

        if (adminToken) {
          try {
            const res = await authApi.getMe(adminToken);
            if (res.user.role === 'admin') {
              setAdminUser(res.user);
            } else {
              localStorage.removeItem('balan_admin_token');
            }
          } catch (e) {
            localStorage.removeItem('balan_admin_token');
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('balan_token', res.token);
    setUser(res.user);
  };

  const register = async (userData: any) => {
    const res = await authApi.register(userData);
    localStorage.setItem('balan_token', res.token);
    setUser(res.user);
  };

  const adminLogin = async (email: string, password: string) => {
    const res = await authApi.adminLogin({ email, password });
    localStorage.setItem('balan_admin_token', res.token);
    setAdminUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('balan_token');
    setUser(null);
  };

  const adminLogout = () => {
    localStorage.removeItem('balan_admin_token');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isLoading,
        login,
        register,
        adminLogin,
        logout,
        adminLogout,
        isAuthenticated: !!user,
        isAdmin: !!adminUser && adminUser.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
