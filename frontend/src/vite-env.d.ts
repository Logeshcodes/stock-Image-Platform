interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  VITE_API_URL: string;
  VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
