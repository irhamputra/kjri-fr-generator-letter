import React from "react";
import { createContext, useContextSelector } from "use-context-selector";

const context = createContext(null);

const AuthProvider: React.FC<{ value: Record<string, string> }> = ({ children, value }) => {
  return <context.Provider value={value}>{children}</context.Provider>;
};

const useAuthContext = () => {
  return useContextSelector(context, (c) => c);
};

export { useAuthContext };
export default AuthProvider;
