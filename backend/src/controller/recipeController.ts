import { Response, Request } from "express";
import { recipeSchema } from "@shared/validator/recipeSchema.js";
import { Recipe } from "../model/Recipe.js";
import mongoose from "mongoose";

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
    const { userId } = req.query;

    try {
        const recipes = await Recipe.find()
            .populate('createdBy', 'firstName surname avatarUrl')
            .sort({ createdAt: -1 })
            .lean();

        const recipesWithState = recipes.map(recipe => ({
            ...recipe,
            isLiked: userId ? recipe.likes?.some((id: any) => id.toString() === userId) : false,
            likesCount: recipe.likes?.length || 0
        }));

        res.status(200).json(recipesWithState);
    } catch (error: any) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ message: "Server error while retrieving recipes" });
    }
}

export const fetchRecipeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.query;

    try {
        const recipe = await Recipe.findById(id)
            .populate('createdBy', 'firstName surname avatarUrl')
            .lean();

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const responseData = {
            ...recipe,
            isLiked: userId ? recipe.likes?.some((lid: any) => lid.toString() === userId) : false,
            likesCount: recipe.likes?.length || 0
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const fetchRecipeByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const viewerId = req.query.userId;

    try {
        const recipes = await Recipe.find({ createdBy: userId })
            .populate('createdBy', 'firstName surname')
            .sort({ createdAt: -1 })
            .lean();

        const recipesWithState = recipes.map(recipe => ({
            ...recipe,
            isLiked: viewerId ? recipe.likes?.some((id: any) => id.toString() === viewerId) : false,
            likesCount: recipe.likes?.length || 0
        }));

        res.status(200).json(recipesWithState);

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

export const toggleLike = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const isLiked = recipe.likes.includes(userId);

        if (isLiked) {
            recipe.likes = recipe.likes.filter(id => id.toString() !== userId);
        } else {
            recipe.likes.push(userId);
        }

        await recipe.save();

        return res.status(200).json({
            likesCount: recipe.likes.length,
            isLiked: !isLiked
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating likes" });
    }
};

export const addRating = async (req: Request, res: Response) => {
    const { recipeId, userId, score } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const recipe = await Recipe.findById(recipeId).session(session);
        if (!recipe) throw new Error("Recipe not found");

        if (!recipe.ratings) recipe.ratings = [];

        const existingRatingIndex = recipe.ratings.findIndex(
            (r: any) => r.userId.toString() === userId.toString()
        );

        let newCount = recipe.ratingCount || 0;
        let totalScore = (recipe.averageRating || 0) * newCount;

        if (existingRatingIndex !== -1) {
            const oldScore = recipe.ratings[existingRatingIndex].score;
            totalScore = totalScore - oldScore + score;

            recipe.ratings[existingRatingIndex].score = score;
        } else {
            totalScore += score;
            newCount += 1;

            recipe.ratings.push({ userId, score });
        }

        const newAverage = totalScore / newCount;

        recipe.averageRating = Number(newAverage.toFixed(1));
        recipe.ratingCount = newCount;

        await recipe.save({ session });
        await session.commitTransaction();

        res.status(200).json({
            averageRating: recipe.averageRating,
            ratingCount: recipe.ratingCount
        });
    } catch (error: any) {
        await session.abortTransaction();
        console.error("Rating Error:", error.message);
        res.status(500).json({ message: error.message || "Failed to submit rating" });
    } finally {
        session.endSession();
    }
};
