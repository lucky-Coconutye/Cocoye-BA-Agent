import React, { createContext, useContext } from 'react';

const NoCodeSDKContext = createContext({ isReady: true });

export const useNoCodeSDK = () => useContext(NoCodeSDKContext);

export const NoCodeProvider = ({ children }) => (
  <NoCodeSDKContext.Provider value={{ isReady: true }}>
    {children}
  </NoCodeSDKContext.Provider>
);
