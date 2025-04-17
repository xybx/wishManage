/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_UPDATE_TIME: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface Window {
  VITE_APP_BASE_URL?: string;
  VITE_APP_WS_URL?:string;
}
