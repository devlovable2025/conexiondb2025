
import { DatabaseConfigForm } from "@/components/DatabaseConfig";
import { Database } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-10 gap-4">
          <Database className="w-12 h-12 text-primary" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-center">Mobilsoft - Gestor de Conexiones</h1>
        </div>
        <DatabaseConfigForm />
      </div>
    </div>
  );
};

export default Index;
