// src/count-context.tsx
import * as React from "react";
type Action = { type: "setIsEditing"; payload: boolean };
type Dispatch = (action: Action) => void;
type State = { isEditing: boolean };
type AppStateProviderProps = { children: React.ReactNode };
const AppStateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function appStateReducer(state: State, action: Action) {
  switch (action.type) {
    case "setIsEditing": {
      return { isEditing: action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = React.useReducer(appStateReducer, { isEditing: false });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a CountProvider");
  }
  return context;
}
export { AppStateProvider, useAppState };
