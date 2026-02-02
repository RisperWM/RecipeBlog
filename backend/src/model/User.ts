import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    middleName?: string;
    surname: string;
    email: string;
    password: string;
    gender: "male" | "female" | "other";
    phoneNumber: string;
    countryCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        surname: {
            type: String,
            required: [true, "Surname is required"],
            trim: true
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message: "{VALUE} is not a valid gender"
            },
            required: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"]
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"]
        },
        countryCode: {
            type: String,
            required: true,
            default: "+254"
        }
    },
    {
        timestamps: true
    }
);

// 3. Create the Model
export const User = model<IUser>("User", userSchema);