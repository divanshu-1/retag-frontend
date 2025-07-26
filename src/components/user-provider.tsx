
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Address = {
  _id?: string;
  name: string;
  phone: string;
  pincode: string;
  house: string;
  area: string;
  isDefault?: boolean;
};

export type User = {
  id?: string;
  email: string;
  name?: string;
  displayName?: string;
  avatar?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: Date;
  googleId?: string;
  addresses?: Address[];
};

export type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (details: Partial<User>) => void;
  loginWithToken: (token: string) => Promise<void>;
  fetchAddresses: () => Promise<Address[]>;
  addAddress: (address: Omit<Address, '_id'>) => Promise<Address[]>;
};

export const UserContext = createContext<UserContextType | null>(null);

// Token management functions
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  // Try both keys for compatibility
  return localStorage.getItem('token') || localStorage.getItem('auth_token');
};

const setStoredToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
  }
};

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

const setStoredUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('user_data', JSON.stringify(user));
  } else {
    localStorage.removeItem('user_data');
  }
};

import { getBackendUrl } from '@/lib/backend-url';

// JWT token validation and user extraction
const validateToken = async (token: string): Promise<User | null> => {
  try {
    const response = await fetch(`${getBackendUrl()}/auth/protected`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    return null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from stored token on mount
  useEffect(() => {
    const initializeUser = async () => {
      const token = getStoredToken();
      if (token) {
        const userData = await validateToken(token);
        if (userData) {
          setUser(userData);
          setStoredUser(userData);
        } else {
          // Token is invalid, clear it
          setStoredToken(null);
          setStoredUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  // Handle hash changes for OAuth callback and QR code auto-login
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const search = window.location.search;

      // Check for OAuth token in hash
      const tokenMatch = hash.match(/#token=([^&]+)/);
      const errorMatch = hash.match(/#auth-error=([^&]+)/);

      // Check for QR code token in URL parameters
      const urlParams = new URLSearchParams(search);
      const qrToken = urlParams.get('token');

      if (tokenMatch) {
        const token = tokenMatch[1];
        loginWithToken(token);
        // Clear the hash
        window.location.hash = '';
      } else if (qrToken) {
        // Handle QR code auto-login
        loginWithToken(qrToken);
        // Clean up URL by removing token parameter
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      } else if (errorMatch) {
        const error = errorMatch[1];
        console.error('Authentication error:', error);
        // Clear the hash
        window.location.hash = '';
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
    try {
      const userData = await validateToken(token);
      if (userData) {
        setUser(userData);
        setStoredToken(token);
        setStoredUser(userData);
        // Always update both keys for compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userData));
        }
        console.log('Successfully logged in with token');
      } else {
        console.error('Invalid token provided');
      }
    } catch (error) {
      console.error('Error logging in with token:', error);
    }
  }, []);

  const login = useCallback((email: string) => {
    // This is for local login - for Google OAuth, use loginWithToken
    const existingUser = getStoredUser();
    const currentUser = existingUser || { email };
    setUser(currentUser);
    setStoredUser(currentUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStoredToken(null);
    setStoredUser(null);
    // Clear all localStorage/sessionStorage for safety
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      sessionStorage.clear();
    }
  }, []);

  const updateProfile = useCallback(async (details: Partial<User>) => {
    const token = getStoredToken();
    if (!token) return;
    try {
      const response = await fetch(`${getBackendUrl()}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setStoredUser(data.user);
      } else {
        // Optionally handle error
        console.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  }, []);

  const fetchAddresses = useCallback(async (): Promise<Address[]> => {
    const token = getStoredToken();
    if (!token) return [];
    try {
      const response = await fetch(`${getBackendUrl()}/api/user/addresses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const addresses = await response.json();
        return addresses;
      } else {
        console.error('Failed to fetch addresses');
        return [];
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      return [];
    }
  }, []);

  const addAddress = useCallback(async (address: Omit<Address, '_id'>): Promise<Address[]> => {
    const token = getStoredToken();
    if (!token) return [];
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/user/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });
      if (response.ok) {
        const addresses = await response.json();
        // Update user with new addresses
        if (user) {
          const updatedUser = { ...user, addresses };
          setUser(updatedUser);
          setStoredUser(updatedUser);
        }
        return addresses;
      } else {
        console.error('Failed to add address');
        return [];
      }
    } catch (err) {
      console.error('Error adding address:', err);
      return [];
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>; // You might want to show a proper loading spinner
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updateProfile,
        loginWithToken,
        fetchAddresses,
        addAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
