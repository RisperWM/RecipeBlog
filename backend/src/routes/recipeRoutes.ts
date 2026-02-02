import express from "express";
import { protect } from "../middleware/auth.js";
import {
    createRecipe,
    fetchAllRecipe,
    fetchRecipeById,
    fetchRecipeByUserId,
    updateRecipe,
    deleteRecipe
} from "../controller/recipeController.js";

const router = express.Router();

router.post("/", protect, createRecipe);
router.get("/", fetchAllRecipe);
router.get("/:id", fetchRecipeById);
router.get("/user/:userId", fetchRecipeByUserId);

router.put("/:id", protect, updateRecipe);    
router.delete("/:id", protect, deleteRecipe);

export default router;
