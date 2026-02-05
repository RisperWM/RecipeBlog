import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Image } from "react-native";
import { MEAL_CATEGORIES, CATEGORY_ASSETS } from "@shared/constants/mealCategory";
import { useRecipeStore } from "@/src/store/recipeStore";
import { Ionicons } from '@expo/vector-icons';

export default function CategoryList() {
    const { selectedCategory, setFilters } = useRecipeStore();

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Choose food category</Text>
            </View>
            <FlatList
                data={MEAL_CATEGORIES}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listPadding}
                renderItem={({ item }) => {
                    const asset = CATEGORY_ASSETS[item];
                    const isActive = selectedCategory === item;

                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.categoryCard, isActive && styles.activeCategoryCard]}
                            onPress={() => setFilters(isActive ? null : item, null)}
                        >
                            <Image
                                source={{ uri: asset.uri }}
                                style={styles.categoryImage}
                                resizeMode="cover"
                            />
                            <View style={styles.categoryContent}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.categoryLabel, isActive && styles.activeCategoryLabel]}
                                >
                                    {item}
                                </Text>
                            </View>
                            {isActive && (
                                <View style={styles.activeDot}>
                                    <Ionicons name="checkmark-circle" size={14} color="#f97316" />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    sectionHeader: { paddingHorizontal: 20, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    listPadding: { paddingLeft: 20, paddingRight: 10 },
    categoryCard: {
        width: 85, height: 110, marginRight: 10,
        borderRadius: 16, overflow: 'hidden',
        borderColor: "#f1f5f9", borderWidth: 1.5,
        alignItems: "center", paddingTop: 10,
        backgroundColor: '#fff',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
    },
    activeCategoryCard: {
        borderColor: '#f97316',
        backgroundColor: '#fff7ed',
        borderWidth: 2
    },
    categoryImage: { height: 50, width: 50, borderRadius: 25, backgroundColor: '#f8fafc' },
    categoryContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 4 },
    categoryLabel: { color: "#64748b", fontSize: 12, fontWeight: "700" },
    activeCategoryLabel: { color: '#f97316' },
    activeDot: { position: 'absolute', top: 5, right: 5 }
});