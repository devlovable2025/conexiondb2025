
import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import type { DatabaseConfig } from '../types/api.types';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/database/test', async (req, res) => {
  const config: DatabaseConfig = req.body;
  
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

    // Intentar conectar
    const pool = await sql.connect(sqlConfig);
    
    // Consultar solo las bases de datos del usuario (excluyendo las del sistema)
    const result = await pool.request().query(`
      SELECT name 
      FROM sys.databases 
      WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')
      ORDER BY name
    `);

    await pool.close();

    return res.json({
      success: true,
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
