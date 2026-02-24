import React, { createContext, useContext, type ReactNode } from 'react';
import { useMe, useLogout } from './user/UserApi';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'DEPARTMENT_ADMIN' | 'SYSTEM_ADMIN';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSystemAdmin: boolean;
  isDeptAdmin: boolean;
  isUser: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }

  return null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const token = getCookie('access_token');
  const { data: user, isLoading, isFetching } = useMe(!!token);
  const { mutate: logoutMutation } = useLogout();
  const queryClient = useQueryClient();

  const logout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        // Clear query cache
        queryClient.setQueryData(['me'], null);
        queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success("Logged out successfully");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Logout failed");
      }
    });
  };

  const value = {
    user: user || null,
    isLoading: !!token && (isLoading || isFetching),
    isAuthenticated: !!user,
    isSystemAdmin: user?.role === 'SYSTEM_ADMIN',
    isDeptAdmin: user?.role === 'DEPARTMENT_ADMIN',
    isUser: user?.role === 'USER',
    logout,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
