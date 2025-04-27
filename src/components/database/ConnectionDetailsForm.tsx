import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
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

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="encrypt" className="font-bold">Encrypt</Label>
            <div className="text-sm text-muted-foreground">
              Habilitar encriptación para la conexión
            </div>
          </div>
          <Switch
            id="encrypt"
            checked={config.encrypt}
            onCheckedChange={(checked) => onConfigChange({ ...config, encrypt: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="trustServerCertificate" className="font-bold">Trust Server Certificate</Label>
            <div className="text-sm text-muted-foreground">
              Confiar en el certificado del servidor
            </div>
          </div>
          <Switch
            id="trustServerCertificate"
            checked={config.trustServerCertificate}
            onCheckedChange={(checked) => onConfigChange({ ...config, trustServerCertificate: checked })}
          />
        </div>
      </div>
    </>
  );
}
