import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                const response = await axios.post('http://localhost:8000/api/auth/refresh/', { refresh: refreshToken });
                const { access } = response.data;
                localStorage.setItem('access', access);
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
