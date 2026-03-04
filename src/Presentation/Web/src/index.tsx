import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/themeContext";
import { initSentry } from "./infrastructure/sentry/sentry.config";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

// Initialize Sentry error tracking
initSentry();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
