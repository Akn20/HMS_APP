import axios from './axios';

export const createEmergency = async (data: any) => {
  return await axios.post('/emergency-cases/emergency', data);
};