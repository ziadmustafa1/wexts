import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here if needed
        return Promise.reject(error);
    }
);
