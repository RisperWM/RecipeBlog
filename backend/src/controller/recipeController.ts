import { Response, Request } from "express";
import { recipeSchema } from "@shared/validator/recipeSchema.js";
import { Recipe } from "../model/Recipe.js";
import mongoose from "mongoose";
import { receiveMessageOnPort } from "node:worker_threads";

export const createRecipe = async (req: Request, res: Response) => {
    const parsed = recipeSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400). json({
            message:"Vaidation error",
            errors: parsed.error.flatten()
        })
    }

    const recipeData = parsed.data
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const newRecipe = await Recipe.create(
            [
                {
                    ...recipeData,
                    createdBy: (req as any).userId
                }
            ],
            { session }
        )

        await session.commitTransaction()
        res.status(201).json(newRecipe)
    }
    catch (error) {
        await session.abortTransaction()
        console.error("Recipe createion error:", error)
        return res.status(500).json({
            message: "Something went wrong during recipe creation"
        })
    } finally {
        session.endSession()
    }
}

export const fetchAllRecipe = async (req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find()
            .populate('createdBy', 'firstName surname avatarUrl')
            .sort({ createdAt: -1 });

        res.status(200).json(recipes);
    } catch (error: any) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ message: "Server error while retrieving recipes" });
    }
}

export const fetchRecipeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id).populate('createdBy', 'firstName surname avatarUrl');

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const fetchRecipeByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const recipes = await Recipe.find({ createdBy: userId })
            .populate('createdBy', 'firstName surname')
            .sort({ createdAt: -1 });

        res.status(200).json(recipes);

    } catch (error) {
        console.error("Error fetching recipes by user:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;

    const parsed = recipeSchema.partial().safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: parsed.error.flatten(),
        });
    }

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.createdBy.toString() !== (req as any).userId) {
            return res.status(403).json({ message: "Not authorized to update this recipe" });
        }

        Object.assign(recipe, parsed.data);

        await recipe.save();
        res.status(200).json(recipe);
    } catch (err) {
        console.error("Recipe update error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.createdBy.toString() !== (req as any).userId) {
            return res.status(403).json({ message: "Not authorized to delete this recipe" });
        }

        await recipe.deleteOne();

        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (err) {
        console.error("Recipe deletion error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
