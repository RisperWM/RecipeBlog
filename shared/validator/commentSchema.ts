import {z} from "zod"

export const commentSchema = z.object({
    recipeId: z.string().min(1, "Recipeid is a mandatory field"),
    userId: z.string().min(1, "userId is a mandatory field"),
    text: z.string().min(1, "Comment text cannot be empty").max(1000, "Comment is too long")
})

export type CommentInput = z.infer<typeof commentSchema>;