import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import AnimalsPage from './pages/AnimalsPage';
import CorralsPage from './pages/CorralsPage';
import SensorsPage from './pages/SensorsPage';
import FeedingPage from './pages/FeedingPage';
import PatternsPage from './pages/PatternsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/animals" element={<AnimalsPage />} />
            <Route path="/corrals" element={<CorralsPage />} />
            <Route path="/sensors" element={<SensorsPage />} />
            <Route path="/feeding" element={<FeedingPage />} />
            <Route path="/patterns" element={<PatternsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;