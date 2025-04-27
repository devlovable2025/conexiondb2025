
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ServerStatusProps {
  showServerStatus: boolean;
  serverActive: boolean;
}

export function ServerStatus({ showServerStatus, serverActive }: ServerStatusProps) {
  if (!showServerStatus) return null;

  return (
    <CardHeader className="text-center mb-4">
      <CardTitle className="font-bold text-2xl mt-2">
        Mobilsoft - Gestor de Conexiones
      </CardTitle>
      <div className="mt-4 space-y-4">
        <CardDescription className={`mt-2 flex items-center justify-center ${serverActive ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${serverActive ? 'bg-green-600' : 'bg-red-600'}`} />
          {serverActive ? 'Servidor activo' : 'Servidor inactivo'}
        </CardDescription>
      </div>
    </CardHeader>
  );
}
