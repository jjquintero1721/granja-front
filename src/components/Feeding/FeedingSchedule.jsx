import React from 'react';
import './FeedingSchedule.css';

const FeedingSchedule = ({ schedule, onExecute, onUpdate }) => {
  const getStatusColor = (active) => {
    return active ? '#28a745' : '#6c757d';
  };

  return (
    <div className="feeding-schedule-card">
      <div className="schedule-header">
        <span className="schedule-icon">⏰</span>
        <div className="schedule-time">
          <h3>{schedule.time}</h3>
          <span
            className="active-badge"
            style={{ backgroundColor: getStatusColor(schedule.is_active) }}
          >
            {schedule.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="schedule-info">
        <p><strong>Corral:</strong> {schedule.corral_name || `#${schedule.corral}`}</p>
        <p><strong>Alimento:</strong> {schedule.food_type_name || `#${schedule.food_type}`}</p>
        <p><strong>Cantidad:</strong> {schedule.quantity_kg} kg</p>
        {schedule.strategy && (
          <p><strong>Estrategia:</strong> {schedule.strategy}</p>
        )}
      </div>

      <div className="schedule-actions">
        <button className="btn-execute" onClick={onExecute}>
          Ejecutar Ahora
        </button>
      </div>
    </div>
  );
};

export default FeedingSchedule;