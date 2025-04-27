
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
  
  console.log('Recibida solicitud de prueba de conexión con configuración:', JSON.stringify(config, null, 2));
  
  try {
    const sqlConfig = {
      user: config.username,
      password: config.password,
      server: config.host,
      port: config.port,
      database: config.database,
      options: {
        encrypt: config.encrypt ?? false,
        trustServerCertificate: config.trustServerCertificate ?? false,
        instanceName: config.instanceName
      }
    };

    console.log('Intentando conectar con configuración SQL:', JSON.stringify(sqlConfig, null, 2));

    // Intentar conectar
    const pool = await sql.connect(sqlConfig);
    console.log('Conexión exitosa');
    
    // Consultar solo las bases de datos del usuario (excluyendo las del sistema)
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
      error: error instanceof Error ? error.message : 'Error desconocido al conectar'
    });
  }
});

// Ruta simple para verificar que el servidor está activo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor activo' });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Para probar el servidor: http://localhost:8000/api/health');
});
