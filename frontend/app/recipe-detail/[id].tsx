import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'; // Added useRouter
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/src/service/recipeService';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// --- TYPES ---
interface Recipe {
  _id?: string;
  name: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  cuisine: string;
  category: string;
  servings?: number;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { instruction: string }[];
  createdBy: {
    _id?: string;
    firstName: string;
    surname: string;
  };
}

type TabType = 'Ingredients' | 'Instructions';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter(); // Initialize router
  const [activeTab, setActiveTab] = useState<TabType>('Ingredients');
  const [isLiked, setIsLiked] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.fetchRecipeById(id as string) as any,
    enabled: !!id,
  });

  const toggleIngredient = (name: string) => {
    if (checkedIngredients.includes(name)) {
      setCheckedIngredients(prev => prev.filter(i => i !== name));
    } else {
      setCheckedIngredients(prev => [...prev, name]);
    }
  };

  if (isLoading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#f97316" />
    </View>
  );

  if (error || !recipe) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>Recipe not found.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{
        title: '',
        headerTransparent: true,
        headerTintColor: '#fff',
        headerBackTitle: "",
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            {/* EDIT BUTTON */}
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/create-recipe-modal',
                params: { initialData: JSON.stringify(recipe) }
              })}
              style={styles.headerIconButton}
            >
              <Ionicons name="create-outline" size={22} color="#fff" />
            </TouchableOpacity>

            {/* LIKE BUTTON */}
            <TouchableOpacity onPress={() => setIsLiked(!isLiked)} style={styles.headerIconButton}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={22}
                color={isLiked ? "#ef4444" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        )
      }} />

      <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />

        <View style={styles.content}>

          {/* --- TITLE & AUTHOR --- */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{recipe.name}</Text>
            <View style={styles.authorBadge}>
              <Text style={styles.authorLabel}>Recipe by</Text>
              <Text style={styles.authorName}>
                {recipe.createdBy?.firstName} {recipe.createdBy?.surname}
              </Text>
            </View>
          </View>

          {/* --- META ROW (USER FRIENDLY) --- */}
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Ionicons name="time-outline" size={20} color="#f97316" />
              <View>
                <Text style={styles.metaLabel}>Time</Text>
                <Text style={styles.metaValue}>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaBox}>
              <Ionicons name="people-outline" size={20} color="#f97316" />
              <View>
                <Text style={styles.metaLabel}>Serves</Text>
                <Text style={styles.metaValue}>{recipe.servings || 1} People</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaBox}>
              <Ionicons name="flame-outline" size={20} color="#f97316" />
              <View>
                <Text style={styles.metaLabel}>Kind</Text>
                <Text style={styles.metaValue}>{recipe.category || 'Easy'}</Text>
              </View>
            </View>
          </View>

          {/* --- TABS --- */}
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

          <View style={styles.detailsContainer}>
            {activeTab === 'Ingredients' ? (
              recipe.ingredients?.map((ing, index: number) => {
                const isSelected = checkedIngredients.includes(ing.name);
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.ingredientItem}
                    onPress={() => toggleIngredient(ing.name)}
                    activeOpacity={0.7}
                  >
                    <FontAwesome6 name="list-check" size={14} color="#6d6b6b" style={{ marginRight: 10 }} />
                    <Text style={[styles.ingredientText, isSelected && styles.textChecked]}>
                      {ing.name}
                    </Text>
                    <Text style={[styles.qtyText, isSelected && styles.textChecked]}>
                      {ing.quantity} {ing.unit}
                    </Text>
                    <Checkbox
                      style={styles.checkbox}
                      value={isSelected}
                      onValueChange={() => toggleIngredient(ing.name)}
                      color={isSelected ? '#f97316' : '#cbd5e1'}
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              recipe.steps?.map((step, index: number) => (
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
  errorText: { color: '#64748b', fontSize: 16 },
  heroImage: { width: '100%', height: SCREEN_HEIGHT * 0.35 },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 15,
  },
  headerIconButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 25,
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    backgroundColor: '#fff',
    minHeight: SCREEN_HEIGHT * 0.6,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: "center",
    textTransform: "capitalize"
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4
  },
  authorLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f97316',
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metaBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 10,
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 30,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26,
  },
  activeTab: {
    backgroundColor: "#f97316",
    elevation: 3,
    shadowColor: '#f97316',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabText: { fontSize: 15, fontWeight: '700', color: '#64748b' },
  activeTabText: { color: '#fff' },
  detailsContainer: { paddingBottom: 40 },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
  },
  ingredientText: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
    fontWeight: '500'
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 10
  },
  textChecked: {
    textDecorationLine: 'line-through',
    color: '#cbd5e1',
  },
  stepItem: { marginBottom: 24 },
  stepHeader: { marginBottom: 6 },
  stepNumber: {
    fontSize: 12,
    fontWeight: '900',
    color: '#f97316',
    letterSpacing: 1.5
  },
  stepText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
    fontWeight: '400'
  }
});