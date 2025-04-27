
import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import type { DatabaseConfig } from '../types/api.types';

const app = express();

// Configuración de CORS para producción y desarrollo
const allowedOrigins = [
  'https://preview--conexiondb2025.lovable.app',
  //'http://localhost:8080',
  //'http://127.0.0.1:8080'
];

app.use(cors({
  origin: function(origin, callback){
    // Permitir solicitudes sin origen (como solicitudes de herramientas de desarrollo)
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
    console.log('Recibida solicitud de prueba de conexión con config:', JSON.stringify(config, null, 2));
    
    // Configuración de las opciones SQL Server con valores por defecto más seguros
    const options: any = {
      encrypt: config.encrypt ?? false,
      trustServerCertificate: config.trustServerCertificate ?? true,
      connectTimeout: 30000, // Aumentamos el timeout de conexión
      requestTimeout: 30000   // Aumentamos el timeout de solicitudes
    };

    const sqlConfig = {
      user: config.username,
      password: config.password,
      server: config.host,
      port: config.port,
      database: config.database,
      options: options
    };

    console.log('Intentando conectar con configuración SQL:', JSON.stringify({
      ...sqlConfig,
      password: '******' // Ocultamos la contraseña en los logs
    }, null, 2));

    const pool = await sql.connect(sqlConfig);
    console.log('Conexión exitosa');
    
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

// Aseguramos que el puerto 3002 sea usado
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Para probar el servidor: http://localhost:${PORT}/api/health`);
});
