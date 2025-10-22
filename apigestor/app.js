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
  const { nombre,tipo_documento, documento, correo, contrasena, rolId_Rol } = req.body;
  console.log(nombre,tipo_documento, documento, correo, contrasena, rolId_Rol);
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
      `INSERT INTO usuarios (Nombre,Tipo_documento, Documento, Correo, Contraseña, rolId_Rol)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre,tipo_documento, documento, correo, contrasena, rolId_Rol]
    );
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: { nombre,tipo_documento, documento, correo, rolId_Rol }
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





// ============= Eventos =============

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


// ============= Artistas =============

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

// Asociar artista a un evento
app.post('/api/asociar-artista', async (req, res) => {
  const { eventosId_Eventos, artistasId_Artistas } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(db);
    console.log('Asociando artista:', eventosId_Eventos, artistasId_Artistas);

    // Verificar si ya existe la asociación
    const [existe] = await connection.execute(
      `SELECT * FROM entity8 WHERE eventosId_Eventos = ? AND artistasId_Artistas = ?`,
      [eventosId_Eventos, artistasId_Artistas]
    );

    if (existe.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este artista ya está asociado a este evento. No se puede asociar nuevamente.' 
      });
    }

    // Si no existe, insertar la asociación
    await connection.execute(
      `INSERT INTO entity8 (eventosId_Eventos, artistasId_Artistas) VALUES (?, ?)`,
      [eventosId_Eventos, artistasId_Artistas]
    );

    res.json({ success: true, message: 'Artista asociado al evento correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al asociar artista' });
  } finally {
    if (connection) await connection.end();
  }
});


// Obtener artistas de un evento
app.get('/api/artistas-por-evento/:idEvento', async (req, res) => {
  const { idEvento } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [rows] = await connection.execute(
      `SELECT a.* 
       FROM artistas a
       JOIN entity8 ea ON a.Id_Artistas = ea.artistasId_Artistas
       WHERE ea.eventosId_Eventos = ?`,
      [idEvento]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener artistas del evento' });
  } finally {
    if (connection) await connection.end();
  }
});

// ============= Localidades =============

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

//Registrar boletas
app.post('/api/agregar-boleta', async (req, res) => {
  const { valor, cantidad,eventosId_Eventos, localidadesId_Localidades } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(db);
    console.log("Datos recibidos:", req.body);
    const [evento] = await connection.execute(
      'SELECT * FROM eventos WHERE Id_Eventos = ?',
      [eventosId_Eventos]
    );
    if (evento.length === 0) {
      return res.status(400).json({ success: false, message: 'El evento no existe' });
    }
    const [localidad] = await connection.execute(
      'SELECT * FROM localidades WHERE Id_Localidades = ?',
      [localidadesId_Localidades]
    );
    if (localidad.length === 0) {
      return res.status(400).json({ success: false, message: 'La localidad no existe' });
    }

    // Insertar la boleta
    await connection.execute(
      `INSERT INTO boletas (Valor, Cantidad, eventosId_Eventos, localidadesId_Localidades)
       VALUES (?, ?, ?, ?)`,
      [valor, cantidad, eventosId_Eventos, localidadesId_Localidades]
    );

    res.status(201).json({ success: true, message: 'Boleta agregada correctamente' });
  } catch (error) {
    console.error("Error al agregar boleta:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  } finally {
    if (connection) await connection.end();
  }
  //Listar todas las boletas
app.get('/api/todas-boletas', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [boletas] = await connection.execute(`
      SELECT 
        b.Id_Boletas,
        b.Valor,
        b.Cantidad,
        e.Nombre AS Evento,
        l.Tipo_localidad AS Localidad,
        b.eventosId_Eventos,
        b.localidadesId_Localidades,
        b.compraId_Compra
      FROM boletas b
      JOIN eventos e ON b.eventosId_Eventos = e.Id_Eventos
      JOIN localidades l ON b.localidadesId_Localidades = l.Id_Localidades
    `);

    res.json({ success: true, data: boletas });
  } catch (error) {
    console.error('Error al listar boletas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener boletas', error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});


app.put('/api/editar-boleta/:id', async (req, res) => {
  const { id } = req.params;
  let { Valor, Cantidad, eventosId_Eventos, localidadesId_Localidades } = req.body;

  Valor = Number(Valor);
  Cantidad = Number(Cantidad);
  eventosId_Eventos = Number(eventosId_Eventos);
  localidadesId_Localidades = Number(localidadesId_Localidades);

  let connection;
  try {
    connection = await mysql.createConnection(db);
    console.log("Editando boleta ID:", id, req.body);

    const [boleta] = await connection.execute('SELECT * FROM boletas WHERE Id_Boletas = ?', [id]);
    if (boleta.length === 0) {
      return res.status(404).json({ success: false, message: 'Boleta no encontrada' });
    }

    await connection.execute(
      `UPDATE boletas 
       SET Valor = ?, Cantidad = ?, eventosId_Eventos = ?, localidadesId_Localidades = ?
       WHERE Id_Boletas = ?`,
      [Valor, Cantidad, eventosId_Eventos, localidadesId_Localidades, id]
    );

    res.json({ success: true, message: 'Boleta actualizada correctamente' });
  } catch (error) {
    console.error("Error al editar boleta:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});


// Eliminar boleta
app.delete('/api/eliminar-boleta/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.execute('DELETE FROM boletas WHERE Id_Boletas = ?', [id]);
    res.json({ success: true, message: 'Boleta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar boleta:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar boleta' });
  } finally {
    if (connection) await connection.end();
  }
});
});


//cerrar sesion
app.post('/api/cerrarsesi', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir sesión:', err);
      return res.status(500).json({ success: false, message: 'Error al cerrar la sesión' });
    }
    res.clearCookie('connect.sid'); 
    res.json({ success: true, message: 'Sesión cerrada' });
  });
});

app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));