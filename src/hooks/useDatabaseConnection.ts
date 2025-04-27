
import { useState } from 'react';
import { toast } from './use-toast';
import { apiService } from '../services/api.service';
import type { DatabaseConfig } from '../types/api.types';

export function useDatabaseConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectionTested, setIsConnectionTested] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string; } | null>(null);
  const [databases, setDatabases] = useState<Array<{ value: string; label: string; }>>([]);

  const testConnection = async (config: DatabaseConfig) => {
    setIsLoading(true);
    setConnectionStatus(null);
    
    try {
      const response = await apiService.testDatabaseConnection(config);
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
          description: "Por favor, seleccione una base de datos",
        });
      } else {
        setConnectionStatus({
          success: false,
          message: response.error || "No se pudo establecer la conexión"
        });
        toast({
          title: "Error de conexión",
          description: response.error || "No se pudo establecer la conexión",
          variant: "destructive",
        });
      }
    } catch (error) {
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
  };

  return {
    isLoading,
    isConnectionTested,
    connectionStatus,
    databases,
    testConnection,
    setIsConnectionTested,
    resetConnection
  };
}
