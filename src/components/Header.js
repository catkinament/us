// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/photos">照片展示</Link></li>
          <li><Link to="/guestbook">留言板</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
