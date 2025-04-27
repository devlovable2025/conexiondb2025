
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
        const response = await fetch('http://localhost:8000/api/health');
        if (response.ok) {
          setServerActive(true);
        } else {
          setServerActive(false);
        }
      } catch (error) {
        console.error('Error al verificar el estado del servidor:', error);
        setServerActive(false);
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
