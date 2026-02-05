import { z } from "zod";
import { ingredientSchema } from "./ingredientSchema.js";
import { stepSchema } from "./stepSchema.js";
import { CUISINES } from "../constants/cuisine.js";
import { MEAL_CATEGORIES } from "../constants/mealCategory";


export const recipeSchema = z.object({
    _id:z.string().optional(),
    name: z.string().min(1, "Recipe name is required"),

    category: z.enum(MEAL_CATEGORIES, {
        message: "Please select a valid category"
    }),

    cuisine: z.enum(CUISINES, {
        message: "Please select a valid cuisine"
    }),

    imageUrl: z.string().url("Must be a valid URL"),
    description: z.string().min(10, "Description should be at least 10 characters").optional(),

    ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
    steps: z.array(stepSchema).min(1, "At least one step is required"),

    prepTime: z.preprocess((val) => Number(val), z.number().int().nonnegative()).optional(),
    cookTime: z.preprocess((val) => Number(val), z.number().int().nonnegative()).optional(),
    servings: z.preprocess((val) => Number(val), z.number().int().positive()).optional(),

    tags: z.array(z.string()).optional(),
});

export type RecipeInput = z.infer<typeof recipeSchema>;