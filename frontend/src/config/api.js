import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.18:3000',
    withCredentials: true,
})

export default api;