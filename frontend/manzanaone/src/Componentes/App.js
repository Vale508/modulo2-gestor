  import React from 'react';
  import Usuario from '../Paginas/Administrador';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Usuario />} />
        </Routes>
      </Router>
    );
  }

  export default App;
