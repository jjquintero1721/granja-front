import React, { useState } from 'react';
import { animalsAPI } from '../../services/api';
import './AnimalCard.css';

const AnimalCard = ({ animal, onDelete, onUpdate }) => {
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHealthAction = async (action) => {
    setLoading(true);
    try {
      const response = await animalsAPI.healthAction(animal.id, { action });
      alert(`Acción ejecutada: ${JSON.stringify(response.data.message || 'Éxito')}`);
      onUpdate();
    } catch (error) {
      console.error('Error en acción de salud:', error);
      alert('Error al ejecutar acción');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDecorator = async (decorator) => {
    setLoading(true);
    try {
      const data = {
        animal_id: animal.id,
        decorators: [decorator]
      };

      if (decorator === 'vaccine') {
        data.vaccine_name = 'Vacuna Preventiva';
      } else if (decorator === 'gps') {
        data.gps_device_id = `GPS-${animal.tag_id}`;
      } else if (decorator === 'health_monitor') {
        data.sensor_id = `HEALTH-${animal.tag_id}`;
      } else if (decorator === 'breeder') {
        data.genetic_quality = 'A';
      }

      const response = await animalsAPI.applyDecorator(animal.id, data);
      alert('Decorator aplicado exitosamente');
      onUpdate();
    } catch (error) {
      console.error('Error aplicando decorator:', error);
      alert('Error al aplicar decorator');
    } finally {
      setLoading(false);
    }
  };

  const getHealthStateColor = (state) => {
    const colors = {
      'SANO': '#28a745',
      'ENFERMO': '#dc3545',
      'EN_TRATAMIENTO': '#ffc107',
      'CUARENTENA': '#fd7e14'
    };
    return colors[state] || '#6c757d';
  };

  const getAnimalIcon = (type) => {
    const icons = {
      'VACA': '🐄',
      'CERDO': '🐷',
      'GALLINA': '🐔'
    };
    return icons[type] || '🐾';
  };

  return (
    <div className="animal-card">
      <div className="animal-header">
        <span className="animal-icon">{getAnimalIcon(animal.animal_type)}</span>
        <h3>{animal.name || animal.tag_id}</h3>
        <span
          className="health-badge"
          style={{ backgroundColor: getHealthStateColor(animal.health_state) }}
        >
          {animal.health_state}
        </span>
      </div>

      <div className="animal-info">
        <p><strong>ID:</strong> {animal.tag_id}</p>
        <p><strong>Raza:</strong> {animal.breed}</p>
        <p><strong>Peso:</strong> {animal.weight} kg</p>
        <p><strong>Edad:</strong> {animal.age_months} meses</p>
        <p><strong>Propósito:</strong> {animal.purpose}</p>
        {animal.daily_production && (
          <p><strong>Producción diaria:</strong> {animal.daily_production}</p>
        )}
        {animal.corral_name && (
          <p><strong>Corral:</strong> {animal.corral_name}</p>
        )}
      </div>

      <div className="animal-actions">
        <button
          className="btn-secondary"
          onClick={() => setShowActions(!showActions)}
          disabled={loading}
        >
          {showActions ? 'Ocultar' : 'Acciones'}
        </button>
        <button
          className="btn-danger"
          onClick={() => onDelete(animal.id)}
          disabled={loading}
        >
          Eliminar
        </button>
      </div>

      {showActions && (
        <div className="action-menu">
          <div className="action-section">
            <h4>State Pattern - Acciones de Salud</h4>
            <button onClick={() => handleHealthAction('feed')}>Alimentar</button>
            <button onClick={() => handleHealthAction('vaccinate')}>Vacunar</button>
            <button onClick={() => handleHealthAction('check')}>Chequeo</button>
          </div>

          <div className="action-section">
            <h4>Decorator Pattern - Añadir Características</h4>
            <button onClick={() => handleApplyDecorator('vaccine')}>+ Vacuna</button>
            <button onClick={() => handleApplyDecorator('gps')}>+ GPS</button>
            <button onClick={() => handleApplyDecorator('health_monitor')}>+ Monitor</button>
            <button onClick={() => handleApplyDecorator('breeder')}>+ Reproductor</button>
          </div>
        </div>
      )}

      {loading && <div className="loading-overlay">Procesando...</div>}
    </div>
  );
};

export default AnimalCard;