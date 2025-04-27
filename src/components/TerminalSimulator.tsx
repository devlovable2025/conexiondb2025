
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Terminal, Play } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TerminalSimulator() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const simulateCommand = async (command: string, delay = 1000) => {
    return new Promise<void>(resolve => {
      addLog(`$ ${command}`);
      setTimeout(resolve, delay);
    });
  };

  const handleInstall = async () => {
    setIsInstalling(true);
    setLogs([]);
    
    try {
      await simulateCommand('cd proyecto');
      await simulateCommand('npm install', 2000);
      addLog('✅ Dependencias instaladas correctamente');
    } catch (error) {
      addLog('❌ Error durante la instalación');
    }
    
    setIsInstalling(false);
  };

  const handleStartServer = async () => {
    setIsRunning(true);
    setLogs([]);
    
    try {
      await simulateCommand('node src/server/index.js');
      addLog('🚀 Servidor iniciado en http://localhost:3000');
    } catch (error) {
      addLog('❌ Error al iniciar el servidor');
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Terminal Simulada
        </CardTitle>
        <CardDescription>
          Ejecuta los comandos necesarios para iniciar el servidor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleInstall} 
              disabled={isInstalling || isRunning}
              variant="outline"
            >
              {isInstalling ? 'Instalando...' : 'Instalar Dependencias'}
            </Button>
            <Button 
              onClick={handleStartServer} 
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Servidor Ejecutándose' : 'Iniciar Servidor'}
            </Button>
          </div>
          
          {logs.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
