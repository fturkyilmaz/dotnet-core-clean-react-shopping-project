// Type definitions for better TypeScript support

// Extend Window interface for custom properties
declare global {
  interface Window {
    // Add custom window properties here if needed
  }
}

// Environment variables type safety
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
