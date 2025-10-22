import React, { useState } from 'react';

const Formuregis = () => {
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rolId_Rol, setRolId_Rol] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarRegistro = async (e) => {
    e.preventDefault();

    if (!nombre || !documento || !correo || !contrasena || !rolId_Rol) {
      setMensaje('Todos los campos son obligatorios.');
      return;
    }

    const datos = { nombre, documento, correo, contrasena, rolId_Rol };

    try {
      const respuesta = await fetch('http://localhost:5000/api/regisesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        setMensaje('Registro exitoso');
        setNombre('');
        setDocumento('');
        setCorreo('');
        setContrasena('');
        setRolId_Rol('');
      } else {
        setMensaje(resultado.message || 'Error al registrar');
      }
    } catch (error) {
      setMensaje('Error al conectar con el servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <div className="formulario">
        <h2>Registrarse</h2>
        <form onSubmit={manejarRegistro}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Documento:</label>
            <input
              type="number"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Correo:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Rol:</label>
            <select
              value={rolId_Rol}
              onChange={(e) => setRolId_Rol(e.target.value)}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="1">Administrador</option>
              <option value="2">Comprador</option>
            </select>
          </div>

          <button type="submit">Registrar</button>
        </form>

        {mensaje && (
          <p style={{ marginTop: '10px', color: 'blue' }}>{mensaje}</p>
        )}
      </div>
    </div>
  );
};

export default Formuregis;
