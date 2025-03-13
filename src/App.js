import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import PhotoGallery from './components/PhotoGallery';
import Guestbook from './components/Guestbook';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/photos" element={<PhotoGallery />} />
          <Route path="/guestbook" element={<Guestbook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
