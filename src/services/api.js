import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Animals API
export const animalsAPI = {
  getAll: () => api.get('/animals/animals/'),
  getById: (id) => api.get(`/animals/animals/${id}/`),
  create: (data) => api.post('/animals/animals/', data),
  update: (id, data) => api.put(`/animals/animals/${id}/`, data),
  delete: (id) => api.delete(`/animals/animals/${id}/`),
  createWithPattern: (data) => api.post('/animals/animals/create_with_pattern/', data),
  applyDecorator: (id, data) => api.post(`/animals/animals/${id}/apply_decorator/`, data),
  healthAction: (id, data) => api.post(`/animals/animals/${id}/health_action/`, data),
  singletonStatus: () => api.get('/animals/animals/singleton_status/'),
};

// Corrals API
export const corralsAPI = {
  getAll: () => api.get('/animals/corrals/'),
  getById: (id) => api.get(`/animals/corrals/${id}/`),
  feed: (id, data) => api.post(`/animals/corrals/${id}/feed/`, data),
  feedingPlan: (id, params) => api.get(`/animals/corrals/${id}/feeding_plan/`, { params }),
  status: () => api.get('/animals/corrals/status/'),
};

// Sensors API
export const sensorsAPI = {
  getAll: () => api.get('/sensors/sensors/'),
  getById: (id) => api.get(`/sensors/sensors/${id}/`),
  addReading: (id, data) => api.post(`/sensors/sensors/${id}/add_reading/`, data),
  getReadings: (id, params) => api.get(`/sensors/sensors/${id}/readings/`, { params }),
  getAlerts: () => api.get('/sensors/sensors/alerts/'),
  simulateReadings: () => api.post('/sensors/sensors/simulate_readings/'),
};

// Feeding API
export const feedingAPI = {
  getFoodTypes: () => api.get('/feeding/food-types/'),
  getSchedules: () => api.get('/feeding/schedules/'),
  createWithStrategy: (data) => api.post('/feeding/schedules/create_with_strategy/', data),
  executeNow: (data) => api.post('/feeding/schedules/execute_now/', data),
  getRecords: () => api.get('/feeding/records/'),
  dailySummary: (params) => api.get('/feeding/records/daily_summary/', { params }),
  efficiencyReport: (params) => api.get('/feeding/records/efficiency_report/', { params }),
};

// Patterns Demo API
export const patternsAPI = {
  integratedFlow: (data) => api.post('/animals/patterns-demo/integrated_flow/', data),
  adapterDemo: (data) => api.post('/animals/patterns-demo/adapter_demo/', data),
  commandHistory: () => api.get('/animals/patterns-demo/command_history/'),
};

export default api;