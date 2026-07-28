import React, { createContext, useContext, useState } from "react";
interface AppContextType {
  loading: boolean;
  setLoading: (value: boolean) => void; // Đã sửa lại dòng này liền mạch
}
const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <AppContext.Provider value={{ loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  const context=useContext(AppContext);
  if(!context){
    throw new Error("UseAppContext must be used within an AppProvider");
  }
  return context;
};