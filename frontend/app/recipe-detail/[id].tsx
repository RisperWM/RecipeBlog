import React, { useState, useLayoutEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	Dimensions,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

// Service & Store
import { recipeService } from "@/src/service/recipeService";
import { useAuthStore } from "@/src/store/authStore";

// Modular Components
import RatingModal from "@/src/components/recipe/RatingModal";
import { CommentInput } from "@/src/components/recipe/CommentInput";
import CommentSection from "@/src/components/recipe/CommentSection";
import { IngredientItem } from "@/src/components/recipe/IngredientItem";
import { StepItem } from "@/src/components/recipe/StepItem";
import RecipeTabs from "@/src/components/recipe/RecipeTabs";
import { RecipeMeta } from "@/src/components/recipe/RecipeMeta";
import RecipeHero from "@/src/components/recipe/RecipeHero";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RecipeDetailScreen() {
	const user = useAuthStore((state) => state.user);
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const navigation = useNavigation();
	const queryClient = useQueryClient();

	const [activeTab, setActiveTab] = useState<"Ingredients" | "Instructions">("Ingredients");
	const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
	const [newComment, setNewComment] = useState("");
	const [ratingModalVisible, setRatingModalVisible] = useState(false);

	// --- DATA FETCHING ---
	const { data: recipe, isLoading, error } = useQuery({
		queryKey: ["recipe", id, user?.id],
		queryFn: () => recipeService.fetchRecipeById(id as string),
		enabled: !!id,
	});

	const { data: comments = [] } = useQuery({
		queryKey: ["comments", id],
		queryFn: () => recipeService.fetchComments(id as string),
		enabled: !!id,
	});

	const isCurrentlyLiked = !!(recipe as any)?.isLiked;

	// --- HEADER SYNC ---
	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "",
			headerTransparent: true,
			headerTintColor: "#fff",
			headerRight: () => (
				<View style={styles.headerRightContainer}>
					<TouchableOpacity
						onPress={() => router.push({
							pathname: "/create-recipe-modal",
							params: { initialData: JSON.stringify(recipe) },
						})}
						style={styles.headerIconButton}
					>
						<Ionicons name="create-outline" size={20} color="#fff" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleLike()} style={styles.headerIconButton}>
						<Ionicons
							name={isCurrentlyLiked ? "heart" : "heart-outline"}
							size={20}
							color={isCurrentlyLiked ? "#ef4444" : "#fff"}
						/>
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation, isCurrentlyLiked, recipe]);

	// --- MUTATIONS ---
	const { mutate: handleLike } = useMutation({
		mutationFn: () => {
			if (!user?.id) throw new Error("Please log in to like recipes.");
			return recipeService.toggleLike(id as string, user.id);
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["recipe", id, user?.id] });
			const previousRecipe = queryClient.getQueryData(["recipe", id, user?.id]);
			queryClient.setQueryData(["recipe", id, user?.id], (old: any) => {
				if (!old) return old;
				const status = !!old.isLiked;
				return {
					...old,
					isLiked: !status,
					likesCount: !status ? (Number(old.likesCount) || 0) + 1 : Math.max(0, (Number(old.likesCount) || 1) - 1),
				};
			});
			return { previousRecipe };
		},
		onError: (err: any, __, context) => {
			queryClient.setQueryData(["recipe", id, user?.id], context?.previousRecipe);
			Alert.alert("Action Failed", err.message);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["recipe", id, user?.id] }),
	});

	const { mutate: submitRating, isPending: isSubmittingRating } = useMutation({
		mutationFn: (score: number) => recipeService.addRating(id!, user?.id || "", score),
		onSuccess: (data) => {
			queryClient.setQueryData(["recipe", id, user?.id], (old: any) => ({
				...old,
				averageRating: data.averageRating,
				ratingCount: data.ratingCount,
			}));
			setRatingModalVisible(false);
			Alert.alert("Success", "Thanks for your feedback!");
		},
		onError: (err: any) => Alert.alert("Error", err.message),
	});

	const { mutate: submitComment, isPending: isSubmittingComment } = useMutation({
		mutationFn: () => recipeService.addComment({ recipeId: id!, userId: user?.id || "", text: newComment }),
		onSuccess: () => {
			setNewComment("");
			queryClient.invalidateQueries({ queryKey: ["comments", id] });
		},
		onError: (err: any) => Alert.alert("Error", err.message),
	});

	// --- HANDLERS ---
	const handleToggleIngredient = (name: string) => {
		setCheckedIngredients((prev) =>
			prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
		);
	};

	// --- RENDER STATES ---
	if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#f97316" /></View>;
	if (error || !recipe) return <View style={styles.centered}><Text style={styles.errorText}>Recipe not found.</Text></View>;

	return (
		<View style={styles.screenWrapper}>
			<KeyboardAvoidingView
				style={styles.flexOne}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView
					style={styles.container}
					bounces={false}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={styles.scrollContent}
				>
					<Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />

					<View style={styles.contentCard}>
						<RecipeHero
							name={recipe.name}
							averageRating={recipe.averageRating}
							ratingCount={recipe.ratingCount}
							onRatePress={() => setRatingModalVisible(true)}
						/>

						<RecipeMeta
							prepTime={recipe.prepTime}
							cookTime={recipe.cookTime}
							servings={recipe.servings}
							category={recipe.category}
						/>

						<RecipeTabs activeTab={activeTab} onTabChange={setActiveTab} />

						<View style={styles.detailsContainer}>
							{activeTab === "Ingredients" ? (
								<IngredientItem
									ingredients={recipe.ingredients}
									checkedIngredients={checkedIngredients}
									onToggleIngredient={handleToggleIngredient}
								/>
							) : (
								<StepItem steps={recipe.steps} />
							)}
						</View>

						<CommentSection comments={comments} />
					</View>
				</ScrollView>

				<CommentInput
					value={newComment}
					onChange={setNewComment}
					onSubmit={submitComment}
					isPending={isSubmittingComment}
				/>
			</KeyboardAvoidingView>

			<RatingModal
				visible={ratingModalVisible}
				onClose={() => setRatingModalVisible(false)}
				onSubmit={submitRating}
				isSubmitting={isSubmittingRating}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	screenWrapper: {
		flex: 1,
		backgroundColor: "#fff"
	},
	flexOne: {
		flex: 1
	},
	container: {
		flex: 1
	},
	scrollContent: {
		paddingBottom: 20
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	errorText: {
		color: "#64748b", fontSize: 16
	},
	heroImage: {
		width: "100%",
		height: SCREEN_HEIGHT * 0.35
	},
	headerRightContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginRight: 15
	},
	headerIconButton: {
		backgroundColor: "rgba(0,0,0,0.4)",
		padding: 8,
		borderRadius: 20
	},
	contentCard: {
		padding: 20,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		marginTop: -32,
		backgroundColor: "#fff",
		minHeight: SCREEN_HEIGHT * 0.7,
	},
	detailsContainer: {
		marginBottom: 30
	},
});