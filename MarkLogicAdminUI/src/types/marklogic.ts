// TypeScript interfaces for MarkLogic Management API responses

// Common list item structure used across all MarkLogic APIs
export interface MarkLogicListItem {
    nameref: string;
    idref?: string;
    uriref?: string;
    description?: string;
}

// Common list structure wrapper
export interface MarkLogicListItems {
    'list-item': MarkLogicListItem[];
}

// Common default list structure
export interface MarkLogicDefaultList {
    'list-items': MarkLogicListItems;
}

// Database API Types
export interface DatabaseListResponse {
    'database-default-list': MarkLogicDefaultList;
}

export interface DatabaseProperties {
    'database-name': string;
    'database-id'?: string;
    enabled?: boolean;
    'security-database'?: string;
    'schema-database'?: string;
    'triggers-database'?: string;
    'fast-phrase-searches'?: boolean;
    'fast-reverse-searches'?: boolean;
    'triple-index'?: boolean;
    'collection-lexicon'?: boolean;
    'uri-lexicon'?: boolean;
    'word-searches'?: boolean;
    'word-positions'?: boolean;
    'element-word-positions'?: boolean;
    'fast-element-word-searches'?: boolean;
    'element-value-positions'?: boolean;
    'attribute-value-positions'?: boolean;
    'field-value-searches'?: boolean;
    'field-value-positions'?: boolean;
    'three-character-searches'?: boolean;
    'three-character-word-positions'?: boolean;
    'fast-character-searches'?: boolean;
    'trailing-wildcard-searches'?: boolean;
    'trailing-wildcard-word-positions'?: boolean;
    'fast-diacritic-sensitive-searches'?: boolean;
    'fast-case-sensitive-searches'?: boolean;
    'stemmed-searches'?: string;
    'word-lexicons'?: any[];
    [key: string]: any; // Allow additional properties
}

// Forest API Types
export interface ForestListResponse {
    'forest-default-list': MarkLogicDefaultList;
}

export interface ForestProperties {
    'forest-name': string;
    'forest-id'?: string;
    host?: string;
    enabled?: boolean;
    'rebalancer-enable'?: boolean;
    'data-directory'?: string;
    'large-data-directory'?: string;
    'fast-data-directory'?: string;
    'database'?: string;
    'availability'?: string;
    'updates-allowed'?: string;
    [key: string]: any; // Allow additional properties
}

// Server API Types
export interface ServerListResponse {
    'server-default-list': MarkLogicDefaultList;
}

export interface ServerProperties {
    'server-name': string;
    'server-type'?: string;
    'group-name'?: string;
    enabled?: boolean;
    port?: number;
    'content-database'?: string;
    'modules-database'?: string;
    'default-user'?: string;
    authentication?: string;
    'internal-security'?: boolean;
    'concurrent-request-limit'?: number;
    'compute-content-length'?: boolean;
    'static-expires'?: number;
    'pre-commit-trigger-depth'?: number;
    'pre-commit-trigger-limit'?: number;
    [key: string]: any; // Allow additional properties
}

// Group API Types
export interface GroupListResponse {
    'group-default-list': MarkLogicDefaultList;
}

export interface GroupProperties {
    'group-name': string;
    'group-id'?: string;
    'list-cache-size'?: number;
    'list-cache-partitions'?: number;
    'compressed-tree-cache-size'?: number;
    'expanded-tree-cache-size'?: number;
    'triple-cache-size'?: number;
    'triple-cache-timeout'?: number;
    'triple-value-cache-size'?: number;
    'triple-value-cache-timeout'?: number;
    'smtp-relay'?: string;
    'smtp-timeout'?: number;
    'http-timeout'?: number;
    'xdqp-timeout'?: number;
    'host-timeout'?: number;
    [key: string]: any; // Allow additional properties
}

// User API Types
export interface UserListResponse {
    'user-default-list': MarkLogicDefaultList;
}

export interface UserProperties {
    'user-name': string;
    description?: string;
    password?: string;
    'external-names'?: any[];
    role?: string | string[];
    roles?: {
        role: string | string[];
    };
    permissions?: any[];
    collections?: any[];
    [key: string]: any; // Allow additional properties
}

// Role API Types
export interface RoleListResponse {
    'role-default-list': MarkLogicDefaultList;
}

export interface RoleProperties {
    'role-name': string;
    description?: string;
    compartment?: string;
    roles?: {
        role: string | string[];
    };
    'external-names'?: any[];
    permissions?: any[];
    collections?: any[];
    privilege?: any[];
    [key: string]: any; // Allow additional properties
}

// Log API Types - logs are returned as text, not structured JSON
export type LogsResponse = string;

// Generic detail responses
export type DatabaseDetailsMap = Record<string, DatabaseProperties>;
export type ForestDetailsMap = Record<string, ForestProperties>;
export type ServerDetailsMap = Record<string, ServerProperties>;
export type GroupDetailsMap = Record<string, GroupProperties>;
export type HostDetailsMap = Record<string, HostProperties>;
export type UserDetailsMap = Record<string, UserProperties>;
export type RoleDetailsMap = Record<string, RoleProperties>;

// Admin component state types
export interface AdminState {
    databases: DatabaseListResponse | null;
    databaseDetails: DatabaseDetailsMap;
    forests: ForestListResponse | null;
    forestDetails: ForestDetailsMap;
    servers: ServerListResponse | null;
    serverDetails: ServerDetailsMap;
    groups: GroupListResponse | null;
    groupDetails: GroupDetailsMap;
    hosts: HostListResponse | null;
    hostDetails: HostDetailsMap;
    users: UserListResponse | null;
    userDetails: UserDetailsMap;
    roles: RoleListResponse | null;
    roleDetails: RoleDetailsMap;
    logs: LogsResponse | null;
    logsError: string | null;
    logsLoading: boolean;
    error: string | null;
    loading: boolean;
    hoveredDatabase: string | null;
    hoveredForest: string | null;
    hoveredServer: string | null;
    hoveredGroup: string | null;
    hoveredHost: string | null;
    hoveredUser: string | null;
    hoveredRole: string | null;
    activeTab: string;
}

// Component prop types
export interface TabProps {
    databases?: DatabaseListResponse | null;
    databaseDetails?: DatabaseDetailsMap;
    forests?: ForestListResponse | null;
    forestDetails?: ForestDetailsMap;
    servers?: ServerListResponse | null;
    serverDetails?: ServerDetailsMap;
    groups?: GroupListResponse | null;
    groupDetails?: GroupDetailsMap;
    users?: UserListResponse | null;
    userDetails?: UserDetailsMap;
    roles?: RoleListResponse | null;
    roleDetails?: RoleDetailsMap;
    hoveredDatabase?: string | null;
    setHoveredDatabase?: (db: string | null) => void;
    hoveredForest?: string | null;
    setHoveredForest?: (forest: string | null) => void;
    hoveredServer?: string | null;
    setHoveredServer?: (server: string | null) => void;
    hoveredGroup?: string | null;
    setHoveredGroup?: (group: string | null) => void;
    hoveredUser?: string | null;
    setHoveredUser?: (user: string | null) => void;
    hoveredRole?: string | null;
    setHoveredRole?: (role: string | null) => void;
    onDatabaseClick?: (databaseName: string) => void;
}

// Individual component prop types
export interface DatabaseItemProps {
    database: MarkLogicListItem;
    databaseDetails: DatabaseDetailsMap;
    hoveredDatabase: string | null;
    setHoveredDatabase: (db: string | null) => void;
}

export interface ForestItemProps {
    forest: MarkLogicListItem;
    forestDetails: ForestDetailsMap;
    hoveredForest: string | null;
    setHoveredForest: (forest: string | null) => void;
}

export interface ServerItemProps {
    server: MarkLogicListItem;
    serverDetails: ServerDetailsMap;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
    onDatabaseClick?: (databaseName: string) => void;
}

export interface GroupItemProps {
    group: MarkLogicListItem;
    groupDetails: GroupDetailsMap;
    hoveredGroup: string | null;
    setHoveredGroup: (group: string | null) => void;
}

export interface UserItemProps {
    user: MarkLogicListItem;
    userDetails: UserDetailsMap;
    hoveredUser: string | null;
    setHoveredUser: (user: string | null) => void;
}

export interface RoleItemProps {
    role: MarkLogicListItem;
    roleDetails: RoleDetailsMap;
    hoveredRole: string | null;
    setHoveredRole: (role: string | null) => void;
}

// Section component prop types
export interface DatabasesSectionProps {
    databases: DatabaseListResponse | null;
    databaseDetails: DatabaseDetailsMap;
    hoveredDatabase: string | null;
    setHoveredDatabase: (db: string | null) => void;
}

export interface ForestsSectionProps {
    forests: ForestListResponse | null;
    forestDetails: ForestDetailsMap;
    hoveredForest: string | null;
    setHoveredForest: (forest: string | null) => void;
}

export interface ServersSectionProps {
    servers: ServerListResponse | null;
    serverDetails: ServerDetailsMap;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
    onDatabaseClick?: (databaseName: string) => void;
}

export interface GroupsSectionProps {
    groups: GroupListResponse | null;
    groupDetails: GroupDetailsMap;
    hoveredGroup: string | null;
    setHoveredGroup: (group: string | null) => void;
}

export interface UsersSectionProps {
    users: UserListResponse | null;
    userDetails: UserDetailsMap;
    hoveredUser: string | null;
    setHoveredUser: (user: string | null) => void;
}

export interface RolesSectionProps {
    roles: RoleListResponse | null;
    roleDetails: RoleDetailsMap;
    hoveredRole: string | null;
    setHoveredRole: (role: string | null) => void;
}

// Tab-specific prop types
export interface DataTabProps {
    databases: DatabaseListResponse | null;
    databaseDetails: DatabaseDetailsMap;
    forests: ForestListResponse | null;
    forestDetails: ForestDetailsMap;
    hoveredDatabase: string | null;
    setHoveredDatabase: (db: string | null) => void;
    hoveredForest: string | null;
    setHoveredForest: (forest: string | null) => void;
}

export interface InfrastructureTabProps {
    servers: ServerListResponse | null;
    serverDetails: ServerDetailsMap;
    hoveredServer: string | null;
    setHoveredServer: (server: string | null) => void;
    groups: GroupListResponse | null;
    groupDetails: GroupDetailsMap;
    hoveredGroup: string | null;
    setHoveredGroup: (group: string | null) => void;
    hosts: HostListResponse | null;
    hostDetails: HostDetailsMap;
    hoveredHost: string | null;
    setHoveredHost: (host: string | null) => void;
    onDatabaseClick?: (databaseName: string) => void;
}

export interface SecurityTabProps {
    users: UserListResponse | null;
    roles: RoleListResponse | null;
    userDetails: UserDetailsMap;
    roleDetails: RoleDetailsMap;
    hoveredUser: string | null;
    setHoveredUser: (user: string | null) => void;
    hoveredRole: string | null;
    setHoveredRole: (role: string | null) => void;
}

export interface LogsTabProps {
    logs: LogsResponse | null;
    error: string | null;
    loading: boolean;
}

export interface LogsSectionProps {
    logs: LogsResponse | null;
    error: string | null;
    loading: boolean;
    selectedLogFile?: string;
}

// Utility component props
export interface RawJsonSectionProps {
    data: any;
    title: string;
}

// Host API Types
export interface HostListResponse {
    'host-default-list': MarkLogicDefaultList;
}

export interface HostProperties {
    'host-name': string;
    'host-id'?: string;
    group?: string;
    'bind-port'?: number;
    'foreign-bind-port'?: number;
    zone?: string;
    'bootstrap-host'?: boolean;
    'host-mode'?: string;
    'host-mode-description'?: string;
    'dynamic-host'?: boolean;
    [key: string]: any; // Allow additional properties
}
