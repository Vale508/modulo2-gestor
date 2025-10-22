  import React from 'react';
  import Admin from '../Paginas/Administrador';
  import Formuregis from '../Paginas/FormuRegis';
  import Formuini from '../Paginas/FormuIni';
  import Usuario from '../Paginas/Usuario'
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Formuini  />} />
          <Route path="/registro" element={<Formuregis />} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/usuario" element={<Usuario/>} />
        </Routes>
      </Router>
    );
  }

  export default App;
