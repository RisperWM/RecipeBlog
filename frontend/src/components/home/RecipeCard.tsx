import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RecipeResponse } from '@/src/service/recipeService';
import { useRouter } from 'expo-router';

interface RecipeCardProps {
    item: RecipeResponse;
}

// Get screen width to calculate perfect card width for 2 columns
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2; // (Total width - horizontal margins) / 2

export default function RecipeCard({ item }: RecipeCardProps) {
    const router = useRouter();
    const [like, setLike] = useState(false)

    const handlePress = () => {
        router.push(`/recipe-detail/${item._id}`);
    };

    return (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
                <View style={styles.topBadge}>
                    <TouchableOpacity onPress={() => setLike(!like)} style={{ marginLeft: 5 }}>
                        {like ? <FontAwesome name="heart" size={24} color="#c42222" /> : <Ionicons name="heart-outline" size={24} color="black" />}
                    </TouchableOpacity>
                    <View style={styles.cuisineBadge}>
                        <Text style={styles.cuisineText}>{item.cuisine}</Text>
                    </View>

                </View>
            </View>

            {/* Info Section */}
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
                        <Ionicons name="flame-outline" size={12} color="#ef4444" />
                        <Text style={styles.recipeStats}>{item.category || 'Meal'}</Text>
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
        borderRadius: 10,
        marginBottom: 16,
        // Modern soft shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: 140,
        position: 'relative',
    },
    recipeImage: {
        width: '100%',
        height: '100%',
        resizeMode: "cover"
    },
    topBadge: {
        position: 'absolute',
        top: 7,
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",

    },
    cuisineBadge: {


        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    cuisineText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#f97316',
        textTransform: 'uppercase'
    },
    recipeInfo: {
        padding: 12,
    },
    recipeName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8
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