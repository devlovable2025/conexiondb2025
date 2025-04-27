
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { DatabaseConfig } from '../../types/api.types';

interface ConnectionDetailsFormProps {
  config: DatabaseConfig;
  onConfigChange: (newConfig: DatabaseConfig) => void;
}

export function ConnectionDetailsForm({ config, onConfigChange }: ConnectionDetailsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="host" className="font-bold">Host</Label>
        <Input
          id="host"
          value={config.host}
          onChange={(e) => onConfigChange({ ...config, host: e.target.value })}
          placeholder="localhost"
          required
        />
      </div>

      {config.type === 'sqlserver' && (
        <div className="space-y-2">
          <Label htmlFor="instanceName" className="font-bold">Nombre de Instancia (Opcional)</Label>
          <Input
            id="instanceName"
            value={config.instanceName || ''}
            onChange={(e) => onConfigChange({ 
              ...config, 
              instanceName: e.target.value || undefined 
            })}
            placeholder="Ej: MOBILSOFT, SQLEXPRESS"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="port" className="font-bold">Puerto</Label>
        <Input
          id="port"
          type="number"
          value={config.port}
          onChange={(e) => onConfigChange({ ...config, port: Number(e.target.value) })}
          placeholder={config.type === 'postgresql' ? "5432" : "1433"}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="font-bold">Usuario</Label>
        <Input
          id="username"
          value={config.username}
          onChange={(e) => onConfigChange({ ...config, username: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-bold">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={config.password}
          onChange={(e) => onConfigChange({ ...config, password: e.target.value })}
          required
        />
      </div>
    </>
  );
}
