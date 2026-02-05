import express from "express";
import { protect } from "../middleware/auth.js";
import {
    addComment,
    editComment,
    deleteComment,
    fetchCommentsByRecipe
} from "../controller/commentController.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/recipe/:recipeId", fetchCommentsByRecipe);
router.patch("/:commentId", protect, editComment);
router.delete("/:commentId", protect, deleteComment);

export default router;