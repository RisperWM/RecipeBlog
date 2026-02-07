import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	RefreshControl
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/src/service/recipeService';
import { useAuthStore } from '@/src/store/authStore';
import RecipeCard from '@/src/components/home/RecipeCard';

const FavouritesScreen = () => {
	const user = useAuthStore((state) => state.user);

	const {
		data: recipes = [],
		isLoading,
		isRefetching,
		refetch
	} = useQuery({
		queryKey: ['liked-recipes', user?.id],
		queryFn: () => recipeService.fetchLikedRecipes(user?.id || ''),
		enabled: !!user?.id,
	});

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#f97316" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Your Favourites</Text>
				<Text style={styles.subtitle}>{recipes.length} recipes saved</Text>
			</View>

			<FlatList
				data={recipes}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<RecipeCard item={item} />
				)}
				numColumns={2}
				columnWrapperStyle={styles.columnWrapper}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#f97316" />
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyTitle}>No favourites yet</Text>
						<Text style={styles.emptySubtitle}>
							Tap the heart icon on any recipe to save it here!
						</Text>
					</View>
				}
			/>
		</View>
	);
};

export default FavouritesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 40,
		paddingBottom: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: '800',
		color: '#0f172a',
	},
	subtitle: {
		fontSize: 14,
		color: '#64748b',
		marginTop: 4,
	},
	listContent: {
		paddingHorizontal: 15,
		paddingBottom: 20,
	},
	columnWrapper: {
		justifyContent: 'space-between',
		marginBottom: 15,
	},
	emptyContainer: {
		marginTop: 100,
		alignItems: 'center',
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1e293b',
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: '#94a3b8',
		textAlign: 'center',
		lineHeight: 20,
	},
});