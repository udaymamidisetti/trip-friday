// UserContext.js
import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider
      value={{ selectedUser, setSelectedUser, userDetails, setUserDetails }}
    >
      {children}
    </UserContext.Provider>
  );
};
