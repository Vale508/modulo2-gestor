import React from "react";
import { useNavigate } from 'react-router-dom';
import Logo from '../Img/logo1.jpg';
import '../Css/SideBar.css';

function SideBar() {
    const navigate = useNavigate();
    const cerrarSesion = () => {
    fetch('http://localhost:5000/api/cerrarsesi', {
      method: 'POST',
      credentials: 'include'
       })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Sesión cerrada correctamente');
          navigate('/'); 
        } else {
          alert('No se pudo cerrar la sesión');
        }
      })
      .catch(err => {
        console.error('Error al cerrar sesión:', err);
        alert('Error al cerrar sesión');
    });
}
    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src={Logo} alt="Logo" />
            </div>

            <div className="menu-item">
                <span>Eventos</span>
                <span>Localidades</span>
                <span>Artistas</span>
            </div>

            <div>
                <button className="usuario">Perfil Usuario</button>
            </div>
            <button className="cerrarsesi" onClick={cerrarSesion}>
                Cerrar Sesión
            </button>
        </div>
    );
}

export default SideBar;
