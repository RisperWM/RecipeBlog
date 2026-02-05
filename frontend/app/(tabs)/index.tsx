import React, { useMemo } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, ListRenderItem, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { recipeService } from "@/src/service/recipeService";
import { useRecipeStore } from "@/src/store/recipeStore";
import { RecipeResponse } from "@/src/service/recipeService";

import HomeTopBar from "@/src/components/home/TopBar";
import CategoryList from "@/src/components/home/CategoryList";
import RecipeCard from "@/src/components/home/RecipeCard";
import Input from "@/src/components/Input";

export default function Index() {
  const queryClient = useQueryClient();
  const { searchQuery, selectedCategory, setSearchQuery } = useRecipeStore();
  const { data: recipes, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['recipes', selectedCategory],
    queryFn: () => recipeService.fetchAllRecipe(selectedCategory || undefined),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    return recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recipes, searchQuery]);

  const renderRecipeItem: ListRenderItem<RecipeResponse> = ({ item }) => (
    <RecipeCard item={item} />
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.titleText}>Explore Recipes</Text>
      <View style={styles.searchSection}>
        <Input
          icon="search"
          placeholder="Search delicious recipes..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </View>

      <CategoryList />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${selectedCategory} Recipes` : 'All Recipes'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeTopBar />
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item, index) => item._id || index.toString()}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          (isLoading || isFetching) ? (
            <ActivityIndicator size="large" color="#f97316" style={styles.loader} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recipes found in this category</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#f97316"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { backgroundColor: "#fff", },
  titleText: { fontSize: 28, fontWeight: "800", color: "#0f172a", paddingHorizontal: 20, },
  searchSection: { paddingHorizontal: 20, marginVertical: 10 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 10, marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 15
  },
  listContent: {
    paddingBottom: 40,
  },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: '#94a3b8', fontWeight: '500' }
});