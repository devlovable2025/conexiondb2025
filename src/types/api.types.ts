
export type DatabaseType = 'sqlserver' | 'postgresql';

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  trustServerCertificate?: boolean; // Específico para SQL Server
  encrypt?: boolean; // Específico para SQL Server
  // Removemos instanceName completamente
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
