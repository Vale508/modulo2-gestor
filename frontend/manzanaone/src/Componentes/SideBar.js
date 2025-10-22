import React from "react";
import Logo from '../Img/logo1.jpg';
import '../Css/SideBar.css';

function SideBar() {
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
                <button className="usuario">Boleteria</button>
            </div>
        </div>
    );
}

export default SideBar;
