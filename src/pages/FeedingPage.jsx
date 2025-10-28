import React, { useState, useEffect } from 'react';
import { feedingAPI, corralsAPI } from '../services/api';
import FeedingSchedule from '../components/Feeding/FeedingSchedule';
import './FeedingPage.css';

const FeedingPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [records, setRecords] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [corrals, setCorrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [schedulesRes, recordsRes, foodRes, corralsRes] = await Promise.all([
        feedingAPI.getSchedules(),
        feedingAPI.getRecords(),
        feedingAPI.getFoodTypes(),
        corralsAPI.getAll()
      ]);

      setSchedules(schedulesRes.data.results || schedulesRes.data);
      setRecords(recordsRes.data.results || recordsRes.data);
      setFoodTypes(foodRes.data.results || foodRes.data);
      setCorrals(corralsRes.data.results || corralsRes.data);

      // Cargar resumen del día
      const today = new Date().toISOString().split('T')[0];
      const summaryRes = await feedingAPI.dailySummary({ date: today });
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error loading feeding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      corral_id: parseInt(formData.get('corral_id')),
      food_type_id: parseInt(formData.get('food_type_id')),
      quantity_kg: parseFloat(formData.get('quantity_kg')),
      time: formData.get('time'),
      strategy: formData.get('strategy')
    };

    setLoading(true);
    try {
      await feedingAPI.createWithStrategy(data);
      alert('Horario de alimentación creado exitosamente');
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Error al crear horario: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteNow = async (schedule) => {
    if (!window.confirm('¿Ejecutar alimentación ahora?')) return;

    setLoading(true);
    try {
      const data = {
        corral_id: schedule.corral,
        food_type_id: schedule.food_type,
        quantity_kg: schedule.quantity_kg
      };
      await feedingAPI.executeNow(data);
      alert('Alimentación ejecutada exitosamente');
      loadData();
    } catch (error) {
      console.error('Error executing feeding:', error);
      alert('Error al ejecutar alimentación');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando datos de alimentación...</div>;

  return (
    <div className="feeding-page">
      <div className="page-header">
        <h1>Sistema de Alimentación</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo Horario'}
        </button>
      </div>

      {/* Resumen del día */}
      {summary && (
        <div className="daily-summary">
          <h2>📊 Resumen del Día</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">Total Alimentaciones</span>
              <span className="summary-value">{summary.total_feedings}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Alimento Dispensado</span>
              <span className="summary-value">{summary.total_food_kg} kg</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Corrales Alimentados</span>
              <span className="summary-value">{summary.corrals_fed}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Animales Alimentados</span>
              <span className="summary-value">{summary.animals_fed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de nuevo horario */}
      {showForm && (
        <div className="schedule-form-container">
          <h2>Crear Nuevo Horario de Alimentación</h2>
          <form onSubmit={handleCreateSchedule} className="schedule-form">
            <div className="form-row">
              <div className="form-group">
                <label>Corral *</label>
                <select name="corral_id" required>
                  <option value="">Seleccionar corral</option>
                  {corrals.map(corral => (
                    <option key={corral.id} value={corral.id}>
                      {corral.name} ({corral.animal_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Alimento *</label>
                <select name="food_type_id" required>
                  <option value="">Seleccionar alimento</option>
                  {foodTypes.map(food => (
                    <option key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cantidad (kg) *</label>
                <input
                  type="number"
                  name="quantity_kg"
                  step="0.1"
                  required
                  placeholder="Cantidad en kilogramos"
                />
              </div>

              <div className="form-group">
                <label>Hora *</label>
                <input
                  type="time"
                  name="time"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Estrategia de Alimentación</label>
              <select name="strategy">
                <option value="normal">Normal</option>
                <option value="growth">Crecimiento</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="production">Producción</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                Crear Horario
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Horarios programados */}
      <div className="schedules-section">
        <h2>⏰ Horarios Programados ({schedules.length})</h2>
        <div className="schedules-grid">
          {schedules.map(schedule => (
            <FeedingSchedule
              key={schedule.id}
              schedule={schedule}
              onExecute={() => handleExecuteNow(schedule)}
              onUpdate={loadData}
            />
          ))}
        </div>
        {schedules.length === 0 && (
          <div className="empty-state">
            <p>No hay horarios programados</p>
          </div>
        )}
      </div>

      {/* Registros recientes */}
      <div className="records-section">
        <h2>📝 Registros Recientes ({records.length})</h2>
        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th>Corral</th>
                <th>Alimento</th>
                <th>Cantidad</th>
                <th>Animales</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 10).map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.timestamp).toLocaleString()}</td>
                  <td>{record.corral_name}</td>
                  <td>{record.food_type_name}</td>
                  <td>{record.quantity_kg} kg</td>
                  <td>{record.animals_fed}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && (
            <div className="empty-state">
              <p>No hay registros disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedingPage;