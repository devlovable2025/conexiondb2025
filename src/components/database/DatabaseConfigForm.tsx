
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DatabaseConnectionForm } from './DatabaseConnectionForm';
import { ServerStatus } from './ServerStatus';
import { ConnectionStatus } from './ConnectionStatus';
import { ServerInstructions } from './ServerInstructions';
import type { DatabaseConfig } from '../../types/api.types';
import { useDatabaseConnection } from '@/hooks/useDatabaseConnection';
import { apiService } from '@/services/api.service';
import { toast } from '@/hooks/use-toast';

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

  const [showServerStatus, setShowServerStatus] = useState(false);
  const [serverActive, setServerActive] = useState(false);
  const [serverCheckError, setServerCheckError] = useState<string | null>(null);
  const [checkingServer, setCheckingServer] = useState(false);
  
  const { connectionStatus, isConnectionTested } = useDatabaseConnection();

  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      port: prev.type === 'postgresql' ? 5432 : 1437
    }));
  }, [config.type]);

  // One-time server status check with retry capability
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        setShowServerStatus(true);
        setCheckingServer(true);
        console.log('Verificando estado del servidor...');
        
        // For local development, assume server is working by default
        const isLocalhost = window.location.hostname === 'localhost';
        if (isLocalhost) {
          setServerActive(true);
          setServerCheckError(null);
          setCheckingServer(false);
          return;
        }

        const isActive = await apiService.checkServerStatus();
        
        if (isActive) {
          console.log('Servidor activo');
          setServerActive(true);
          setServerCheckError(null);
          // Show success toast only once
          toast({
            title: "Conexión exitosa",
            description: "Servidor detectado correctamente",
          });
        } else {
          console.log('Servidor inactivo');
          setServerActive(false);
          setServerCheckError("No se pudo conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000");
        }
      } catch (error) {
        console.error('Error al verificar el estado del servidor:', error);
        setServerActive(false);
        setServerCheckError("Error al conectar con el servidor. Verifica que esté ejecutándose en http://localhost:8000");
      } finally {
        setCheckingServer(false);
      }
    };

    checkServerStatus();
    
    // Instead of frequent polling, let the user manually retry if needed
    // This avoids excessive failed network requests
  }, []);

  // Manual server check function
  const handleCheckServerStatus = async () => {
    try {
      setCheckingServer(true);
      const isActive = await apiService.checkServerStatus();
      
      if (isActive) {
        setServerActive(true);
        setServerCheckError(null);
        toast({
          title: "Conexión exitosa",
          description: "Servidor detectado correctamente",
        });
      } else {
        setServerActive(false);
        setServerCheckError("No se pudo conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000");
        toast({
          title: "Error de conexión",
          description: "No se puede conectar al servidor en http://localhost:8000",
          variant: "destructive",
        });
      }
    } catch (error) {
      setServerActive(false);
      setServerCheckError("Error al conectar con el servidor");
      toast({
        title: "Error de conexión",
        description: "No se puede conectar al servidor en http://localhost:8000",
        variant: "destructive",
      });
    } finally {
      setCheckingServer(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-lg font-sans">
        <ServerStatus 
          showServerStatus={showServerStatus} 
          serverActive={serverActive} 
          checkingServer={checkingServer}
          onCheckServer={handleCheckServerStatus}
        />
        
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
          serverActive={serverActive || window.location.hostname === 'localhost'}
        />
        
        <div className="px-6 pb-6">
          <ServerInstructions />
        </div>
      </Card>
    </div>
  );
}
