// src/components/MenuRadial.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineHome, AiOutlineContainer, AiOutlineUser, AiOutlineShoppingCart } from 'react-icons/ai'; // Ajuste o nome do ícone
import './MenuRadial.css';

const MenuRadial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`menu-radial ${isOpen ? 'open' : ''}`}>
      <button className="menu-btn" onClick={toggleMenu}>
        {isOpen ? '×' : '☰'} {/* Ícones de fechar e menu */}
      </button>
      <div className="menu-items">
        <Link 
          to="/" 
          className={`menu-item ${location.pathname === '/' ? 'active' : ''}`} 
          title="Início"
        >
          <AiOutlineHome size={24} />
        </Link>
        <Link 
          to="/encomendas" 
          className={`menu-item ${location.pathname === '/encomendas' ? 'active' : ''}`} 
          title="Encomendas"
        >
          <AiOutlineShoppingCart size={24} />
        </Link>
        <Link 
          to="/clientes" 
          className={`menu-item ${location.pathname === '/clientes' ? 'active' : ''}`} 
          title="Clientes"
        >
          <AiOutlineUser size={24} />
        </Link>
        <Link 
          to="/produtos" 
          className={`menu-item ${location.pathname === '/produtos' ? 'active' : ''}`} 
          title="Produtos"
        >
          <AiOutlineContainer size={24} /> {/* Ícone ajustado */}
        </Link>
      </div>
    </div>
  );
};

export default MenuRadial;
