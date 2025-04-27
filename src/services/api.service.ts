
import axios, { AxiosInstance, AxiosError } from 'axios';
import { DatabaseConfig, ApiResponse } from '../types/api.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Use a consistent API URL that works in any environment
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin.replace(/:\d+$/, ':3002')
      : 'http://localhost:3002';
    
    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // Incrementado el timeout para dar más tiempo al servidor
    });

    console.log('API URL configurada:', apiUrl);
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
        errorMessage = 'Error de red: No se puede conectar al servidor. Asegúrese de que el servidor esté en ejecución en http://localhost:3002';
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

  // Helper method to check server status
  async checkServerStatus(): Promise<boolean> {
    try {
      console.log('Verificando estado del servidor en:', `${this.api.defaults.baseURL}/api/health`);
      // Use a short timeout just for health checks
      const response = await axios.get(`${this.api.defaults.baseURL}/api/health`, {
        timeout: 5000 // Incrementado el tiempo de espera para la verificación del servidor
      });
      return response.status === 200;
    } catch (error) {
      console.log('Server status check failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
