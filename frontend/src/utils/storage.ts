import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const storage = {
    saveToken: async (token: string) => await SecureStore.setItemAsync(TOKEN_KEY, token),
    getToken: async () => await SecureStore.getItemAsync(TOKEN_KEY),
    removeToken: async () => await SecureStore.deleteItemAsync(TOKEN_KEY),

    saveUser: async (userData: any) => {
        const userToSave = Array.isArray(userData) ? userData[0] : userData;

        if (userToSave) {
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userToSave));
        }
    },

    getUser: async () => {
        const userString = await SecureStore.getItemAsync(USER_KEY);
        try {
            return userString ? JSON.parse(userString) : null;
        } catch (e) {
            console.error("Error parsing user from storage", e);
            return null;
        }
    },

    removeUser: async () => await SecureStore.deleteItemAsync(USER_KEY),
};