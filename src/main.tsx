import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SessionProvider } from "./context/SessionContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    {/* 2. Bọc App bên trong các Provider. Thứ tự ưu tiên bọc ngoài cùng trước */}
    <AppProvider>
      <LanguageProvider>
        <ThemeProvider>
          <SessionProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </SessionProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AppProvider>
  </StrictMode>
);