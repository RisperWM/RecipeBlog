import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    recipeId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    text: string;
}

const CommentSchema = new Schema({
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);