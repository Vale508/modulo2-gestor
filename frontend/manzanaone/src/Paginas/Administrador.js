import React, { useEffect, useState } from 'react';
import SideBar from '../Componentes/SideBar';
import Boleteria from '../Componentes/Boleteria';
import '../Css/Usuario.css';

function Usuario() {
    const [eventos, setEventos] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [artistas, setArtistas] = useState([]);

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
        evento_id: ''
    });

    const cargarDatos = () => {
        fetch('http://localhost:5000/api/todos-eventos')
            .then(res => res.json())
            .then(data => setEventos(data.data || []));
        fetch('http://localhost:5000/api/todas-localidades')
            .then(res => res.json())
            .then(data => setLocalidades(data.data || []));
        fetch('http://localhost:5000/api/todos-artistas')
            .then(res => res.json())
            .then(data => setArtistas(data.data || []));
    };

    useEffect(() => { cargarDatos(); }, []);

    const handleChange = (e, setState) =>
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const enviarDatos = (url, datos) => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.success) cargarDatos();
            });
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

    return (
        <>
        
            <SideBar />
            <Boleteria/>
            <div className="main-content">
                <h2 className="titulo1">Registro de Eventos, Localidades y Artistas</h2>

                {/* FORMULARIO AGREGAR EVENTO */}
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

                {/* FORMULARIOS DE ARTISTAS Y LOCALIDADES */}
                <h3>Agregar Artista</h3>
                <form onSubmit={e => { e.preventDefault(); enviarDatos('http://localhost:5000/api/agregar-artista', nuevoArtista); }}>
                    <input name="nombre" placeholder="Nombre del artista" onChange={e => handleChange(e, setNuevoArtista)} required />
                    <input name="genero_musical" placeholder="Género musical" onChange={e => handleChange(e, setNuevoArtista)} required />
                    <input name="ciudad_origen" placeholder="Ciudad de origen" onChange={e => handleChange(e, setNuevoArtista)} required />
                    <button type="submit">Agregar Artista</button>
                </form>

                <h3>Agregar Localidad</h3>
                <form onSubmit={e => { e.preventDefault(); enviarDatos('http://localhost:5000/api/agregar-localidad', nuevaLocalidad); }}>
                    <input name="tipo_localidad" placeholder="Tipo de localidad" onChange={e => handleChange(e, setNuevaLocalidad)} required />
                    <input name="valor_localidad" type="number" placeholder="Valor" onChange={e => handleChange(e, setNuevaLocalidad)} required />
                    <select name="evento_id" onChange={e => handleChange(e, setNuevaLocalidad)} required>
                        <option value="">Seleccionar evento</option>
                        {eventos.map(e => <option key={e.Id_Eventos} value={e.Id_Eventos}>{e.Nombre}</option>)}
                    </select>
                    <button type="submit">Agregar Localidad</button>
                </form>

                {/* TABLA DE EVENTOS */}
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

                {/* TABLAS RESTANTES */}
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
            </div>

            {/* MODAL DE EDICIÓN */}
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
        </>
    );
}

export default Usuario;
