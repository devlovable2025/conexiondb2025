
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
    connectionStatus,
    databases,
    errorDetails,
    testConnection,
    resetConnection
  } = useDatabaseConnection();

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Probando conexión con config:", config);
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

  const handleReset = () => {
    resetConnection();
  };

  return (
    <>
      <div className="px-6 mb-6">
        {/* Componente ConnectionStatus con errorDetails */}
        {connectionStatus && (
          <div className="mb-4">
            {/* Alerta de conexión */}
            <div 
              className={`p-4 rounded-md ${
                connectionStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {connectionStatus.success ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${connectionStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                    {connectionStatus.success ? "Conexión Exitosa" : "Error de Conexión"}
                  </h3>
                  <div className={`mt-2 text-sm ${connectionStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                    <p>{connectionStatus.message}</p>
                    
                    {/* Detalles técnicos del error */}
                    {!connectionStatus.success && errorDetails && (
                      <div className="mt-2">
                        <details className="text-xs">
                          <summary className="cursor-pointer font-medium">Ver detalles técnicos</summary>
                          <div className="mt-1 p-2 rounded bg-red-100 font-mono overflow-auto">
                            {errorDetails.code && <p>Código: {errorDetails.code}</p>}
                            {errorDetails.number && <p>Número: {errorDetails.number}</p>}
                            {errorDetails.state && <p>Estado: {errorDetails.state}</p>}
                            {errorDetails.originalMessage && <p>Mensaje original: {errorDetails.originalMessage}</p>}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

          <div className="flex justify-end mt-4 gap-2">
            {isConnectionTested && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
              >
                Reiniciar Conexión
              </Button>
            )}
            
            {!isConnectionTested ? (
              <Button 
                type="button" 
                onClick={handleTestConnection} 
                disabled={!serverActive && !window.location.hostname.includes('localhost') && isLoading}
              >
                {isLoading ? 'Probando...' : 'Probar Conexión'}
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={!config.database}
              >
                Guardar Configuración
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </>
  );
}
