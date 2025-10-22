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

//Registrar usuarios
app.post('/api/regisesion', async (req, res) => {
  const { nombre, documento, correo, contrasena, rolId_Rol } = req.body;
  console.log(nombre, documento, correo, contrasena, rolId_Rol);
  if (!nombre || !documento || !correo || !contrasena || !rolId_Rol) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios.'
    });
  }

  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE Correo = ? OR Documento = ?',
      [correo, documento]
    );
    if (rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El usuario ya existe con ese correo o documento.'
      });
    }
    await connection.execute(
      `INSERT INTO usuarios (Nombre, Documento, Correo, Contraseña, rolId_Rol)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, documento, correo, contrasena, rolId_Rol]
    );
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: { nombre, documento, correo, rolId_Rol }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  } finally {
    if (connection) await connection.end();
  }
});

//Iniciar sesion
app.post('/api/inisesion', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(db);

    const [rows] = await connection.execute(
      `SELECT u.*, r.Rol AS Rol
       FROM usuarios u
       INNER JOIN rol r ON u.rolId_Rol = r.Id_Rol
       WHERE u.Correo = ? AND u.Contraseña = ?`,
      [correo, contrasena]
    );

    console.log('Resultado de la consulta:', rows);

    if (rows.length > 0) {
      const usuario = rows[0];
      req.session.usuario = usuario;
      console.log('Sesión guardada:', req.session.usuario);

      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: usuario,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos',
      });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  } finally {
    if (connection) await connection.end();
  }
});





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

// Editar evento
app.put('/api/editar-evento/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fecha_inicio, hora_inicio, fecha_fin, hora_fin } = req.body;
  let connection;
  if (!nombre || !descripcion || !fecha_inicio || !hora_inicio || !fecha_fin || !hora_fin) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' });
  }
  try {
    connection = await mysql.createConnection(db);

    const [resultado] = await connection.execute(
      `UPDATE eventos 
       SET Nombre = ?, Descripcion = ?, Fecha_inicio = ?, Hora_inicio = ?, Fecha_fin = ?, Hora_fin = ?
       WHERE Id_Eventos = ?`,
      [nombre, descripcion, fecha_inicio, hora_inicio, fecha_fin, hora_fin, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' });
    }

    res.json({ success: true, message: 'Evento actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al editar evento:', error);
    res.status(500).json({ success: false, message: 'Error al editar evento.' });
  } finally {
    if (connection) await connection.end();
  }
});

// Eliminar evento
app.delete('/api/eliminar-evento/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await mysql.createConnection(db);
    await connection.execute('DELETE FROM localidades WHERE eventosId_Eventos = ?', [id]);
    const [resultado] = await connection.execute(
      'DELETE FROM eventos WHERE Id_Eventos = ?',
      [id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.json({ success: true, message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar evento' });
  } finally {
    if (connection) await connection.end();
  }
});


// ============= ARTISTAS =============

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

// ============= LOCALIDADES =============

// Agregar localidad
app.post('/api/agregar-localidad', async (req, res) => {
  const { tipo_localidad, valor_localidad, evento_id, cantidad_disponible } = req.body;
  let connection;

  try {
    connection = await mysql.createConnection(db);
    await connection.execute(
      `INSERT INTO localidades (Tipo_localidad, Valor_localidad, eventosId_Eventos, Cantidad_disponible)
       VALUES (?, ?, ?, ?)`,
      [tipo_localidad, valor_localidad, evento_id, cantidad_disponible || 0]
    );
    res.json({ success: true, message: 'Localidad registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar localidad:', error);
    res.status(500).json({ success: false, message: 'Error al registrar localidad' });
  } finally {
    if (connection) await connection.end();
  }
});

// Obtener todas las localidades de un evento con disponibilidad
app.get('/api/localidades-disponibles/:idEvento', async (req, res) => {
  const { idEvento } = req.params;
  let connection;

  try {
    connection = await mysql.createConnection(db);
    const [rows] = await connection.execute(
      `SELECT * FROM localidades 
       WHERE eventosId_Eventos = ? AND Cantidad_disponible > 0`,
      [idEvento]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener localidades:', error);
    res.status(500).json({ success: false, message: 'Error al obtener localidades' });
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

app.post('/api/agregar-boleta', async (req, res) => {
  const { valor, cantidad, eventosId_Eventos, localidadesId_Localidades } = req.body;
  let connection;

  try {
    connection = await mysql.createConnection(db);

    // Validar disponibilidad de la localidad
    const [loc] = await connection.execute(
      'SELECT Cantidad_disponible FROM localidades WHERE Id_Localidades = ?',
      [localidadesId_Localidades]
    );

    if (loc.length === 0) {
      return res.status(404).json({ success: false, message: 'Localidad no encontrada' });
    }

    const disponible = loc[0].Cantidad_disponible;
    if (cantidad > disponible) {
      return res.status(400).json({ success: false, message: `Solo hay ${disponible} boletas disponibles.` });
    }

    // Registrar boleta
    const serial = `BOL-${Math.floor(Math.random() * 1000000)}`;
    await connection.execute(
      `INSERT INTO boletas (Valor, Serial, Cantidad, eventosId_Eventos, localidadesId_Localidades)
       VALUES (?, ?, ?, ?, ?)`,
      [valor, serial, cantidad, eventosId_Eventos, localidadesId_Localidades]
    );

    // Actualizar disponibilidad
    await connection.execute(
      'UPDATE localidades SET Cantidad_disponible = Cantidad_disponible - ? WHERE Id_Localidades = ?',
      [cantidad, localidadesId_Localidades]
    );

    res.json({ success: true, message: 'Boletas registradas correctamente' });
  } catch (error) {
    console.error('Error al registrar boleta:', error);
    res.status(500).json({ success: false, message: 'Error al registrar boleta' });
  } finally {
    if (connection) await connection.end();
  }
});


app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));