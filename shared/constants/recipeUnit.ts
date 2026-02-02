// Add this to your constants or at the top of the file
export const RECIPE_UNITS = [
    "tsp", "tbsp", "cup", "ml", "l", "g", "kg", "piece",
    
] as const; 
export type RecipeUnit = typeof RECIPE_UNITS[number];