
import React, { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';

const UserContext = createContext(null);



export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);