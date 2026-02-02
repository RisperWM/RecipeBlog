import React, { useMemo } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, ListRenderItem } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { recipeService } from "@/src/service/recipeService";
import { useRecipeStore } from "@/src/store/recipeStore";
import { RecipeResponse } from "@/src/service/recipeService";

import HomeTopBar from "@/src/components/home/TopBar";
import CategoryList from "@/src/components/home/CategoryList";
import RecipeCard from "@/src/components/home/RecipeCard";
import Input from "@/src/components/Input";

export default function Index() {
  const { searchQuery, selectedCategory, setSearchQuery } = useRecipeStore();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', selectedCategory],
    queryFn: () => recipeService.fetchAllRecipe(selectedCategory || undefined),
    staleTime: 1000 * 60 * 5,
  });

  const filteredRecipes = useMemo(() => {
    return recipes?.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
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
          onChangeText={setSearchQuery}
        />
      </View>
      <CategoryList />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Recipes</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HomeTopBar />
      <FlatList
        data={filteredRecipes}
        // SENIOR TIP: When changing numColumns, sometimes you need to 
        // change the key of the FlatList to force a fresh render
        key={2}
        numColumns={2}
        keyExtractor={(item, index) => item._id ?? index.toString()}
        ListHeaderComponent={ListHeader}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContent}
        // This is the magic prop for grid layouts
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#f97316" style={styles.loader} />
          ) : (
            <Text style={styles.emptyText}>No recipes found</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { backgroundColor: "#fff", paddingTop: 10 },
  titleText: { fontSize: 28, fontWeight: "800", color: "#0f172a", paddingHorizontal: 20 },
  searchSection: { paddingHorizontal: 20, marginVertical: 10 },
  sectionHeader: { paddingHorizontal: 20, marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 30,
  },
  loader: { marginTop: 40 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94a3b8' }
});