/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLANT_ID_API_KEY: string;
  readonly VITE_PLANT_ID_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
