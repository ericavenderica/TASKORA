const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const API_URL = VITE_API_URL.endsWith("/api") ? VITE_API_URL : `${VITE_API_URL}/api`;
export {API_URL};