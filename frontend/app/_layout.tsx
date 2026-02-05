import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
    const { token, isHydrated, hydrate } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        hydrate();
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        const firstSegment = segments[0] as string;
        const inAuthGroup = firstSegment === '(auth)';

        const timeout = setTimeout(() => {
            if (!token && !inAuthGroup) {
                router.replace('/(auth)/login' as any);
            } else if (token && inAuthGroup) {
                router.replace('/(tabs)');
            }
        }, 1);

        return () => clearTimeout(timeout);
    }, [token, isHydrated, segments]);

    if (!isHydrated) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen name="(auth)" options={{ headerShown: false }} />

                <Stack.Screen
                    name="create-recipe-modal"
                    options={{
                        presentation: 'modal', 
                        headerShown: false,
                        gestureEnabled: true,
                        animation: 'slide_from_bottom'
                    }}
                />
            </Stack>
        </QueryClientProvider>
    );
}