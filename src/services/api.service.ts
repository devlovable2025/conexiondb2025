
import axios, { AxiosInstance } from 'axios';
import { DatabaseConfig, ApiResponse } from '../types/api.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000', // Actualizado a localhost para desarrollo local
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // Agregando un timeout de 10 segundos
    });
  }

  async testDatabaseConnection(config: DatabaseConfig): Promise<ApiResponse<boolean>> {
    try {
      // Para propósitos de demostración, simulamos una respuesta exitosa
      // En un entorno real, esto enviaría la solicitud al backend
      console.log('Probando conexión a la base de datos:', config);
      
      // Simulación de conexión exitosa para demostración
      return {
        success: true,
        data: true,
        message: 'Conexión establecida correctamente'
      };
      
      // Código para conexión real (comentado para la demo)
      // const response = await this.api.post<ApiResponse<boolean>>('/database/test', config);
      // return response.data;
    } catch (error) {
      console.error('Error al probar la conexión de base de datos:', error);
      
      // Mensaje de error más descriptivo
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
