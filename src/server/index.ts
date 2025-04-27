
import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import type { DatabaseConfig } from '../types/api.types';

const app = express();

// Configuración de CORS más permisiva para desarrollo
app.use(cors({
  origin: '*', // Permite todas las origenes en desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.post('/api/database/test', async (req, res) => {
  const config: DatabaseConfig = req.body;
  
  try {
    console.log('Recibida configuración SQL:', JSON.stringify(config, null, 2));
    
    if (config.type !== 'sqlserver') {
      return res.status(400).json({
        success: false,
        error: 'Solo se soporta SQL Server por el momento'
      });
    }

    const sqlConfig = {
      user: config.username,
      password: config.password,
      server: config.host,
      port: config.port,
      options: {
        encrypt: config.encrypt ?? false,
        trustServerCertificate: config.trustServerCertificate ?? true
      }
    };

    console.log('Intentando conectar con configuración SQL:', JSON.stringify({
      ...sqlConfig,
      password: '********' // No mostrar la contraseña en los logs
    }, null, 2));

    // Primer intento de conexión sin especificar una base de datos
    const pool = await sql.connect(sqlConfig);
    console.log('Conexión inicial exitosa');
    
    // Buscar bases de datos disponibles
    const result = await pool.request().query(`
      SELECT name 
      FROM sys.databases 
      WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')
      ORDER BY name
    `);

    await pool.close();
    console.log('Bases de datos encontradas:', result.recordset);

    return res.json({
      success: true,
      message: 'Conexión exitosa',
      data: result.recordset.map(db => ({
        value: db.name,
        label: db.name
      }))
    });

  } catch (error) {
    console.error('Error al conectar:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? `Error de conexión: ${error.message}` : 'Error desconocido al conectar'
    });
  }
});

// Ruta simple para verificar que el servidor está activo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor activo' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Para probar el servidor: http://localhost:${PORT}/api/health`);
  console.log(`El cliente web debería estar en http://localhost:8080`);
});
