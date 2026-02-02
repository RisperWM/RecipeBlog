import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { use } from 'react'

const apiClient = axios.create({
    baseURL : 'http://192.168.100.4:5000/api'
})

apiClient.interceptors.request.use(async (config) => {
    const fullUrl = (config.baseURL ?? '') + (config.url ?? '');
    console.log('🚀 Request URL:', fullUrl);
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
});

apiClient.interceptors.response.use((res) => res, (err) => {
    if (err.response?.status === 401) {
        useAuthStore.getState().logout()
    }
    return Promise.reject(err)
})

export default apiClient