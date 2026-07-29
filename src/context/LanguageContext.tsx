import React, {ReactNode} from 'react';
import { createContext, useContext, useState } from "react";

// Thêm Interface để tránh lỗi 'any'
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}
const LanguageContext = createContext<LanguageContextType | null>(null);
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("vi");
  return (
    <LanguageContext.Provider 
    value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguageContext = () => useContext(LanguageContext);