
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { apiService } from '../services/api.service';
import type { DatabaseConfig, DatabaseType } from '../types/api.types';

export function DatabaseConfigForm() {
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'sqlserver',
    host: 'localhost', // Valores predeterminados de desarrollo
    port: 1433,
    database: '', // Dejamos la base de datos vacía para que el usuario la seleccione
    username: 'sa', // Credencial típica de prueba para SQL Server
    password: 'Mobilsoft2024!', // Contraseña de prueba
    trustServerCertificate: true,
    encrypt: false,
    instanceName: 'SQLEXPRESS' // Instancia predeterminada, pero opcional
  });

  const [databases, setDatabases] = useState<{ value: string; label: string; }[]>([]);
  const [isConnectionTested, setIsConnectionTested] = useState(false);

  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      port: prev.type === 'postgresql' ? 5432 : 1433
    }));
  }, [config.type]);

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.testDatabaseConnection(config);
      if (response.success) {
        setIsConnectionTested(true);
        // Asumiendo que el servidor devuelve las bases de datos disponibles
        // Aquí deberías hacer otra llamada para obtener las bases de datos
        const mockDatabases = [
          { value: 'db1', label: 'Base de datos 1' },
          { value: 'db2', label: 'Base de datos 2' },
          { value: 'db3', label: 'Base de datos 3' },
        ];
        setDatabases(mockDatabases);
        toast({
          title: "Conexión exitosa",
          description: "Por favor, seleccione una base de datos",
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
    // Aquí iría la lógica para guardar la configuración final
    toast({
      title: "Éxito",
      description: "Configuración guardada correctamente",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-lg font-sans">
        <CardHeader className="text-center mb-4">
          <CardTitle className="font-bold text-2xl mt-2">Mobilsoft - Gestor de Conexiones</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={!isConnectionTested ? handleTestConnection : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="instanceName" className="font-bold">Nombre de Instancia (opcional)</Label>
                  <Input
                    id="instanceName"
                    value={config.instanceName}
                    onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
                    placeholder="SQLEXPRESS"
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

              <div className="col-span-2">
                <Button type="submit" className="w-full mt-4 font-bold">
                  {!isConnectionTested ? 'Probar Conexión' : 'Guardar Configuración'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
