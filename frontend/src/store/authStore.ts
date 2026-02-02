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
    token:null,
    user:null,
    isHydrated:false,

    setAuth: (token, user) => {
        storage.saveToken(token)
        set({token,user})
    },

    logout: () => {
        storage.removeToken()
        set({token:null, user:null})
    },

    hydrate: async () => {
        const token = await storage.getToken()
        set({token, isHydrated:true})
    }
}))