import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Image } from "react-native";
import { MEAL_CATEGORIES, CATEGORY_ASSETS } from "@shared/constants/mealCategory";
import { useRecipeStore } from "@/src/store/recipeStore";

export default function CategoryList() {
    const { selectedCategory, setFilters } = useRecipeStore();

    return (
        <>
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
                            style={[styles.categoryCard, isActive && styles.activeCategoryCard]}
                            onPress={() => setFilters(isActive ? null : item, null)}
                        >
                            <Image source={{ uri: asset.uri }} style={styles.categoryImage} />
                            <View style={styles.categoryContent}>
                                <Text style={[styles.categoryLabel, isActive && styles.activeCategoryLabel]}>
                                    {item}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    sectionHeader: { paddingHorizontal: 20, marginVertical: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b' },
    listPadding: { paddingLeft: 20, paddingRight: 10, marginBottom: 10 },
    categoryCard: {
        width: 80, height: 100, marginRight: 8,
        borderRadius: 10, overflow: 'hidden',
        borderColor: "#eee", borderWidth: 1,
        alignItems: "center", paddingTop: 10,
        backgroundColor: '#fff'
    },
    activeCategoryCard: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
    categoryImage: { height: 50, width: 50, borderRadius: 25 },
    categoryContent: { flex: 1, justifyContent: 'center' },
    categoryLabel: { color: "#64748b", fontSize: 12, fontWeight: "600" },
    activeCategoryLabel: { color: '#f97316' },
});