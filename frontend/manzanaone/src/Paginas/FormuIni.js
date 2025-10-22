import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Formuini = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (correo === '' || contrasena === '') {
      setMensaje('Por favor completa todos los campos.');
      return;
    }

    const datos = { correo, contrasena };

    try {
      setCargando(true);
      const respuesta = await fetch('http://localhost:5000/api/inisesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        const usuario = resultado.data;
console.log(usuario.Rol)
        alert(`¡Bienvenido ${usuario.Nombre}!`);
        localStorage.setItem('usuarios', JSON.stringify(usuario));

        if (usuario.Rol === 'Administrador') {
          navigate('/admin');
        } else {
          navigate('/usuario');
        }
      } else {
        setMensaje(resultado.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const irRegistro = () => {
    navigate('/registro');
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <div className="formulario">
        <h2 className="tituloini">Inicio Sesión</h2>
        <form onSubmit={manejarEnvio}>
          <div>
            <label>Correo:</label>
            <input
              type="text"
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
          <button type="submit" disabled={cargando}>
            {cargando ? 'Cargando...' : 'Ingresar'}
          </button>
          {mensaje && (
            <p style={{ marginTop: '10px', color: mensaje.includes('exitoso') ? 'green' : 'red' }}>
              {mensaje}
            </p>
          )}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ margin: '10px 0', fontSize: '20px' }} className="texto">¿No tienes cuenta?</p>
            <button type="button" onClick={irRegistro}>Regístrate</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formuini;