
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, AlertCircle as AlertCircleIcon } from 'lucide-react';

interface ConnectionStatusProps {
  connectionStatus: { success: boolean; message: string; } | null;
  serverActive: boolean;
  showServerStatus: boolean;
  isConnectionTested: boolean;
  serverCheckError?: string | null;
}

export function ConnectionStatus({ 
  connectionStatus, 
  serverActive, 
  showServerStatus, 
  isConnectionTested,
  serverCheckError
}: ConnectionStatusProps) {
  // Solo mostramos si hay alguna información relevante para mostrar
  if (!connectionStatus && !showServerStatus && !isConnectionTested) return null;

  return (
    <div className="px-6 mb-6">
      {connectionStatus && (
        <Alert 
          className={`mb-4 ${connectionStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          variant={connectionStatus.success ? "default" : "destructive"}
        >
          <AlertTitle className={connectionStatus.success ? "text-green-800" : "text-red-800"}>
            {connectionStatus.success ? "Conexión Exitosa" : "Error de Conexión"}
          </AlertTitle>
          <AlertDescription className={connectionStatus.success ? "text-green-700" : "text-red-700"}>
            {connectionStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {!serverActive && showServerStatus && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4 mr-2" />
          <AlertTitle>Servidor no detectado</AlertTitle>
          <AlertDescription>
            <div>
              <p>El servidor backend no está en ejecución. Por favor, inicie el servidor con:</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">node src/server/index.js</pre>
              <p className="mt-2">Asegúrese de ejecutar este comando en una terminal separada.</p>
              <p className="mt-2">El servidor debe estar ejecutándose en el puerto 3002.</p>
              {serverCheckError && (
                <div className="mt-2 text-sm font-medium">
                  Información adicional: {serverCheckError}
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!isConnectionTested && serverActive && (
        <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 mr-2 text-blue-800" />
          <AlertTitle className="text-blue-800">Información</AlertTitle>
          <AlertDescription className="text-blue-700">
            Complete los datos de conexión y presione "Probar Conexión" para continuar.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
