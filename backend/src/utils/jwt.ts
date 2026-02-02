import jwt from "jsonwebtoken";

export const generateToken = (userId:string):string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined")
    }

    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    );
}