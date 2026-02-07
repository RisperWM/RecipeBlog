import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/store/authStore';

const queryClient = new QueryClient();

export default function RootLayout() {
    const { token, isHydrated, hydrate } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!isHydrated) return;

        const segmentList = segments as string[];
        const inAuthGroup = segmentList.includes('(auth)');

        const navigationTimeout = setTimeout(() => {
            if (!token && !inAuthGroup) {
                router.replace('/(auth)/login');
            } else if (token && inAuthGroup) {
                router.replace('/(tabs)');
            }
        }, 1);

        return () => clearTimeout(navigationTimeout);
    }, [token, isHydrated, segments, router]);

    if (!isHydrated) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Stack
                screenOptions={{
                    headerShown: false, 
                    contentStyle: { backgroundColor: '#fff' },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen
                    name="recipe-detail/[id]"
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right'
                    }}
                />

                <Stack.Screen
                    name="create-recipe-modal"
                    options={{
                        presentation: 'modal',
                        gestureEnabled: true,
                        animation: 'slide_from_bottom',
                    }}
                />
            </Stack>
        </QueryClientProvider>
    );
}