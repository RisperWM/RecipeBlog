import apiClient from "./api";
import { CUISINES } from '@shared/constants/cuisine';
import { MEAL_CATEGORIES } from '@shared/constants/mealCategory';
import { RecipeInput } from '@shared/validator/recipeSchema'; // Import your Zod type

interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

interface Step {
    stepNumber: number;
    instruction: string;
}

export interface RecipeResponse {
    _id?: string;
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
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export const recipeService = {
    createRecipe: async (recipeData: RecipeInput): Promise<RecipeResponse> => {
        const { data } = await apiClient.post<RecipeResponse>('/recipes', recipeData);
        return data;
    },

    fetchAllRecipe: async (category?: string): Promise<RecipeResponse[]> => {
        const { data } = await apiClient.get<RecipeResponse[]>('/recipes', {
            params: { category }
        });
        return data;
    },

    fetchRecipeById: async (recipeId: string): Promise<RecipeResponse> => {
        const { data } = await apiClient.get<RecipeResponse>(`/recipes/${recipeId}`);
        return data;
    },

    fetchRecipeByUserId: async (userId: string): Promise<RecipeResponse[]> => {
        const { data } = await apiClient.get<RecipeResponse[]>(`/recipes/user/${userId}`);
        return data;
    },

    updateRecipe: async (recipeId: string, updateData: Partial<RecipeInput>): Promise<RecipeResponse> => {
        const { data } = await apiClient.put<RecipeResponse>(`/recipes/${recipeId}`, updateData);
        return data;
    },

    deleteRecipe: async (recipeId: string): Promise<{ message: string }> => {
        const { data } = await apiClient.delete(`/recipes/${recipeId}`);
        return data;
    }
};