import React, { useState, useEffect } from 'react';
import { sensorsAPI } from '../../services/api';
import './SensorCard.css';

const SensorCard = ({ sensor, onUpdate }) => {
  const [readings, setReadings] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadReadings = async () => {
    if (!showHistory) return;

    setLoading(true);
    try {
      const response = await sensorsAPI.getReadings(sensor.id, { limit: 10 });
      setReadings(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading readings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      loadReadings();
    }
  }, [showHistory]);

  const handleAddReading = async () => {
    const value = prompt(`Ingrese valor para ${sensor.name}:`);
    if (value === null) return;

    setLoading(true);
    try {
      await sensorsAPI.addReading(sensor.id, { value: parseFloat(value) });
      alert('Lectura agregada exitosamente');
      onUpdate();
      if (showHistory) {
        loadReadings();
      }
    } catch (error) {
      console.error('Error adding reading:', error);
      alert('Error al agregar lectura');
    } finally {
      setLoading(false);
    }
  };

  const getSensorIcon = (type) => {
    const icons = {
      'TEMP': '🌡️',
      'HUMID': '💧',
      'FOOD': '🥗',
      'WATER': '💦',
      'WEIGHT': '⚖️'
    };
    return icons[type] || '📊';
  };

  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? '#28a745' : '#dc3545';
  };

  const lastReading = sensor.last_reading || sensor.current_value;

  return (
    <div className="sensor-card">
      <div className="sensor-header">
        <span className="sensor-icon">{getSensorIcon(sensor.sensor_type)}</span>
        <div className="sensor-title">
          <h3>{sensor.name}</h3>
          <p className="sensor-id">ID: {sensor.sensor_id}</p>
        </div>
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(sensor.status) }}
        >
          {sensor.status}
        </span>
      </div>

      <div className="sensor-info">
        <div className="current-reading">
          <span className="reading-label">Lectura Actual</span>
          <span className="reading-value">
            {lastReading !== null && lastReading !== undefined ? `${lastReading} ${sensor.unit}` : 'N/A'}
          </span>
        </div>

        <div className="sensor-thresholds">
          <p><strong>Mín:</strong> {sensor.min_threshold} {sensor.unit}</p>
          <p><strong>Máx:</strong> {sensor.max_threshold} {sensor.unit}</p>
        </div>

        {sensor.corral_name && (
          <p><strong>Corral:</strong> {sensor.corral_name}</p>
        )}
      </div>

      <div className="sensor-actions">
        <button className="btn-secondary" onClick={handleAddReading} disabled={loading}>
          + Lectura
        </button>
        <button
          className="btn-secondary"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Ocultar' : 'Ver'} Historial
        </button>
      </div>

      {showHistory && (
        <div className="readings-history">
          <h4>Últimas 10 Lecturas</h4>
          {loading ? (
            <p>Cargando...</p>
          ) : readings.length > 0 ? (
            <div className="readings-list">
              {readings.map((reading, index) => (
                <div key={index} className="reading-item">
                  <span>{reading.value} {sensor.unit}</span>
                  <span className="reading-date">
                    {new Date(reading.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay lecturas disponibles</p>
          )}
        </div>
      )}

      {loading && <div className="loading-overlay">Procesando...</div>}
    </div>
  );
};

export default SensorCard;