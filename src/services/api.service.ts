
import axios, { AxiosInstance, AxiosError } from 'axios';
import { DatabaseConfig, ApiResponse } from '../types/api.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Determinar la URL del backend dinámicamente
    const backendUrl = import.meta.env.PROD 
      ? `https://preview--conexiondb2025.lovable.app/api`
      : 'http://localhost:3002';
    
    this.api = axios.create({
      baseURL: backendUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // Incrementamos el timeout para dar más margen a conexiones lentas
    });

    console.log('Backend URL configurada:', backendUrl);
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
      let errorDetails = null;
      
      if (axiosError.code === 'ERR_NETWORK') {
        errorMessage = 'Error de red: No se puede conectar al servidor. Asegúrese de que el servidor esté en ejecución en http://localhost:3002';
      } else if (axiosError.code === 'ECONNREFUSED') {
        errorMessage = 'Conexión rechazada: El servidor no está disponible en este momento.';
      } else if (axiosError.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        const responseData = axiosError.response.data as any;
        errorMessage = responseData.error || `Error ${axiosError.response.status}: ${JSON.stringify(responseData)}`;
        
        // Capturar detalles del error si existen
        if (responseData.errorDetails) {
          errorDetails = responseData.errorDetails;
        }
      } else if (axiosError.message) {
        errorMessage = `Error de red: ${axiosError.message}`;
      }
      
      return {
        success: false,
        error: errorMessage,
        errorDetails: errorDetails || {
          type: axiosError.name,
          code: axiosError.code,
          message: axiosError.message
        }
      };
    }
  }

  // Helper method to check server status
  async checkServerStatus(): Promise<boolean> {
    try {
      console.log('Verificando estado del servidor en:', `${this.api.defaults.baseURL}/api/health`);
      // Use a short timeout just for health checks
      const response = await axios.get(`${this.api.defaults.baseURL}/api/health`, {
        timeout: 5000 // Timeout para la verificación del servidor
      });
      return response.status === 200;
    } catch (error) {
      console.log('Server status check failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
