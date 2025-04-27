
import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import type { DatabaseConfig } from '../types/api.types';

const app = express();

// Configuración de CORS para producción y desarrollo
const allowedOrigins = [
  'https://preview--conexiondb2025.lovable.app',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
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
      encrypt: config.encrypt ?? true,
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

    try {
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
    } catch (sqlError: any) {
      // Capturar errores específicos de SQL Server
      console.error('Error SQL detallado:', sqlError);
      
      // Extraer información útil del error
      const errorCode = sqlError.code || 'UNKNOWN';
      const errorNumber = sqlError.number || 'UNKNOWN';
      const errorState = sqlError.state || 'UNKNOWN';
      const errorMessage = sqlError.message || 'Error desconocido de SQL Server';
      
      let errorDescription = `Error SQL (${errorCode}): ${errorMessage}`;
      
      // Mensajes de error más amigables para errores comunes
      if (errorCode === 'ETIMEOUT') {
        errorDescription = 'Tiempo de espera agotado al intentar conectar al servidor. Verifique que el servidor esté activo y accesible.';
      } else if (errorCode === 'ELOGIN') {
        errorDescription = 'Error de autenticación: Nombre de usuario o contraseña incorrectos.';
      } else if (errorNumber === 4060) {
        errorDescription = 'No se puede abrir la base de datos solicitada. Verifique el nombre de la base de datos.';
      } else if (errorNumber === 18456) {
        errorDescription = 'Error de login: Usuario o contraseña incorrectos.';
      } else if (errorCode === 'ESOCKET') {
        errorDescription = 'Error de conexión: No se puede establecer una conexión con el servidor. Verifique que la dirección IP y el puerto sean correctos.';
      }

      return res.status(400).json({
        success: false,
        error: errorDescription,
        errorDetails: {
          code: errorCode,
          number: errorNumber,
          state: errorState,
          originalMessage: errorMessage
        }
      });
    }

  } catch (error) {
    console.error('Error al conectar:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al conectar',
      errorDetails: { 
        type: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : null
      }
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
