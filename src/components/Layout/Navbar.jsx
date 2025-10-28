import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🐄 Granja Inteligente</h1>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/animals">Animales</Link></li>
        <li><Link to="/corrals">Corrales</Link></li>
        <li><Link to="/sensors">Sensores</Link></li>
        <li><Link to="/feeding">Alimentación</Link></li>
        <li><Link to="/patterns">Patrones</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;