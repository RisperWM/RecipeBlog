import { z } from "zod";

export const stepSchema = z.object({
    stepNumber: z.number().int().positive("Step number must be ≥ 1"),
    instruction: z.string().min(1, "Instruction is required"),
});
