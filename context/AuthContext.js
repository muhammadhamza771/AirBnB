import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const login = (response) => {
    // Response structure: { success: true, message: "Login success", user: { id, fullname, email, verfication_status } }
    if (response && response.success && response.user) {
      const userData = {
        id: response.user.id,
        fullname: response.user.fullname,
        email: response.user.email,
        verification_status: response.user.verfication_status || 'pending',
        role: 'guest' // Default role, aap ise badal sakte hain
      };
      
      setUser(userData);
      setIsLoggedIn(true);
      setIsHost(false); // Default guest
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsHost(false);
  };

  const switchToHost = () => {
    setIsHost(true);
    setUser(prev => {
      if (!prev) return { role: 'host' };
      return { ...prev, role: 'host' };
    });
  };

  const switchToGuest = () => {
    setIsHost(false);
    setUser(prev => {
      if (!prev) return { role: 'guest' };
      return { ...prev, role: 'guest' };
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      isHost,
      login,
      logout,
      setIsHost,
      switchToHost,
      switchToGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
};