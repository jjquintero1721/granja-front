import React, { useState, useEffect } from 'react';
import { sensorsAPI } from '../services/api';
import SensorCard from '../components/Sensors/SensorCard';
import './SensorsPage.css';

const SensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sensorsRes, alertsRes] = await Promise.all([
        sensorsAPI.getAll(),
        sensorsAPI.getAlerts()
      ]);
      setSensors(sensorsRes.data.results || sensorsRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error loading sensors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateReadings = async () => {
    try {
      await sensorsAPI.simulateReadings();
      alert('Lecturas simuladas exitosamente');
      loadData();
    } catch (error) {
      console.error('Error simulating readings:', error);
      alert('Error al simular lecturas');
    }
  };

  if (loading) return <div className="loading">Cargando sensores...</div>;

  return (
    <div className="sensors-page">
      <div className="page-header">
        <h1>Monitoreo de Sensores</h1>
        <button className="btn-primary" onClick={handleSimulateReadings}>
          Simular Lecturas
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2>🚨 Alertas Activas ({alerts.length})</h2>
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div key={index} className="alert-item">
                <span className="alert-sensor">{alert.sensor_name}</span>
                <p>{alert.message}</p>
                <span className="alert-level">{alert.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sensors-grid">
        {sensors.map(sensor => (
          <SensorCard key={sensor.id} sensor={sensor} onUpdate={loadData} />
        ))}
      </div>

      {sensors.length === 0 && (
        <div className="empty-state">
          <p>No hay sensores registrados</p>
        </div>
      )}
    </div>
  );
};

export default SensorsPage;