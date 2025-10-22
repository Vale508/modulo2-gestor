import React, { useEffect, useState } from 'react';
import SideBar from '../Componentes/SideBar';
import Boleteria from '../Componentes/Boleteria';
import '../Css/Usuario.css';

function Usuario() {
    const [eventos, setEventos] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [artistas, setArtistas] = useState([]);
    const [boletas, setBoletas] = useState([]);
    const [editandoBoleta, setEditandoBoleta] = useState(null);
    const [eventoSeleccionado, setEventoSeleccionado] = useState('');
    const [artistaSeleccionado, setArtistaSeleccionado] = useState('');
    const [artistasPorEvento, setArtistasPorEvento] = useState([]);
    
    const [nuevoEvento, setNuevoEvento] = useState({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        hora_inicio: '',
        fecha_fin: '',
        hora_fin: ''
    });

    const [editandoEvento, setEditandoEvento] = useState(null);

    const [nuevoArtista, setNuevoArtista] = useState({
        nombre: '',
        genero_musical: '',
        ciudad_origen: ''
    });

    const [nuevaLocalidad, setNuevaLocalidad] = useState({
    tipo_localidad: '',
    valor_localidad: '',
    evento_id: '',
    cantidad_disponible: ''
    });

    const cargarDatos = async () => {
    try {
        const resEventos = await fetch('http://localhost:5000/api/todos-eventos');
        const dataEventos = await resEventos.json();
        setEventos(dataEventos.data || []);

        const resLocalidades = await fetch('http://localhost:5000/api/todas-localidades');
        const dataLocalidades = await resLocalidades.json();
        setLocalidades(dataLocalidades.data || []);

        const resArtistas = await fetch('http://localhost:5000/api/todos-artistas');
        const dataArtistas = await resArtistas.json();
        setArtistas(dataArtistas.data || []);

        const resBoletas = await fetch('http://localhost:5000/api/todas-boletas');
        const dataBoletas = await resBoletas.json();
        setBoletas(dataBoletas.data || []);
        
    } catch (error) {   
        console.error('Error al cargar datos:', error);
    }
    };


    useEffect(() => {
    cargarDatos();
    }, []);


    const handleChange = (e, setState) =>
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const enviarDatos = async (url, datos) => {
    try {
        const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
        await cargarDatos();
        }
    } catch (error) {
        console.error('Error al enviar datos:', error);
        alert('Error al enviar datos');
    }
    };


    const asociarArtista = async (e) => {
        e.preventDefault();
        if (!eventoSeleccionado || !artistaSeleccionado) return alert('Selecciona evento y artista');

        try {
            const res = await fetch('http://localhost:5000/api/asociar-artista', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventosId_Eventos: eventoSeleccionado,
                    artistasId_Artistas: artistaSeleccionado
                })
            });

            const data = await res.json();
            alert(data.message);
            if (data.success) cargarArtistasPorEvento(eventoSeleccionado);

        } catch (error) {
            console.error(error);
            alert('Error al asociar artista');
        }
    };

    const cargarArtistasPorEvento = async (idEvento) => {
        try {
            const res = await fetch(`http://localhost:5000/api/artistas-por-evento/${idEvento}`);
            const data = await res.json();
            if (data.success) setArtistasPorEvento(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarEvento = (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este evento?')) {
            fetch(`http://localhost:5000/api/eliminar-evento/${id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) cargarDatos();
                });
        }
    };

    const editarEvento = (evento) => {
        setEditandoEvento({
            ...evento,
            nombre: evento.Nombre,
            descripcion: evento.Descripcion,
            fecha_inicio: evento.Fecha_inicio,
            hora_inicio: evento.Hora_inicio,
            fecha_fin: evento.Fecha_fin,
            hora_fin: evento.Hora_fin
        });
    };

    const guardarCambios = async () => {
        try {
            const respuesta = await fetch(`http://localhost:5000/api/editar-evento/${editandoEvento.Id_Eventos}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editandoEvento)
            });

            const data = await respuesta.json();
            alert(data.message);
            if (data.success) {
                setEditandoEvento(null);
                cargarDatos();
            }
        } catch (error) {
            console.error('Error al editar evento:', error);
            alert('Error al editar evento');
        }
    };
    const eliminarBoleta = (id) => {
  if (window.confirm('¿Seguro que deseas eliminar esta boleta?')) {
    fetch(`http://localhost:5000/api/eliminar-boleta/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if (data.success) cargarDatos();
      });
  }
};

    const guardarBoleta = async () => {
  try {
    const body = {
      Valor: Number(editandoBoleta.Valor),
      Cantidad: Number(editandoBoleta.Cantidad),
      eventosId_Eventos: Number(editandoBoleta.eventosId_Eventos),
      localidadesId_Localidades: Number(editandoBoleta.localidadesId_Localidades),
    };

    const respuesta = await fetch(`http://localhost:5000/api/editar-boleta/${editandoBoleta.Id_Boletas}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await respuesta.json();
    alert(data.message);
    if (data.success) {
      setEditandoBoleta(null);
      cargarDatos();
    }
  } catch (error) {
    console.error('Error al editar boleta:', error);
    alert('Error al editar boleta');
  }
};
    return (
  <>
    <SideBar />
    <div className="main-content">
      <h2 className="titulo1">Registro de Eventos, Localidades y Artistas</h2>

      {/* Formulario agregar evento */}
      <h3>Agregar Evento</h3>
      <form onSubmit={e => { e.preventDefault(); enviarDatos('http://localhost:5000/api/agregar-evento', nuevoEvento); }}>
        <input name="nombre" placeholder="Nombre" onChange={e => handleChange(e, setNuevoEvento)} required />
        <input name="descripcion" placeholder="Descripción" onChange={e => handleChange(e, setNuevoEvento)} required />
        <input type="date" name="fecha_inicio" onChange={e => handleChange(e, setNuevoEvento)} required />
        <input type="time" name="hora_inicio" onChange={e => handleChange(e, setNuevoEvento)} required />
        <input type="date" name="fecha_fin" onChange={e => handleChange(e, setNuevoEvento)} required />
        <input type="time" name="hora_fin" onChange={e => handleChange(e, setNuevoEvento)} required />
        <button type="submit">Agregar Evento</button>
      </form>

      {/* Formulario agregar artista */}
      <h3>Agregar Artista</h3>
      <form onSubmit={e => { e.preventDefault(); enviarDatos('http://localhost:5000/api/agregar-artista', nuevoArtista); }}>
        <input name="nombre" placeholder="Nombre del artista" onChange={e => handleChange(e, setNuevoArtista)} required />
        <input name="genero_musical" placeholder="Género musical" onChange={e => handleChange(e, setNuevoArtista)} required />
        <input name="ciudad_origen" placeholder="Ciudad de origen" onChange={e => handleChange(e, setNuevoArtista)} required />
        <button type="submit">Agregar Artista</button>
      </form>

      {/* Formulario agregar localidad */}
      <h3>Agregar Localidad</h3>
      <form onSubmit={e => { e.preventDefault(); enviarDatos('http://localhost:5000/api/agregar-localidad', nuevaLocalidad); }}>
        <input name="tipo_localidad" placeholder="Tipo de localidad" onChange={e => handleChange(e, setNuevaLocalidad)} required />
        <input name="valor_localidad" type="number" placeholder="Valor" onChange={e => handleChange(e, setNuevaLocalidad)} required />
        <input name="cantidad_disponible" type="number" placeholder="Cantidad disponible" onChange={e => handleChange(e, setNuevaLocalidad)} required />
        <select name="evento_id" onChange={e => handleChange(e, setNuevaLocalidad)} required>
          <option value="">Seleccionar evento</option>
          {eventos.map(e => <option key={e.Id_Eventos} value={e.Id_Eventos}>{e.Nombre}</option>)}
        </select>
        <button type="submit">Agregar Localidad</button>
      </form>
          <Boleteria />
      {/* Formulario asociar artista a evento */}
      <h3>Asociar Artista a Evento</h3>
      <form onSubmit={asociarArtista}>
        <select value={eventoSeleccionado} onChange={e => { setEventoSeleccionado(e.target.value); cargarArtistasPorEvento(e.target.value); }} required>
          <option value="">Seleccionar Evento</option>
          {eventos.map(e => <option key={e.Id_Eventos} value={e.Id_Eventos}>{e.Nombre}</option>)}
        </select>

        <select value={artistaSeleccionado} onChange={e => setArtistaSeleccionado(e.target.value)} required>
          <option value="">Seleccionar Artista</option>
          {artistas.map(a => <option key={a.Id_Artistas} value={a.Id_Artistas}>{a.Nombre}</option>)}
        </select>

        <button type="submit">Asociar</button>
      </form>

      {/* Lista de artistas asociados */}
      {eventoSeleccionado && (
        <>
          <h4>Artistas asociados al evento seleccionado</h4>
          {artistasPorEvento.length === 0 ? (
            <p>No hay artistas asociados aún.</p>
          ) : (
            <ul>
              {artistasPorEvento.map(a => <li key={a.Id_Artistas}>{a.Nombre}</li>)}
            </ul>
          )}
        </>
      )}

      {/* Tabla de eventos */}
      <h2>Eventos Registrados</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map(e => (
            <tr key={e.Id_Eventos}>
              <td>{e.Id_Eventos}</td>
              <td>{e.Nombre}</td>
              <td>{e.Descripcion}</td>
              <td>{e.Fecha_inicio} {e.Hora_inicio}</td>
              <td>{e.Fecha_fin} {e.Hora_fin}</td>
              <td>
                <button onClick={() => editarEvento(e)}>Editar</button>
                <button onClick={() => eliminarEvento(e.Id_Eventos)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de artistas */}
      <h2>Artistas Registrados</h2>
      <table border="1">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Género</th><th>Ciudad</th></tr>
        </thead>
        <tbody>
          {artistas.map(a => (
            <tr key={a.Id_Artistas}>
              <td>{a.Id_Artistas}</td>
              <td>{a.Nombre}</td>
              <td>{a.Genero_musical}</td>
              <td>{a.Ciudad_origen}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de localidades */}
      <h2>Localidades Registradas</h2>
      <table border="1">
        <thead>
          <tr><th>ID</th><th>Tipo</th><th>Valor</th><th>Evento</th></tr>
        </thead>
        <tbody>
          {localidades.map(l => (
            <tr key={l.Id_Localidades}>
              <td>{l.Id_Localidades}</td>
              <td>{l.Tipo_localidad}</td>
              <td>{l.Valor_localidad}</td>
              <td>{l.eventosId_Eventos}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de boletas */}
      <h2>Boletas Registradas</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Valor</th>
            <th>Cantidad</th>
            <th>Evento</th>
            <th>Localidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {boletas.map(b => (
            <tr key={b.Id_Boletas}>
              <td>{b.Id_Boletas}</td>
              <td>{b.Valor}</td>
              <td>{b.Cantidad}</td>
              <td>{b.eventosId_Eventos}</td>
              <td>{b.localidadesId_Localidades}</td>
              <td>
                <button onClick={() => setEditandoBoleta(b)}>Editar</button>
                <button onClick={() => eliminarBoleta(b.Id_Boletas)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Modal de editar evento */}
    {editandoEvento && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Editar Evento #{editandoEvento.Id_Eventos}</h3>
          <form onSubmit={e => { e.preventDefault(); guardarCambios(); }}>
            <input name="nombre" value={editandoEvento.nombre} onChange={e => handleChange(e, setEditandoEvento)} placeholder="Nombre" required />
            <input name="descripcion" value={editandoEvento.descripcion} onChange={e => handleChange(e, setEditandoEvento)} placeholder="Descripción" required />
            <input type="date" name="fecha_inicio" value={editandoEvento.fecha_inicio} onChange={e => handleChange(e, setEditandoEvento)} required />
            <input type="time" name="hora_inicio" value={editandoEvento.hora_inicio} onChange={e => handleChange(e, setEditandoEvento)} required />
            <input type="date" name="fecha_fin" value={editandoEvento.fecha_fin} onChange={e => handleChange(e, setEditandoEvento)} required />
            <input type="time" name="hora_fin" value={editandoEvento.hora_fin} onChange={e => handleChange(e, setEditandoEvento)} required />
            <div className="modal-buttons">
              <button type="submit">Guardar Cambios</button>
              <button type="button" onClick={() => setEditandoEvento(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Modal de editar boleta */}
    {editandoBoleta && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Editar Boleta #{editandoBoleta.Id_Boletas}</h3>
          <form onSubmit={e => { e.preventDefault(); guardarBoleta(); }}>
            <input type="number" name="Valor" value={editandoBoleta.Valor} onChange={e => setEditandoBoleta({ ...editandoBoleta, Valor: e.target.value })} placeholder="Valor" required />
            <input type="number" name="Cantidad" value={editandoBoleta.Cantidad} onChange={e => setEditandoBoleta({ ...editandoBoleta, Cantidad: e.target.value })} placeholder="Cantidad" required />
            <input type="number" name="eventosId_Eventos" value={editandoBoleta.eventosId_Eventos} onChange={e => setEditandoBoleta({ ...editandoBoleta, eventosId_Eventos: e.target.value })} placeholder="ID Evento" required />
            <input type="number" name="localidadesId_Localidades" value={editandoBoleta.localidadesId_Localidades} onChange={e => setEditandoBoleta({ ...editandoBoleta, localidadesId_Localidades: e.target.value })} placeholder="ID Localidad" required />
            <div className="modal-buttons">
              <button type="submit">Guardar Cambios</button>
              <button type="button" onClick={() => setEditandoBoleta(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);

}

export default Usuario;
