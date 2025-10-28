import React, { useState, useEffect } from 'react';
import { animalsAPI, corralsAPI } from '../services/api';
import AnimalCard from '../components/Animals/AnimalCard';
import AnimalForm from '../components/Animals/AnimalForm';
import './AnimalsPage.css';

const AnimalsPage = () => {
  const [animals, setAnimals] = useState([]);
  const [corrals, setCorrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [animalsRes, corralsRes] = await Promise.all([
        animalsAPI.getAll(),
        corralsAPI.getAll()
      ]);
      setAnimals(animalsRes.data.results || animalsRes.data);
      setCorrals(corralsRes.data.results || corralsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este animal?')) {
      try {
        await animalsAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting animal:', error);
      }
    }
  };

  const filteredAnimals = animals.filter(animal => {
    if (filter === 'all') return true;
    return animal.animal_type === filter;
  });

  if (loading) return <div className="loading">Cargando animales...</div>;

  return (
    <div className="animals-page">
      <div className="page-header">
        <h1>Gestión de Animales</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Crear Animal'}
        </button>
      </div>

      {showForm && (
        <AnimalForm
          corrals={corrals}
          onSuccess={() => {
            setShowForm(false);
            loadData();
          }}
        />
      )}

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Todos ({animals.length})
        </button>
        <button
          className={filter === 'VACA' ? 'active' : ''}
          onClick={() => setFilter('VACA')}
        >
          Vacas ({animals.filter(a => a.animal_type === 'VACA').length})
        </button>
        <button
          className={filter === 'CERDO' ? 'active' : ''}
          onClick={() => setFilter('CERDO')}
        >
          Cerdos ({animals.filter(a => a.animal_type === 'CERDO').length})
        </button>
        <button
          className={filter === 'GALLINA' ? 'active' : ''}
          onClick={() => setFilter('GALLINA')}
        >
          Gallinas ({animals.filter(a => a.animal_type === 'GALLINA').length})
        </button>
      </div>

      <div className="animals-grid">
        {filteredAnimals.map(animal => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onDelete={handleDelete}
            onUpdate={loadData}
          />
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="empty-state">
          <p>No hay animales registrados</p>
        </div>
      )}
    </div>
  );
};

export default AnimalsPage;