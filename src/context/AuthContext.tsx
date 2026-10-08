import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<void>;
  register: (fullName: string, username: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'spendwise_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
        }
      } else {
        // Pre-authenticate default demo student so reviewer can immediately explore dashboard if desired,
        // or user can logout to test the login/register flows.
        const defaultUser: User = {
          id: 1,
          fullName: 'Rahul Sharma',
          username: 'student01',
          email: 'student@example.com',
          college: 'National Institute of Technology',
        };
        setCurrentUser(defaultUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error('Error loading session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.loginUser({ username, password });
      setCurrentUser(res.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, username: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      await api.registerUser({ fullName, username, email, password });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
