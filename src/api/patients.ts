import axios from './axios';

export const getPatients = async () => {
  return await axios.get('/emergency-cases/patients');
};