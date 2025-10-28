import React, { useState } from 'react';
import { patternsAPI, corralsAPI } from '../services/api';
import './PatternsPage.css';

const PatternsPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [selectedCorral, setSelectedCorral] = useState('');
  const [corrals, setCorrals] = useState([]);

  React.useEffect(() => {
    loadCorrals();
    loadCommandHistory();
  }, []);

  const loadCorrals = async () => {
    try {
      const response = await corralsAPI.getAll();
      setCorrals(response.data.results || response.data);
      if (response.data.length > 0) {
        setSelectedCorral(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading corrals:', error);
    }
  };

  const loadCommandHistory = async () => {
    try {
      const response = await patternsAPI.commandHistory();
      setCommandHistory(response.data.history || []);
    } catch (error) {
      console.error('Error loading command history:', error);
    }
  };

  const handleIntegratedFlow = async () => {
    if (!selectedCorral) {
      alert('Seleccione un corral');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await patternsAPI.integratedFlow({
        corral_id: parseInt(selectedCorral)
      });
      setResult({
        type: 'integrated',
        data: response.data
      });
      loadCommandHistory();
    } catch (error) {
      console.error('Error in integrated flow:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdapterDemo = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await patternsAPI.adapterDemo({
        animal_id: 1,
        external_system: 'LEGACY_FARM'
      });
      setResult({
        type: 'adapter',
        data: response.data
      });
    } catch (error) {
      console.error('Error in adapter demo:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patterns-page">
      <div className="page-header">
        <h1>🎯 Demostración de Patrones de Diseño</h1>
        <p className="subtitle">
          Explora los diferentes patrones implementados en el sistema
        </p>
      </div>

      {/* Explicación de Patrones */}
      <div className="patterns-explanation">
        <h2>Patrones Implementados</h2>
        <div className="patterns-grid">
          <div className="pattern-card creational">
            <h3>🏗️ Patrones Creacionales</h3>
            <ul>
              <li><strong>Factory Method:</strong> Creación de animales específicos</li>
              <li><strong>Abstract Factory:</strong> Familias de objetos relacionados</li>
              <li><strong>Builder:</strong> Construcción paso a paso de animales</li>
              <li><strong>Singleton:</strong> Alimentador global único</li>
            </ul>
          </div>

          <div className="pattern-card structural">
            <h3>🔧 Patrones Estructurales</h3>
            <ul>
              <li><strong>Decorator:</strong> Añadir funcionalidades a animales</li>
              <li><strong>Adapter:</strong> Integración con sistemas legacy</li>
              <li><strong>Facade:</strong> Interfaz simplificada de la granja</li>
            </ul>
          </div>

          <div className="pattern-card behavioral">
            <h3>⚡ Patrones Comportamentales</h3>
            <ul>
              <li><strong>Observer:</strong> Sistema de monitoreo de sensores</li>
              <li><strong>Strategy:</strong> Estrategias de alimentación</li>
              <li><strong>Command:</strong> Comandos de dispensación</li>
              <li><strong>State:</strong> Estados de salud del animal</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demos Interactivos */}
      <div className="demos-section">
        <h2>🚀 Demos Interactivos</h2>

        {/* Demo 1: Flujo Integrado */}
        <div className="demo-card">
          <div className="demo-header">
            <h3>1. Flujo Integrado Completo</h3>
            <p>
              Demuestra múltiples patrones trabajando juntos: Observer detecta nivel bajo,
              Factory crea animales, Strategy define plan, Command ejecuta alimentación,
              y Facade coordina todo.
            </p>
          </div>

          <div className="demo-controls">
            <div className="form-group">
              <label>Seleccionar Corral:</label>
              <select
                value={selectedCorral}
                onChange={(e) => setSelectedCorral(e.target.value)}
              >
                <option value="">Seleccione un corral</option>
                {corrals.map(corral => (
                  <option key={corral.id} value={corral.id}>
                    {corral.name} - {corral.animal_type}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-demo"
              onClick={handleIntegratedFlow}
              disabled={loading || !selectedCorral}
            >
              {loading ? 'Ejecutando...' : 'Ejecutar Flujo Integrado'}
            </button>
          </div>
        </div>

        {/* Demo 2: Adapter Pattern */}
        <div className="demo-card">
          <div className="demo-header">
            <h3>2. Patrón Adapter</h3>
            <p>
              Demuestra cómo el sistema se adapta para comunicarse con sistemas legacy
              externos usando el patrón Adapter.
            </p>
          </div>

          <div className="demo-controls">
            <button
              className="btn-demo"
              onClick={handleAdapterDemo}
              disabled={loading}
            >
              {loading ? 'Ejecutando...' : 'Demostrar Adapter'}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {result && (
        <div className="results-section">
          <h2>📊 Resultados</h2>
          <div className="result-container">
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Historial de Comandos */}
      {commandHistory.length > 0 && (
        <div className="history-section">
          <h2>📜 Historial de Comandos (Command Pattern)</h2>
          <div className="history-list">
            {commandHistory.map((cmd, index) => (
              <div key={index} className="history-item">
                <div className="history-header">
                  <span className="command-type">{cmd.command_type}</span>
                  <span className="command-time">
                    {new Date(cmd.executed_at).toLocaleString()}
                  </span>
                </div>
                <div className="history-details">
                  <p><strong>Corral:</strong> {cmd.corral_id}</p>
                  <p><strong>Cantidad:</strong> {cmd.quantity_kg} kg</p>
                  <p><strong>Estado:</strong> {cmd.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información Adicional */}
      <div className="info-section">
        <h2>💡 ¿Cómo funcionan los patrones?</h2>
        <div className="info-content">
          <div className="info-item">
            <h4>🔄 Flujo de Ejecución</h4>
            <ol>
              <li>Los sensores (Observer) monitorean constantemente</li>
              <li>Cuando detectan problemas, notifican al sistema</li>
              <li>El Facade coordina las acciones necesarias</li>
              <li>Se usan Factories para crear objetos</li>
              <li>Strategy decide la mejor estrategia</li>
              <li>Commands ejecutan las acciones</li>
              <li>Decorators añaden funcionalidades extra</li>
            </ol>
          </div>

          <div className="info-item">
            <h4>🎯 Beneficios</h4>
            <ul>
              <li>Código más mantenible y escalable</li>
              <li>Separación de responsabilidades</li>
              <li>Facilita las pruebas unitarias</li>
              <li>Permite extender funcionalidades fácilmente</li>
              <li>Reduce el acoplamiento entre componentes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternsPage;