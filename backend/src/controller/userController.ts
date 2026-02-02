import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/User.js";
import { registerSchema } from "../../../shared/validator/registerSchema.js";
import mongoose from "mongoose";
import { generateToken } from "../utils/jwt.js";
import { loginSchema } from "../../../shared/validator/loginSchema.js";

export const register = async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: parsed.error.flatten().fieldErrors,
        });
    }

    const data = parsed.data;

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const existingUser = await User.findOne({ email: data.email }).session(session);
        if (existingUser) {
            await session.abortTransaction()
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const [user] = await User.create(
            [
                {
                    ...data,
                    password: hashedPassword,
                }
            ],
            { session }
        );

        await session.commitTransaction()

        const token = generateToken(user._id.toString())

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                surname: user.surname,
                middleName: user.middleName,
                email: user.email,
            },
        });
    } catch (error) {
        await session.abortTransaction()
        console.error("User registration error:", error);
        return res.status(500).json({
            message: "Something went wrong during registration",
        });
    } finally {
        session.endSession()
    }
};


export const login = async ( req:Request, res:Response) => {
    try {

        const parsed = loginSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: parsed.error.flatten().fieldErrors
            })
        }

        const { email, password } = parsed.data
        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({message:"Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        const token = generateToken(user._id.toString())
        
        return res.status(200).json({
            message:"Login successful",
            token,
            user: {
                id:user._id,
                firstName:user.firstName,
                middleName:user.middleName,
                surname: user.surname,
                email:user.email
            }
        })

    }
    catch (error) {
        console.error("Login Error:", error)
        return res.status(500).json({message:"Server error"})
    }
}
