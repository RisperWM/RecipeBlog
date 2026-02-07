import apiClient from "./api";
import { CUISINES } from '@shared/constants/cuisine';
import { MEAL_CATEGORIES } from '@shared/constants/mealCategory';
import { RecipeInput } from '@shared/validator/recipeSchema';
import { CommentInput } from '@shared/validator/commentSchema';

// --- Interfaces & Types ---

interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

interface Step {
    stepNumber: number;
    instruction: string;
}

interface Rating {
    userId: string
    score: number
}

export interface RecipeResponse {
    _id: string;
    name: string;
    cuisine: typeof CUISINES[number];
    category: typeof MEAL_CATEGORIES[number];
    imageUrl: string;
    description: string;
    ingredients: Ingredient[];
    steps: Step[];
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    tags?: string[];
    likes:string;
    ratings:Rating[];
    averageRating: number;
    ratingCount: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CommentResponse {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        surname: string;
        avatarUrl?: string;
    };
    recipeId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

// --- Service Implementation ---

export const recipeService = {
    /**
     * RECIPE ACTIONS
     */
    createRecipe: async (recipeData: RecipeInput): Promise<RecipeResponse> => {
        try {
            const { data } = await apiClient.post<RecipeResponse>('/recipes', recipeData);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to create recipe");
        }
    },

    fetchAllRecipe: async (category?: string): Promise<RecipeResponse[]> => {
        try {
            const { data } = await apiClient.get<RecipeResponse[]>('/recipes', {
                params: { category }
            });
            return data;
        } catch (error: any) {
            console.error("Fetch all recipes error:", error.message);
            return [];
        }
    },

    fetchRecipeById: async (recipeId: string): Promise<RecipeResponse> => {
        try {
            const { data } = await apiClient.get<RecipeResponse>(`/recipes/${recipeId}`);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Recipe not found");
        }
    },

    fetchRecipeByUserId: async (userId: string): Promise<RecipeResponse[]> => {
        try {
            const { data } = await apiClient.get<RecipeResponse[]>(`/recipes/user/${userId}`);
            return data;
        } catch (error: any) {
            console.error("Fetch user recipes error:", error.message);
            return [];
        }
    },

    updateRecipe: async (recipeId: string, updateData: Partial<RecipeInput>): Promise<RecipeResponse> => {
        try {
            const { data } = await apiClient.put<RecipeResponse>(`/recipes/${recipeId}`, updateData);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update recipe");
        }
    },

    deleteRecipe: async (recipeId: string): Promise<{ message: string }> => {
        try {
            const { data } = await apiClient.delete<{ message: string }>(`/recipes/${recipeId}`);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete recipe");
        }
    },

    /**
     * COMMENT ACTIONS
     */
    fetchComments: async (recipeId: string): Promise<CommentResponse[]> => {
        try {
            const { data } = await apiClient.get<CommentResponse[]>(`/comments/recipe/${recipeId}`);
            return data;
        } catch (error: any) {
            console.log(error.message)
            return [];
        }
    },

    addComment: async (comment: CommentInput): Promise<CommentResponse> => {
        try {
            const { data } = await apiClient.post<CommentResponse>('/comments', comment);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Invalid comment data");
        }
    },

    editComment: async (commentId: string, text: string, userId: string): Promise<CommentResponse> => {
        try {
            const { data } = await apiClient.patch<CommentResponse>(`/comments/${commentId}`, {
                text,
                userId
            });
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Update failed");
        }
    },

    deleteComment: async (commentId: string, userId: string): Promise<{ message: string }> => {
        try {
            const { data } = await apiClient.delete<{ message: string }>(`/comment/${commentId}`, {
                data: { userId }
            });
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Could not delete comment");
        }
    },

    toggleLike: async (recipeId: string, userId: string): Promise<{ likesCount: number, isLiked: boolean }> => {
        try {
            const { data } = await apiClient.post<{ likesCount: number, isLiked: boolean }>(
                `/recipes/${recipeId}/like`,
                { userId }
            );

            return data;
        } catch (error: any) {
            console.log("Like Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Like failed");
        }
    },

    addRating: async (recipeId: string, userId: string, score: number): Promise<{ averageRating: number, ratingCount: number }> => {
        try {
            const { data } = await apiClient.post<{ averageRating: number, ratingCount: number }>(
                `/recipes/${recipeId}/rate`,
                {
                    recipeId,
                    userId,
                    score
                }
            );
            return data;
        } catch (error: any) {
            console.log("Rating Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Rating failed");
        }
    }
};