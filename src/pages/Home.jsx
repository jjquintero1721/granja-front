import React, { useState, useEffect } from 'react';
import { corralsAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await corralsAPI.status();
      setStatus(response.data);
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="home">
      <h1>Dashboard - Granja Inteligente</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Corrales</h3>
          <p className="stat-number">{status?.corrales?.total || 0}</p>
          <div className="stat-details">
            <p>Vacas: {status?.corrales?.por_tipo?.VACA || 0}</p>
            <p>Cerdos: {status?.corrales?.por_tipo?.CERDO || 0}</p>
            <p>Gallinas: {status?.corrales?.por_tipo?.GALLINA || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <h3>Animales</h3>
          <p className="stat-number">{status?.animales?.total || 0}</p>
          <div className="stat-details">
            <p>Sanos: {status?.animales?.por_estado_salud?.SANO || 0}</p>
            <p>En tratamiento: {status?.animales?.por_estado_salud?.EN_TRATAMIENTO || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <h3>Sensores</h3>
          <p className="stat-number">{status?.sensores?.total || 0}</p>
          <div className="stat-details">
            <p>Activos: {status?.sensores?.activos || 0}</p>
            <p>Con error: {status?.sensores?.con_error || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <h3>Alertas</h3>
          <p className="stat-number">{status?.alertas?.length || 0}</p>
        </div>
      </div>

      <div className="info-section">
        <h2>Estado del Sistema de Alimentación</h2>
        {status?.alimentacion && (
          <div className="feeding-info">
            <p><strong>Estado:</strong> {status.alimentacion.estado}</p>
            <p><strong>Estrategia:</strong> {status.alimentacion.estrategia}</p>
            <p><strong>Dispensadores activos:</strong> {status.alimentacion.dispensadores_activos}</p>
            <p><strong>Alimento dispensado hoy:</strong> {status.alimentacion.alimento_dispensado_hoy} kg</p>
          </div>
        )}
      </div>

      {status?.alertas && status.alertas.length > 0 && (
        <div className="alerts-section">
          <h2>🚨 Alertas Activas</h2>
          <div className="alerts-list">
            {status.alertas.slice(0, 5).map((alert, index) => (
              <div key={index} className="alert-item">
                <p>{alert.mensaje}</p>
                <span className="alert-level">{alert.nivel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;