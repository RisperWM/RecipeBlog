import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, Dimensions, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { RecipeResponse, recipeService } from '@/src/service/recipeService';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/authStore';

interface RecipeCardProps {
    item: RecipeResponse;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;

export default function RecipeCard({ item }: RecipeCardProps) {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    const isLiked = item.likes?.includes(user?.id || '');

    const { mutate: handleToggleLike } = useMutation({
        mutationFn: () => {
            if (!user?.id) throw new Error("Please log in to like recipes.");
            return recipeService.toggleLike(item._id, user.id);
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['recipe', item._id] });
            await queryClient.cancelQueries({ queryKey: ['liked-recipes', user?.id] });

            const previousData = queryClient.getQueryData(['liked-recipes', user?.id]);

            queryClient.setQueriesData({ queryKey: ['recipe', item._id] }, (old: any) => {
                if (!old) return old;
                const newLikes = isLiked
                    ? old.likes.filter((id: string) => id !== user?.id)
                    : [...(old.likes || []), user?.id];
                return { ...old, likes: newLikes, likesCount: newLikes.length };
            });

            return { previousData };
        },
        onError: (err: any) => {
            Alert.alert("Error", err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['liked-recipes', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });

    const handlePress = () => {
        router.push(`/recipe-detail/${item._id}`);
    };

    const onLikePress = (e: any) => {
        e.stopPropagation();
        handleToggleLike();
    };

    return (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
                <View style={styles.topBadge}>
                    <TouchableOpacity
                        onPress={onLikePress}
                        style={styles.heartButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {isLiked ? (
                            <FontAwesome name="heart" size={22} color="#ef4444" />
                        ) : (
                            <Ionicons name="heart-outline" size={22} color="white" />
                        )}
                    </TouchableOpacity>
                    <View style={styles.cuisineBadge}>
                        <Text style={styles.cuisineText}>{item.cuisine}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.recipeInfo}>
                <Text style={styles.recipeName} numberOfLines={1}>
                    {item.name}
                </Text>

                <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color="#f97316" />
                        <Text style={styles.recipeStats}>{item.cookTime || '-'}m</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="star" size={12} color="#f59e0b" />
                        <Text style={styles.recipeStats}>{item.averageRating || '0.0'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    recipeCard: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 140,
    },
    recipeImage: {
        width: '100%',
        height: '100%',
    },
    topBadge: {
        position: 'absolute',
        top: 8,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        alignItems: 'center'
    },
    heartButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 6,
        borderRadius: 20,
    },
    cuisineBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    cuisineText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#f97316',
        textTransform: 'uppercase'
    },
    recipeInfo: {
        padding: 10,
    },
    recipeName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 6
    },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recipeStats: {
        fontSize: 11,
        color: '#64748b',
        marginLeft: 3,
        fontWeight: '600'
    },
});