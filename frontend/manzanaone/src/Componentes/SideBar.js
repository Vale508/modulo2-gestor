import React from "react";
import Logo from '../Img/logo1.jpg'
import '../Css/SideBar.css'
function SideBar(){
    return(
        <div className="sidebar">
            <div className="log-container">
                <div>
                    <img src={Logo} alt="Hola"/>
                </div>
                <div className="menu-item">
                    <span>Eventos</span>
                    <span>Localidades</span>
                    <span>Artistas</span>
                </div>
                <div>
                    <button className="usuario">Perfil Usuario</button>
                </div>
            </div>
        </div>
        
    )
}
export default SideBar;