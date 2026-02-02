import { create } from 'zustand';
import { RecipeInput } from '@shared/validator/recipeSchema';

interface RecipeState {
    searchQuery: string;
    selectedCategory: string | null;
    selectedCuisine: string | null;

    draft: Partial<RecipeInput>;
    setDraft: (data: Partial<RecipeInput>) => void;
    resetDraft: () => void;
    setSearchQuery: (query: string) => void;
    setFilters: (category: string | null, cuisine: string | null) => void;
    resetFilters: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
    draft: {
        ingredients: [{ name: '', quantity: 0, unit: 'g' }],
        steps: [{ stepNumber: 1, instruction: '' }],
    },
    searchQuery: '',
    selectedCategory: null,
    selectedCuisine: null,

    setDraft: (data) => set((state) => ({ draft: { ...state.draft, ...data } })),
    resetDraft: () => set({ draft: { ingredients: [], steps: [] } }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    setFilters: (category, cuisine) =>
        set({ selectedCategory: category, selectedCuisine: cuisine }),

    resetFilters: () => set({ selectedCategory: null, selectedCuisine: null, searchQuery: '' }),
}));