
import { DatabaseConfigForm } from "@/components/DatabaseConfig";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mobilsoft - Gestor de Conexiones</h1>
        <DatabaseConfigForm />
      </div>
    </div>
  );
};

export default Index;
