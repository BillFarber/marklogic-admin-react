/// <reference types="vite/client" />
/// <reference types="react" />

declare interface ImportMetaEnv {
  readonly VITE_MARKLOGIC_HOST: string;
  readonly VITE_MARKLOGIC_ADMIN_USERNAME: string;
  readonly VITE_MARKLOGIC_ADMIN_PASSWORD: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
