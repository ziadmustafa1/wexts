import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: '/api',
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
