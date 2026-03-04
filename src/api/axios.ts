import axios from 'axios';
import { API_URL } from '../screens/PharmacyStock/api'; // adjust path if needed

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;