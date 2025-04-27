import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { apiService } from '../../services/api.service';
import type { DatabaseConfig, DatabaseType } from '../../types/api.types';

interface DatabaseConnectionFormProps {
  config: DatabaseConfig;
  setConfig: React.Dispatch<React.SetStateAction<DatabaseConfig>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  databases: Array<{ value: string; label: string; }>;
  setDatabases: React.Dispatch<React.SetStateAction<Array<{ value: string; label: string; }>>;
  isConnectionTested: boolean;
  setIsConnectionTested: React.Dispatch<React.SetStateAction<boolean>>;
  setConnectionStatus: React.Dispatch<React.SetStateAction<{ success: boolean; message: string; } | null>>;
  serverActive: boolean;
}

export function DatabaseConnectionForm({
  config,
  setConfig,
  isLoading,
  setIsLoading,
  databases,
  setDatabases,
  isConnectionTested,
  setIsConnectionTested,
  setConnectionStatus,
  serverActive
}: DatabaseConnectionFormProps) {
  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setConnectionStatus(null);
    
    try {
      const response = await apiService.testDatabaseConnection(config);
      setIsLoading(false);
      
      if (response.success) {
        setIsConnectionTested(true);
        setDatabases(response.data || []);
        setConnectionStatus({
          success: true,
          message: response.message || 'Conexión establecida correctamente'
        });
        toast({
          title: "Conexión exitosa",
          description: "Por favor, seleccione una base de datos",
        });
      } else {
        setConnectionStatus({
          success: false,
          message: response.error || "No se pudo establecer la conexión"
        });
        toast({
          title: "Error de conexión",
          description: response.error || "No se pudo establecer la conexión",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setConnectionStatus({
        success: false,
        message: error instanceof Error ? error.message : "Error al conectar con el servidor"
      });
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar conectar con el servidor",
        variant: "destructive",
      });
    }
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

  return (
    <CardContent>
      <form onSubmit={!isConnectionTested ? handleTestConnection : handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dbType" className="font-bold">Tipo de Base de Datos</Label>
            <Select
              value={config.type}
              onValueChange={(value: DatabaseType) => 
                setConfig({ 
                  ...config, 
                  type: value,
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
            <Label htmlFor="host" className="font-bold">Host</Label>
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
              <Label htmlFor="instanceName" className="font-bold">Nombre de Instancia</Label>
              <Input
                id="instanceName"
                value={config.instanceName}
                onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
                placeholder="MOBILSOFT"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="port" className="font-bold">Puerto</Label>
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
            <Label htmlFor="username" className="font-bold">Usuario</Label>
            <Input
              id="username"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              required
            />
          </div>

          {isConnectionTested && (
            <div className="space-y-2">
              <Label htmlFor="database" className="font-bold">Base de datos</Label>
              <Select
                value={config.database}
                onValueChange={(value: string) => setConfig({ ...config, database: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la base de datos" />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db.value} value={db.value}>
                      {db.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {!isConnectionTested && (
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={handleTestConnection} 
              disabled={!serverActive || isLoading}
            >
              {isLoading ? 'Probando...' : 'Probar Conexión'}
            </Button>
          </div>
        )}
      </form>
    </CardContent>
  );
}
