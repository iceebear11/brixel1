'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('materiqo_token');
    const savedUser = localStorage.getItem('materiqo_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('materiqo_token', authToken);
    localStorage.setItem('materiqo_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('materiqo_token');
    localStorage.removeItem('materiqo_user');
  };

  const getAuthHeaders = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  const updateUser = (updatedUserData) => {
    const newData = { ...user, ...updatedUserData };
    setUser(newData);
    localStorage.setItem('materiqo_user', JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, getAuthHeaders, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
