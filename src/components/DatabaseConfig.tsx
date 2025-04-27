
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { apiService } from '../services/api.service';
import type { DatabaseConfig, DatabaseType } from '../types/api.types';

export function DatabaseConfigForm() {
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'sqlserver',
    host: '',
    port: 1433,
    database: '',
    username: '',
    password: '',
    trustServerCertificate: true,
    encrypt: false,
    instanceName: ''
  });

  // Actualiza el puerto cuando cambia el tipo de base de datos
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      port: prev.type === 'postgresql' ? 5432 : 1433
    }));
  }, [config.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.testDatabaseConnection(config);
      if (response.success) {
        toast({
          title: "Conexión exitosa",
          description: `La conexión a la base de datos ${config.type === 'postgresql' ? 'PostgreSQL' : 'SQL Server'} se estableció correctamente.`,
        });
      } else {
        toast({
          title: "Error de conexión",
          description: response.error || "No se pudo establecer la conexión",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar conectar con el servidor",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dbType">Tipo de Base de Datos</Label>
          <Select
            value={config.type}
            onValueChange={(value: DatabaseType) => 
              setConfig({ 
                ...config, 
                type: value,
                // Limpiamos los campos específicos de SQL Server si se selecciona PostgreSQL
                ...(value === 'postgresql' && {
                  trustServerCertificate: undefined,
                  encrypt: undefined,
                  instanceName: '',
                })
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo de base de datos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqlserver">SQL Server</SelectItem>
              <SelectItem value="postgresql">PostgreSQL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            value={config.host}
            onChange={(e) => setConfig({ ...config, host: e.target.value })}
            placeholder="localhost"
            required
          />
        </div>

        {config.type === 'sqlserver' && (
          <div className="space-y-2">
            <Label htmlFor="instanceName">Nombre de Instancia (opcional)</Label>
            <Input
              id="instanceName"
              value={config.instanceName}
              onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
              placeholder="SQLEXPRESS"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="port">Puerto</Label>
          <Input
            id="port"
            type="number"
            value={config.port}
            onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
            placeholder={config.type === 'postgresql' ? "5432" : "1433"}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="database">Base de datos</Label>
          <Input
            id="database"
            value={config.database}
            onChange={(e) => setConfig({ ...config, database: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            value={config.username}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Probar Conexión
      </Button>
    </form>
  );
}
