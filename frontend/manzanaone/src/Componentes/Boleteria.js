import React, { useEffect, useState } from 'react';

function Boleteria() {
  const [eventos, setEventos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [form, setForm] = useState({
    valor: '',
    cantidad: '',
    eventosId_Eventos: '',
    localidadesId_Localidades: ''
  });

  // Cargar eventos
  useEffect(() => {
    fetch('http://localhost:5000/api/todos-eventos')
      .then(res => res.json())
      .then(data => setEventos(data.data || []));
  }, []);

  // Cargar localidades disponibles según evento
  const cargarLocalidades = (idEvento) => {
    fetch(`http://localhost:5000/api/localidades-disponibles/${idEvento}`)
      .then(res => res.json())
      .then(data => setLocalidades(data.data || []));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'eventosId_Eventos') {
      cargarLocalidades(e.target.value);
    }
  };

  const enviarDatos = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/agregar-boleta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => alert(data.message));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Módulo de Boletería</h2>

      <form onSubmit={enviarDatos}>
        <label>Evento:</label>
        <select name="eventosId_Eventos" onChange={handleChange} required>
          <option value="">Seleccionar evento</option>
          {eventos.map(ev => (
            <option key={ev.Id_Eventos} value={ev.Id_Eventos}>{ev.Nombre}</option>
          ))}
        </select>

        <label>Localidad:</label>
        <select name="localidadesId_Localidades" onChange={handleChange} required>
          <option value="">Seleccionar localidad</option>
          {localidades.map(loc => (
            <option key={loc.Id_Localidades} value={loc.Id_Localidades}>
              {loc.Tipo_localidad} (Disponibles: {loc.Cantidad_disponible})
            </option>
          ))}
        </select>

        <input type="number" name="valor" placeholder="Valor boleta" onChange={handleChange} required />
        <input type="number" name="cantidad" placeholder="Cantidad" onChange={handleChange} required />

        <button type="submit">Registrar Boleta</button>
      </form>
    </div>
  );
}

export default Boleteria;
