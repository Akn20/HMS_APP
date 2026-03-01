import axios from 'axios';
import { API_URL } from 'D:/internship/EXPO_APP/HIMS/config/api'; // adjust path if needed

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;