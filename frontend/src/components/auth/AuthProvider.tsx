// src/components/auth/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// User data type
interface User {
  id: string;
  username?: string;
  full_name?: string;
  name?: string;
  email: string;
  role: string;
}

// Context data to share in the app
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkTokenValidity: () => Promise<boolean>;
}

// Create Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  checkTokenValidity: async () => false,
});

// Hook for using Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user data from localStorage when component loads
  useEffect(() => {
    setIsLoading(true);
    
    // Check if in browser
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (storedUser && token && isLoggedIn) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  // Check token validity
  const checkTokenValidity = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      // Check if token is expired
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Token is invalid or expired
        logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  // Login function
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  // Check token every 5 minutes
  useEffect(() => {
    if (user) {
      const tokenCheckInterval = setInterval(() => {
        checkTokenValidity();
      }, 5 * 60 * 1000);
      
      return () => {
        clearInterval(tokenCheckInterval);
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkTokenValidity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}