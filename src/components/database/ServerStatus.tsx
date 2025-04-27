
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ServerStatusProps {
  showServerStatus: boolean;
  serverActive: boolean;
  checkingServer?: boolean;
  onCheckServer?: () => void;
}

export function ServerStatus({ 
  showServerStatus, 
  serverActive, 
  checkingServer = false,
  onCheckServer 
}: ServerStatusProps) {
  if (!showServerStatus) return null;

  return (
    <CardHeader className="text-center mb-4">
      <CardTitle className="font-bold text-2xl mt-2">
        Mobilsoft - Gestor de Conexiones
      </CardTitle>
      <div className="mt-4">
        <div className="flex items-center justify-center gap-2">
          <CardDescription className={`flex items-center ${serverActive ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${serverActive ? 'bg-green-600' : 'bg-red-600'}`} />
            <span>{serverActive ? 'Servidor activo' : 'Servidor inactivo'}</span>
          </CardDescription>
          
          {onCheckServer && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCheckServer}
              disabled={checkingServer}
              className="ml-2"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${checkingServer ? 'animate-spin' : ''}`} />
              {checkingServer ? 'Comprobando...' : 'Comprobar'}
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}
