
import axios, { AxiosInstance } from 'axios';
import { DatabaseConfig, ApiResponse } from '../types/api.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async testDatabaseConnection(config: DatabaseConfig): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.api.post<ApiResponse<boolean>>('/api/database/test', config);
      return response.data;
    } catch (error) {
      console.error('Error al probar la conexión de base de datos:', error);
      
      const errorMessage = error instanceof Error 
        ? `Error de red: ${error.message}`
        : 'Error de conexión: No se pudo conectar al servidor API';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const apiService = new ApiService();

