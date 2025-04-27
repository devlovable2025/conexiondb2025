
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
  instanceName?: string; // Para instancias nombradas de SQL Server
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string; // Campo para mensajes de éxito
  error?: string; // Campo para mensajes de error
}
