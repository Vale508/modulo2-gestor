const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const session = require('express-session');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'clave-ultra-secretaa',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'lax' }
}));

// Configuración base de datos
const db = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_eventos'
};

const handleDbError = (error, res) => {
  console.error('Error de base de datos:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};

// ============= CRUD: EVENTOS =============

// Agregar evento
app.post('/api/agregar-evento', async (req, res) => {
  const { nombre, descripcion, fecha_inicio, hora_inicio, fecha_fin, hora_fin } = req.body;
  if (!nombre || !descripcion) return res.json({ success: false, message: 'Faltan campos obligatorios' });

  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.execute(
      `INSERT INTO eventos (Nombre, Descripcion, Fecha_inicio, Hora_inicio, Fecha_fin, Hora_fin) VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, fecha_inicio, hora_inicio, fecha_fin, hora_fin]
    );
    res.json({ success: true, message: 'Evento agregado correctamente' });
  } catch (error) {
    handleDbError(error, res);
  } finally {
    if (connection) await connection.end();
  }
});

// Obtener todos los eventos
app.get('/api/todos-eventos', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [eventos] = await connection.execute('SELECT * FROM eventos');
    res.json({ success: true, data: eventos });
  } catch (error) {
    handleDbError(error, res);
  } finally {
    if (connection) await connection.end();
  }
});

// ============= CRUD: ARTISTAS =============

// Agregar artista
app.post('/api/agregar-artista', async (req, res) => {
  const { nombre, genero_musical, ciudad_origen } = req.body;
  if (!nombre || !genero_musical) return res.json({ success: false, message: 'Faltan campos obligatorios' });

  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.execute(
      `INSERT INTO artistas (Nombre, Genero_musical, Ciudad_origen) VALUES (?, ?, ?)`,
      [nombre, genero_musical, ciudad_origen]
    );
    res.json({ success: true, message: 'Artista agregado correctamente' });
  } catch (error) {
    handleDbError(error, res);
  } finally {
    if (connection) await connection.end();
  }
});

// Obtener todos los artistas
app.get('/api/todos-artistas', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [artistas] = await connection.execute('SELECT * FROM artistas');
    res.json({ success: true, data: artistas });
  } catch (error) {
    handleDbError(error, res);
  } finally {
    if (connection) await connection.end();
  }
});

// ============= CRUD: LOCALIDADES =============

// Agregar localidad
app.post('/api/agregar-localidad', async (req, res) => {
  const { tipo_localidad, valor_localidad, evento_id } = req.body;
  if (!tipo_localidad || !valor_localidad || !evento_id) return res.json({ success: false, message: 'Faltan campos' });

  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.execute(
      `INSERT INTO localidades (Tipo_localidad, Valor_localidad, eventosId_Eventos, \`Column\`) VALUES (?, ?, ?, 0)`,
      [tipo_localidad, valor_localidad, evento_id]
    );
    res.json({ success: true, message: 'Localidad agregada correctamente' });
  } catch (error) {
    handleDbError(error, res);
  } finally {
    if (connection) await connection.end();
  }
});

// Obtener todas las localidades
app.get('/api/todas-localidades', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [localidades] = await connection.execute('SELECT * FROM localidades');
    res.json({ success: true, data: localidades });
  } catch (error) {
    handleDbError(error, res);
  } finally {
    if (connection) await connection.end();
  }
});

app.listen(5000, () => console.log('✅ Servidor corriendo en http://localhost:5000'));