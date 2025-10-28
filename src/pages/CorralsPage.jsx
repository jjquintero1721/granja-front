import React, { useState, useEffect } from 'react';
import { corralsAPI } from '../services/api';
import CorralCard from '../components/Corrals/CorralCard';
import './CorralsPage.css';

const CorralsPage = () => {
  const [corrals, setCorrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCorrals();
  }, []);

  const loadCorrals = async () => {
    try {
      const response = await corralsAPI.getAll();
      setCorrals(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading corrals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando corrales...</div>;

  return (
    <div className="corrals-page">
      <div className="page-header">
        <h1>Gestión de Corrales</h1>
      </div>

      <div className="corrals-grid">
        {corrals.map(corral => (
          <CorralCard key={corral.id} corral={corral} onUpdate={loadCorrals} />
        ))}
      </div>

      {corrals.length === 0 && (
        <div className="empty-state">
          <p>No hay corrales registrados</p>
        </div>
      )}
    </div>
  );
};

export default CorralsPage;