import apiClient from './api';

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName?: string;
    };
}

export const authService = {
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        const { data } = await apiClient.post('/auth/login', credentials);
        return data;
    },

    register: async (userData: any) => {
        const { data } = await apiClient.post('/auth/register', userData);
        return data;
    }
};