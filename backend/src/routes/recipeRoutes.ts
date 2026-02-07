import express from "express";
import { protect } from "../middleware/auth.js";
import {
    createRecipe,
    fetchAllRecipe,
    fetchRecipeById,
    fetchRecipeByUserId,
    updateRecipe,
    deleteRecipe,
    addRating,
    toggleLike,
    fetchLikedRecipes
} from "../controller/recipeController.js";

const router = express.Router();

router.post("/", protect, createRecipe);
router.post("/:id/rate", protect, addRating);
router.post("/:id/like", protect, toggleLike);

router.get("/", fetchAllRecipe);
router.get("/:id", fetchRecipeById);
router.get("/user/:userId", fetchRecipeByUserId);
router.get("/liked/:userId", fetchLikedRecipes);

router.put("/:id", protect, updateRecipe);    
router.delete("/:id", protect, deleteRecipe);

export default router;
