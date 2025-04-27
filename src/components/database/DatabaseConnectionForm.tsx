
import React from 'react';
import { CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { apiService } from '../../services/api.service';
import type { DatabaseConfig, DatabaseType } from '../../types/api.types';
import { DatabaseTypeSelect } from './DatabaseTypeSelect';
import { ConnectionDetailsForm } from './ConnectionDetailsForm';
import { DatabaseSelect } from './DatabaseSelect';

interface DatabaseConnectionFormProps {
  config: DatabaseConfig;
  setConfig: React.Dispatch<React.SetStateAction<DatabaseConfig>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  databases: Array<{ value: string; label: string; }>;
  setDatabases: React.Dispatch<React.SetStateAction<Array<{ value: string; label: string; }>>>;
  isConnectionTested: boolean;
  setIsConnectionTested: React.Dispatch<React.SetStateAction<boolean>>;
  setConnectionStatus: React.Dispatch<React.SetStateAction<{ success: boolean; message: string; } | null>>;
  serverActive: boolean;
}

export function DatabaseConnectionForm({
  config,
  setConfig,
  isLoading,
  setIsLoading,
  databases,
  setDatabases,
  isConnectionTested,
  setIsConnectionTested,
  setConnectionStatus,
  serverActive
}: DatabaseConnectionFormProps) {
  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.database) {
      toast({
        title: "Error",
        description: "Por favor, seleccione una base de datos",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Éxito",
      description: "Configuración guardada correctamente",
    });
  };

  const handleDatabaseTypeChange = (value: DatabaseType) => {
    setConfig({ 
      ...config, 
      type: value,
      ...(value === 'postgresql' && {
        trustServerCertificate: undefined,
        encrypt: undefined,
        instanceName: '',
      })
    });
  };

  return (
    <CardContent>
      <form onSubmit={!isConnectionTested ? handleTestConnection : handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatabaseTypeSelect 
            value={config.type}
            onValueChange={handleDatabaseTypeChange}
          />
          
          <ConnectionDetailsForm 
            config={config}
            onConfigChange={setConfig}
          />

          {isConnectionTested && (
            <DatabaseSelect
              value={config.database}
              databases={databases}
              onValueChange={(value: string) => setConfig({ ...config, database: value })}
            />
          )}
        </div>

        {!isConnectionTested && (
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={handleTestConnection} 
              disabled={!serverActive || isLoading}
            >
              {isLoading ? 'Probando...' : 'Probar Conexión'}
            </Button>
          </div>
        )}
      </form>
    </CardContent>
  );
}
