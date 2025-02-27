// API service layer
// This file will contain functions to interact with the backend API

import axios from 'axios';

// Base URL for API requests
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API functions will be implemented here in Phase 3
// export const fetchFullStatus = async () => {
//   const response = await apiClient.get('/fullstatus');
//   return response.data;
// };

export default apiClient;
