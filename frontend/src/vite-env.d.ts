/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_USE_MOCK_DATA?: string;
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_APP_ENV?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
