import {create} from 'zustand'
import {storage} from '../utils/storage'

interface AuthState {
    token: string|null
    user: any | null
    isHydrated: boolean
    setAuth: (token: string, user:any) => void
    logout: () => void
    hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isHydrated: false,

    setAuth: (token, user) => {
        storage.saveToken(token);
        storage.saveUser(user); // Need to add this to your storage util
        set({ token, user });
    },

    logout: () => {
        storage.removeToken();
        storage.removeUser(); // Need to add this
        set({ token: null, user: null });
    },

    hydrate: async () => {
        const token = await storage.getToken();
        const user = await storage.getUser(); // Load the user object too
        set({ token, user, isHydrated: true });
    }
}))