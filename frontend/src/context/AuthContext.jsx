import React, { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ role: 'GUEST' }); // Roles: GUEST, MEMBER, ADMIN

  const login = (code) => {
    if (code === "0000") setUser({ role: 'ADMIN', name: 'Council Member' });
    else if (code === "1111") setUser({ role: 'MEMBER', name: 'Guild Initiate' });
    else return false;
    return true;
  };

  const logout = () => setUser({ role: 'GUEST' });

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};