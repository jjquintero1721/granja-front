import React, { useState } from 'react';
import { animalsAPI } from '../../services/api';
import './AnimalForm.css';

const AnimalForm = ({ corrals, onSuccess }) => {
  const [formData, setFormData] = useState({
    animal_type: 'VACA',
    name: '',
    breed: '',
    weight: '',
    age_months: '',
    corral_id: '',
    use_builder: false,
    builder_type: '',
    farm_type: ''
  });
  const [usePattern, setUsePattern] = useState('factory'); // factory, builder, abstract_factory
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { ...formData };

      if (usePattern === 'builder') {
        data.use_builder = true;
      } else if (usePattern === 'abstract_factory') {
        data.farm_type = data.farm_type || 'DAIRY';
      }

      await animalsAPI.createWithPattern(data);
      alert('Animal creado exitosamente!');
      onSuccess();
    } catch (error) {
      console.error('Error creating animal:', error);
      alert('Error al crear animal: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="animal-form-container">
      <h2>Crear Nuevo Animal</h2>

      <div className="pattern-selector">
        <label>Patrón de Creación:</label>
        <select value={usePattern} onChange={(e) => setUsePattern(e.target.value)}>
          <option value="factory">Factory Method</option>
          <option value="builder">Builder</option>
          <option value="abstract_factory">Abstract Factory</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="animal-form">
        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Animal *</label>
            <select
              name="animal_type"
              value={formData.animal_type}
              onChange={handleChange}
              required
            >
              <option value="VACA">Vaca 🐄</option>
              <option value="CERDO">Cerdo 🐷</option>
              <option value="GALLINA">Gallina 🐔</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del animal"
            />
          </div>
        </div>

        {usePattern === 'abstract_factory' && (
          <div className="form-group">
            <label>Tipo de Granja (Abstract Factory)</label>
            <select
              name="farm_type"
              value={formData.farm_type}
              onChange={handleChange}
            >
              <option value="DAIRY">Granja Lechera</option>
              <option value="MEAT">Granja de Carne</option>
              <option value="EGG">Granja de Huevos</option>
            </select>
          </div>
        )}

        {usePattern === 'builder' && (
          <div className="form-group">
            <label>Tipo de Builder</label>
            <select
              name="builder_type"
              value={formData.builder_type}
              onChange={handleChange}
            >
              <option value="">Builder Manual</option>
              <option value="premium_dairy">Vaca Lechera Premium</option>
              <option value="meat_pig">Cerdo de Engorde</option>
            </select>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Raza</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Ej: Holstein, Yorkshire"
            />
          </div>

          <div className="form-group">
            <label>Peso (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Peso en kilogramos"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Edad (meses)</label>
            <input
              type="number"
              name="age_months"
              value={formData.age_months}
              onChange={handleChange}
              placeholder="Edad en meses"
            />
          </div>

          <div className="form-group">
            <label>Corral</label>
            <select
              name="corral_id"
              value={formData.corral_id}
              onChange={handleChange}
            >
              <option value="">Sin asignar</option>
              {corrals.map(corral => (
                <option key={corral.id} value={corral.id}>
                  {corral.name} ({corral.animal_type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Animal'}
          </button>
        </div>

        <div className="pattern-info">
          <p>
            <strong>Patrón seleccionado:</strong> {usePattern === 'factory' ? 'Factory Method' : usePattern === 'builder' ? 'Builder' : 'Abstract Factory'}
          </p>
          <p className="pattern-description">
            {usePattern === 'factory' && 'Crea un animal específico según su tipo'}
            {usePattern === 'builder' && 'Construye un animal paso a paso con características específicas'}
            {usePattern === 'abstract_factory' && 'Crea una familia completa de objetos relacionados (animal + alimento + ambiente)'}
          </p>
        </div>
      </form>
    </div>
  );
};

export default AnimalForm;