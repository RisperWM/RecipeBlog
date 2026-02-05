import { Response, Request } from "express";
import { Comment } from "../model/Comment.js";
import mongoose from "mongoose";
import { commentSchema } from "@shared/validator/commentSchema.js";
import { Recipe } from "../model/Recipe.js";

export const addComment = async (req: Request, res: Response) => {
    const parsed = commentSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({
            message: "Vaidation error",
            errors: parsed.error.flatten()
        })
    }

    const { recipeId, userId, text } = parsed.data;

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const recipeExists = await Recipe.findById(recipeId).session(session);
        if (!recipeExists) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Recipe not found" });
        }

        const newComment = await Comment.create(
            [{ recipeId, userId, text }],
            { session }
        );

        await session.commitTransaction();

        const populatedComment = await newComment[0].populate('userId', 'name imageUrl');

        return res.status(201).json(populatedComment);

    } catch (error) {
        await session.abortTransaction();
        console.error("Add Comment Error:", error);
        return res.status(500).json({ message: "An internal server error occurred while posting your comment" });
    } finally {
        session.endSession();
    }

}

export const fetchCommentsByRecipe = async (req: Request, res: Response) => {
    try {
        const { recipeId } = req.params;

        if (!recipeId) {
            return res.status(400).json({ message: "Recipe ID is required to fetch comments" });
        }

        const comments = await Comment.find({ recipeId })
            .populate('userId', 'firstName surname avatarUrl')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);

    } catch (error: any) {
        console.error(`Error fetching comments for recipe ${req.params.recipeId}:`, error.message);
        res.status(500).json({ message: "Unable to load comments at this time." });
    }
}

export const editComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    const parsed = commentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You can only edit your own comments" });
        }

        comment.text = parsed.data.text;
        await comment.save();

        return res.status(200).json(comment);
    } catch (error) {
        console.error("Edit Comment Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own comments" });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};