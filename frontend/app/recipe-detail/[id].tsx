import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/src/service/recipeService';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'Ingredients' | 'Instructions';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('Ingredients');

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.fetchRecipeById(id),
    enabled: !!id,
  });

  if (isLoading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#f97316" /></View>
  );

  if (error || !recipe) return (
    <View style={styles.centered}><Text>Recipe not found.</Text></View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerTintColor: '#fff' }} />

      <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>

          <View style={styles.metaRow}>
            {/* Prep Time */}
            <View style={styles.metaBadge}>
              <Ionicons name="timer-outline" size={16} color="#f97316" />
              <Text style={styles.metaText}>{recipe.prepTime}m Prep</Text>
            </View>

            {/* Cook Time */}
            <View style={styles.metaBadge}>
              <Ionicons name="flame-outline" size={16} color="#f97316" />
              <Text style={styles.metaText}>{recipe.cookTime}m Cook</Text>
            </View>

            {/* Cuisine */}
            <View style={styles.metaBadge}>
              <Ionicons name="earth-outline" size={16} color="#f97316" />
              <Text style={styles.metaText}>{recipe.cuisine}</Text>
            </View>
          </View>

          {/* --- TABS SECTION --- */}
          <View style={styles.tabContainer}>
            {(['Ingredients', 'Instructions'] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* --- CONDITIONAL CONTENT --- */}
          <View style={styles.detailsContainer}>
            {activeTab === 'Ingredients' ? (
              recipe.ingredients.map((ing: any, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bulletContainer}>
                    <Ionicons name="checkmark-circle" size={18} color="#f97316" />
                  </View>
                  <Text style={styles.ingredientText}>
                    <Text style={{ fontWeight: '700' }}>{ing.quantity} {ing.unit}</Text> {ing.name}
                  </Text>
                </View>
              ))
            ) : (
              recipe.steps.map((step: any, index: number) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepNumber}>STEP {index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.instruction}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: '100%', height: 250 },
  content: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    backgroundColor: '#fff',
    minHeight: 500
  },
  title: { fontSize: 25, fontWeight: '600', color: '#0f172a', marginBottom: 12, textAlign:"center", textTransform:"capitalize" },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  metaText: {
    fontSize: 13,
    color: '#9a3412',
    fontWeight: '700',
    marginLeft: 5
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
  
    marginBottom: 24
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center',  backgroundColor: '#f1f5f9', },
  activeTab: { elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#f97316', borderBottomColor:"#f97316",  },

  detailsContainer: { paddingBottom: 40 },

  // Ingredient Styles
  ingredientItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#f8fafc', padding: 12, borderRadius: 16 },
  bulletContainer: { marginRight: 12 },
  ingredientText: { fontSize: 16, color: '#334155', flex: 1 },

  // Step Styles
  stepItem: { marginBottom: 24 },
  stepHeader: { marginBottom: 8 },
  stepNumber: { fontSize: 12, fontWeight: '900', color: '#f97316', letterSpacing: 1 },
  stepText: { fontSize: 16, color: '#334155', lineHeight: 26, fontWeight: '400' }
});