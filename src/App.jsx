// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Encomendas from './pages/Encomendas';
import MenuRadial from './components/MenuRadial';

function App() {
  return (
    <div>
      <MenuRadial />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/encomendas" element={<Encomendas />} />
      </Routes>
    </div>
  );
}

export default App;
