import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { recipeService } from "@/src/service/recipeService";
import { useAuthStore } from "@/src/store/authStore";
import RecipeCard from "@/src/components/home/RecipeCard";

const MyRecipes = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data: myRecipes, isLoading, refetch } = useQuery({
    queryKey: ['my-recipes', user?._id],
    queryFn: () => recipeService.fetchRecipeByUserId(user?._id as string),
    enabled: !!user?._id,
  });

  const ListHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>My Kitchen</Text>
        <Text style={styles.subtitle}>
          {myRecipes?.length || 0} recipes created
        </Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/create-recipe-modal')}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.createButtonText}>New</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={myRecipes}
        keyExtractor={(item, index) => item._id ?? index.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <RecipeCard item={item} />}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>You haven't shared any recipes yet.</Text>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => router.push('/create-recipe-modal')}
              >
                <Text style={styles.outlineButtonText}>Start Cooking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 50 }} />
          )
        }
      />
    </SafeAreaView>
  );
};

export default MyRecipes;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#f97316',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonText: { color: '#fff', fontWeight: '700', marginLeft: 4 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginVertical: 20,
  },
  outlineButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f97316',
  },
  outlineButtonText: { color: '#f97316', fontWeight: '700' },
});