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
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { apiService } from '../services/api.service';
import type { DatabaseConfig, DatabaseType } from '../types/api.types';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { InfoIcon, AlertCircleIcon, DatabaseIcon } from 'lucide-react';

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

  const ServerInstructions = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Terminal className="h-4 w-4" />
          Ver instrucciones del servidor
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Instrucciones para ejecutar el servidor</SheetTitle>
          <SheetDescription>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Abrir una terminal en tu sistema</h3>
                <p className="text-sm text-muted-foreground">
                  Abre CMD, PowerShell, o la terminal de tu sistema operativo
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2. Navegar al directorio del proyecto</h3>
                <p className="text-sm text-muted-foreground">
                  Usa el comando cd para navegar hasta la carpeta raíz de tu proyecto
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">3. Instalar dependencias</h3>
                <code className="bg-secondary p-2 rounded block text-sm mt-1">
                  npm install
                </code>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">4. Ejecutar el servidor</h3>
                <code className="bg-secondary p-2 rounded block text-sm mt-1">
                  node src/server/index.js
                </code>
              </div>
              
              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Nota</AlertTitle>
                <AlertDescription>
                  El servidor debe mantenerse en ejecución mientras uses la aplicación. 
                  Verás un mensaje de "Servidor activo" cuando esté funcionando correctamente.
                </AlertDescription>
              </Alert>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-lg font-sans">
        <CardHeader className="text-center mb-4">
          <CardTitle className="font-bold text-2xl mt-2">Mobilsoft - Gestor de Conexiones</CardTitle>
          {showServerStatus && (
            <div className="mt-4 space-y-4">
              <CardDescription className={`mt-2 flex items-center justify-center ${serverActive ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-3 h-3 rounded-full mr-2 ${serverActive ? 'bg-green-600' : 'bg-red-600'}`}></div>
                {serverActive ? 'Servidor activo' : 'Servidor inactivo'}
              </CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {connectionStatus && (
            <Alert 
              className={`mb-6 ${connectionStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
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
            <Alert variant="destructive" className="mb-6">
              <AlertCircleIcon className="h-4 w-4 mr-2" />
              <AlertTitle>Servidor no detectado</AlertTitle>
              <AlertDescription>
                <p>El servidor backend no está en ejecución. Por favor, inicie el servidor con:</p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">node src/server/index.js</pre>
                <p className="mt-2">Asegúrese de ejecutar este comando en una terminal separada.</p>
              </AlertDescription>
            </Alert>
          )}
          
          {!isConnectionTested && serverActive && (
            <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 mr-2 text-blue-800" />
              <AlertTitle className="text-blue-800">Información</AlertTitle>
              <AlertDescription className="text-blue-700">
                Complete los datos de conexión y presione "Probar Conexión" para continuar.
              </AlertDescription>
            </Alert>
          )}
          
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

              <div className="col-span-1 md:col-span-2">
                <Button 
                  type="submit" 
                  className="w-full mt-4 font-bold"
                  disabled={isLoading || (!serverActive && !isConnectionTested)}
                >
                  {isLoading ? 'Conectando...' : (!isConnectionTested ? 'Probar Conexión' : 'Guardar Configuración')}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
