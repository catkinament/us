// src/components/Header.js
import React from 'react';
import "../css/Header.css";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='header'>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/photos">Photo</Link></li>
          <li><Link to="/guestbook">Guestbook</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
