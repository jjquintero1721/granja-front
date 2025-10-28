import React, { useState } from 'react';
import { corralsAPI } from '../../services/api';
import './CorralCard.css';

const CorralCard = ({ corral, onUpdate }) => {
  const [showActions, setShowActions] = useState(false);
  const [strategy, setStrategy] = useState('normal');
  const [loading, setLoading] = useState(false);

  const handleFeed = async () => {
    setLoading(true);
    try {
      const response = await corralsAPI.feed(corral.id, { cantidad_kg: 50 });
      alert('Alimentación ejecutada: ' + JSON.stringify(response.data));
      onUpdate();
    } catch (error) {
      console.error('Error feeding corral:', error);
      alert('Error al alimentar');
    } finally {
      setLoading(false);
    }
  };

  const handleGetPlan = async () => {
    setLoading(true);
    try {
      const response = await corralsAPI.feedingPlan(corral.id, { strategy });
      alert('Plan de alimentación:\n' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error getting plan:', error);
      alert('Error al obtener plan');
    } finally {
      setLoading(false);
    }
  };

  const getOccupancyColor = () => {
    const percentage = (corral.current_animals_count / corral.capacity) * 100;
    if (percentage >= 90) return '#dc3545';
    if (percentage >= 70) return '#ffc107';
    return '#28a745';
  };

  const getAnimalIcon = (type) => {
    const icons = {
      'VACA': '🐄',
      'CERDO': '🐷',
      'GALLINA': '🐔'
    };
    return icons[type] || '🏠';
  };

  return (
    <div className="corral-card">
      <div className="corral-header">
        <span className="corral-icon">{getAnimalIcon(corral.animal_type)}</span>
        <h3>{corral.name}</h3>
      </div>

      <div className="corral-info">
        <p><strong>Tipo:</strong> {corral.animal_type}</p>
        <p><strong>Ubicación:</strong> {corral.location}</p>
        <p><strong>Capacidad:</strong> {corral.current_animals_count} / {corral.capacity}</p>

        <div className="occupancy-bar">
          <div
            className="occupancy-fill"
            style={{
              width: `${(corral.current_animals_count / corral.capacity) * 100}%`,
              backgroundColor: getOccupancyColor()
            }}
          ></div>
        </div>

        <div className="metrics">
          <div className="metric">
            <span className="metric-label">🌡️ Temperatura</span>
            <span className="metric-value">{corral.temperature}°C</span>
          </div>
          <div className="metric">
            <span className="metric-label">💧 Humedad</span>
            <span className="metric-value">{corral.humidity}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">🥗 Alimento</span>
            <span className="metric-value">{corral.food_level}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">💦 Agua</span>
            <span className="metric-value">{corral.water_level}%</span>
          </div>
        </div>
      </div>

      <div className="corral-actions">
        <button
          className="btn-secondary"
          onClick={() => setShowActions(!showActions)}
          disabled={loading}
        >
          {showActions ? 'Ocultar' : 'Acciones'}
        </button>
      </div>

      {showActions && (
        <div className="action-menu">
          <div className="action-section">
            <h4>Command Pattern - Alimentar</h4>
            <button onClick={handleFeed}>Dispensar Alimento</button>
          </div>

          <div className="action-section">
            <h4>Strategy Pattern - Plan de Alimentación</h4>
            <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="winter">Invierno</option>
              <option value="summer">Verano</option>
              <option value="intensive">Intensivo</option>
              <option value="saving">Ahorro</option>
            </select>
            <button onClick={handleGetPlan}>Ver Plan</button>
          </div>
        </div>
      )}

      {loading && <div className="loading-overlay">Procesando...</div>}
    </div>
  );
};

export default CorralCard;