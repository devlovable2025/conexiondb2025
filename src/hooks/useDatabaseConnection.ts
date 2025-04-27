
import { useState } from 'react';
import { toast } from './use-toast';
import { apiService } from '../services/api.service';
import type { DatabaseConfig } from '../types/api.types';

export function useDatabaseConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectionTested, setIsConnectionTested] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [databases, setDatabases] = useState<Array<{ value: string; label: string; }>>([]);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const testConnection = async (config: DatabaseConfig) => {
    // Reset previous state
    setIsLoading(true);
    setConnectionStatus(null);
    setErrorDetails(null);
    
    try {
      console.log("Iniciando prueba de conexión con config:", config);
      
      // First check if the server is running
      const serverRunning = await apiService.checkServerStatus();
      if (!serverRunning) {
        setIsLoading(false);
        setConnectionStatus({
          success: false,
          message: 'Error de red: No se puede conectar al servidor. Asegúrese de que el servidor esté en ejecución en http://localhost:3002'
        });
        toast({
          title: "Error de conexión",
          description: "No se puede conectar al servidor. Verifique que esté ejecutándose.",
          variant: "destructive",
        });
        return;
      }
      
      // If server is running, test database connection
      const response = await apiService.testDatabaseConnection(config);
      console.log("Respuesta recibida:", response);
      setIsLoading(false);
      
      if (response.success) {
        setIsConnectionTested(true);
        setDatabases(response.data || []);
        setConnectionStatus({
          success: true,
          message: response.message || 'Conexión establecida correctamente'
        });
        toast({
          title: "Conexión exitosa",
          description: response.message || "Conexión establecida correctamente",
        });
      } else {
        // Almacenar detalles del error si existen
        if (response.errorDetails) {
          setErrorDetails(response.errorDetails);
        }
        
        setConnectionStatus({
          success: false,
          message: response.error || "No se pudo establecer la conexión",
          details: response.errorDetails
        });
        
        toast({
          title: "Error de conexión",
          description: response.error || "No se pudo establecer la conexión",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en testConnection:", error);
      setIsLoading(false);
      setConnectionStatus({
        success: false,
        message: error instanceof Error ? error.message : "Error al conectar con el servidor"
      });
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar conectar con el servidor",
        variant: "destructive",
      });
    }
  };

  const resetConnection = () => {
    setIsConnectionTested(false);
    setConnectionStatus(null);
    setDatabases([]);
    setErrorDetails(null);
  };

  return {
    isLoading,
    isConnectionTested,
    connectionStatus,
    databases,
    errorDetails,
    testConnection,
    setIsConnectionTested,
    resetConnection
  };
}
