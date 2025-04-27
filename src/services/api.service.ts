
import axios, { AxiosInstance, AxiosError } from 'axios';
import { DatabaseConfig, ApiResponse } from '../types/api.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async testDatabaseConnection(config: DatabaseConfig): Promise<ApiResponse<any>> {
    try {
      console.log('Enviando solicitud de conexión a:', `${this.api.defaults.baseURL}/api/database/test`);
      console.log('Configuración:', JSON.stringify(config, null, 2));
      
      const response = await this.api.post<ApiResponse<any>>('/api/database/test', config);
      console.log('Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error completo:', axiosError);
      
      let errorMessage = 'Error de conexión desconocido';
      
      if (axiosError.code === 'ERR_NETWORK') {
        errorMessage = 'Error de red: No se puede conectar al servidor. Asegúrese de que el servidor esté en ejecución en http://localhost:8000';
      } else if (axiosError.code === 'ECONNREFUSED') {
        errorMessage = 'Conexión rechazada: El servidor no está disponible en este momento.';
      } else if (axiosError.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        errorMessage = `Error ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`;
      } else if (axiosError.message) {
        errorMessage = `Error de red: ${axiosError.message}`;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const apiService = new ApiService();
