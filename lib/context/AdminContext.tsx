'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in on mount
    const adminToken = Cookies.get('adminToken');
    if (adminToken) {
      setIsAdmin(true);
    }
  }, []);

  const login = async (password: string) => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      Cookies.set('adminToken', 'true', { expires: 7 }); // Expires in 7 days
      localStorage.setItem('adminToken', 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    Cookies.remove('adminToken');
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 