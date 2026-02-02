import mongoose, { Schema, Document } from 'mongoose';
import { CUISINES } from '@shared/constants/cuisine.js';
import { MEAL_CATEGORIES } from '@shared/constants/mealCategory.js';

// 1. Define the allowed taxonomies as constants

interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

interface Step {
    stepNumber: number;
    instruction: string;
}

// 2. Updated Interface
export interface IRecipe extends Document {
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
    createdBy: mongoose.Types.ObjectId | ICreator;
    createdAt: Date;
    updatedAt: Date;
}

interface ICreator {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    surname: string;
    avatarUrl?: string;
}

const IngredientSchema = new Schema<Ingredient>(
    {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
    },
    { _id: false }
);

const StepSchema = new Schema<Step>(
    {
        stepNumber: { type: Number, required: true },
        instruction: { type: String, required: true }
    },
    { _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
    {
        name: { type: String, required: true, trim: true },
        imageUrl: { type: String, required: true },
        description: { type: String },

        // 3. Add Enums to the Schema for database-level validation
        cuisine: {
            type: String,
            enum: CUISINES,
            required: true,
            default: "Kenyan"
        },
        category: {
            type: String,
            enum: MEAL_CATEGORIES,
            required: true,
            default: "Dinner"
        },

        ingredients: { type: [IngredientSchema], required: true },
        steps: { type: [StepSchema], required: true },
        prepTime: Number,
        cookTime: Number,
        servings: Number,
        tags: [String],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Changed export name to avoid conflict with the interface
export const Recipe = mongoose.model<IRecipe>("Recipe", RecipeSchema);