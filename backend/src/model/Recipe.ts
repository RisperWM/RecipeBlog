import mongoose, { Schema, Document } from 'mongoose';
import { CUISINES } from '@shared/constants/cuisine.js';
import { MEAL_CATEGORIES } from '@shared/constants/mealCategory.js';
import { int } from 'zod';

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
    likes: string[];
    ratings: Rating[],
    averageRating: number;
    ratingCount: number;
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
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        ratings: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                score: { type: Number, required: true, min: 1, max: 5 }
            }
        ],
        averageRating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", RecipeSchema);