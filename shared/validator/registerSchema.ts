import {z} from "zod"

export const registerSchema = z.object({
    firstName:z.string().min(2),
    middleName: z.string(). optional(),
    surname:z.string().optional(),
    gender:z.enum(["male", "female", "other"]),
    countryCode:z.string(). min(1),
    phoneNumber:z.string().min(7),
    email: z.string().email(),
    password:z.string().min(8)
})
export type RegisterInput = z.infer<typeof registerSchema>;
