
import axios, { AxiosInstance } from 'axios';
import { DatabaseConfig, ApiResponse } from '../types/api.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api', // Esto se configurará con la URL de tu servidor NestJS
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async testDatabaseConnection(config: DatabaseConfig): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.api.post<ApiResponse<boolean>>('/database/test', config);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}

export const apiService = new ApiService();
