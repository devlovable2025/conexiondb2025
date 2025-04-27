
import React, { useState, useEffect } from 'react';
import { DatabaseConnectionForm } from './DatabaseConnectionForm';
import { ServerStatus } from './ServerStatus';
import { ConnectionStatus } from './ConnectionStatus';
import { ServerInstructions } from './ServerInstructions';
import type { DatabaseConfig } from '../../types/api.types';

export function DatabaseConfigForm() {
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'sqlserver',
    host: '205.209.122.84',
    port: 1437,
    database: 'Presupuesto',
    username: 'sa',
    password: 'X3c1970213@mam@',
    trustServerCertificate: true,
    encrypt: false,
    instanceName: 'mobilsoft'
  });

  const [databases, setDatabases] = useState<{ value: string; label: string; }[]>([]);
  const [isConnectionTested, setIsConnectionTested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showServerStatus, setShowServerStatus] = useState(false);
  const [serverActive, setServerActive] = useState(false);
  const [serverCheckError, setServerCheckError] = useState<string | null>(null);

  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      port: prev.type === 'postgresql' ? 5432 : 1437
    }));
  }, [config.type]);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        setShowServerStatus(true);
        console.log('Verificando estado del servidor en:', 'http://localhost:8000/api/health');
        const response = await fetch('http://localhost:8000/api/health', { 
          // Agregamos un timeout para que no se quede esperando mucho tiempo
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          console.log('Servidor activo, respuesta:', await response.json());
          setServerActive(true);
          setServerCheckError(null);
        } else {
          console.log('Servidor inactivo, código de estado:', response.status);
          setServerActive(false);
          setServerCheckError(`Error del servidor: ${response.status}`);
        }
      } catch (error) {
        console.error('Error al verificar el estado del servidor:', error);
        setServerActive(false);
        
        // Verificar si el error es porque está usando la app desde Lovable (no local)
        const isRunningInLovable = window.location.hostname.includes('lovable');
        
        if (isRunningInLovable) {
          setServerCheckError("La aplicación está corriendo en el entorno de Lovable. Para acceder al servidor backend, debes ejecutarlo localmente.");
        } else {
          setServerCheckError("No se pudo conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000");
        }
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-3xl mx-auto shadow-lg font-sans">
        <ServerStatus showServerStatus={showServerStatus} serverActive={serverActive} />
        
        <ConnectionStatus 
          connectionStatus={connectionStatus} 
          serverActive={serverActive} 
          showServerStatus={showServerStatus} 
          isConnectionTested={isConnectionTested}
          serverCheckError={serverCheckError}
        />
        
        <DatabaseConnectionForm
          config={config}
          setConfig={setConfig}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          databases={databases}
          setDatabases={setDatabases}
          isConnectionTested={isConnectionTested}
          setIsConnectionTested={setIsConnectionTested}
          setConnectionStatus={setConnectionStatus}
          serverActive={serverActive}
        />
        
        <div className="px-6 pb-6">
          <ServerInstructions />
        </div>
      </div>
    </div>
  );
}
