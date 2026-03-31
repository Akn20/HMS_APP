import axios from './axios';

// GET Pharmacy Dashboard Data

export const getDashboard = async () => {
  return await axios.get('/pharmacy/dashboard');
};