import axios from "axios";


// Detecta automáticamente si estamos en localhost o en la red
//Si accedes desde http://localhost:5173, usará localhost:8080
//Si accedes desde http://192.168.1.50:5173, usará 192.168.1.50:8080
// abrir con npm run dev -- --host

const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

const API_URL = isLocalhost 
  ? 'http://localhost:8080'  // Desarrollo local
  : `http://${window.location.hostname}:8080`; // Desde la red

  

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});