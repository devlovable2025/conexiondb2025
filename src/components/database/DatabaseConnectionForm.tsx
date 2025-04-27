
import React from 'react';
import { CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import type { DatabaseConfig } from '../../types/api.types';
import { DatabaseTypeSelect } from './DatabaseTypeSelect';
import { ConnectionDetailsForm } from './ConnectionDetailsForm';
import { DatabaseSelect } from './DatabaseSelect';
import { useDatabaseConnection } from '@/hooks/useDatabaseConnection';

interface DatabaseConnectionFormProps {
  config: DatabaseConfig;
  setConfig: React.Dispatch<React.SetStateAction<DatabaseConfig>>;
  serverActive: boolean;
}

export function DatabaseConnectionForm({
  config,
  setConfig,
  serverActive
}: DatabaseConnectionFormProps) {
  const {
    isLoading,
    isConnectionTested,
    databases,
    testConnection,
  } = useDatabaseConnection();

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    await testConnection(config);
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

  return (
    <CardContent>
      <form onSubmit={!isConnectionTested ? handleTestConnection : handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatabaseTypeSelect 
            value={config.type}
            onValueChange={(value) => setConfig({ 
              ...config, 
              type: value,
              ...(value === 'postgresql' && {
                trustServerCertificate: undefined,
                encrypt: undefined,
                instanceName: '',
              })
            })}
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

        {!isConnectionTested ? (
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={handleTestConnection} 
              disabled={!serverActive || isLoading}
            >
              {isLoading ? 'Probando...' : 'Probar Conexión'}
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mt-4">
            <Button 
              type="submit"
              disabled={!config.database}
            >
              Guardar Configuración
            </Button>
          </div>
        )}
      </form>
    </CardContent>
  );
}
