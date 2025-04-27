
import React from 'react';
import { Button } from '../ui/button';
import { Terminal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { InfoIcon } from 'lucide-react';

export function ServerInstructions() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 w-full">
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
}
