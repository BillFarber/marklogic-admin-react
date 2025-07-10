/**
 * Application configuration loaded from environment variables
 */
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',

  // MarkLogic Configuration
  marklogic: {
    host: import.meta.env.VITE_MARKLOGIC_HOST || 'http://localhost:8002',
    adminUsername: import.meta.env.VITE_MARKLOGIC_ADMIN_USERNAME || 'admin',
    adminPassword: import.meta.env.VITE_MARKLOGIC_ADMIN_PASSWORD || 'admin',
  },

  // Application Settings
  app: {
    name: import.meta.env.VITE_APP_NAME || 'MarkLogic Admin',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },

  // UI Settings
  ui: {
    defaultPageSize: parseInt(
      import.meta.env.VITE_DEFAULT_PAGE_SIZE || '20',
      10,
    ),
    refreshInterval: parseInt(
      import.meta.env.VITE_REFRESH_INTERVAL || '30000',
      10,
    ),
  },
} as const;

/**
 * Environment-specific configuration
 */
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * API endpoints configuration
 */
export const endpoints = {
  databases: '/manage/v2/databases',
  forests: '/manage/v2/forests',
  groups: '/manage/v2/groups',
  hosts: '/manage/v2/hosts',
  servers: '/manage/v2/servers',
} as const;
