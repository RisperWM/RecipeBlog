import { z } from "zod";

export const ingredientSchema = z.object({
    name: z.string().min(1, "Ingredient name is required"),
    quantity: z.number().positive("Quantity must be greater than 0"),
    unit: z.enum([
        "tsp",
        "tbsp",
        "cup",
        "ml",
        "l",
        "g",
        "kg",
        "piece"
    ], "Unit must be a valid standard measurement"),
});
