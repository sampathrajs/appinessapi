import { Document } from "mongoose";
import { UserInterface } from "./../Interfaces/User.Interface";
import * as jwt from "jsonwebtoken";
import TokenDataInterface from "../Interfaces/TokenData.Interface";

const tokenSecret: string = process.env.TOKEN_SECRET;

export const generateToken = (user: UserInterface & Document): string => {
    return jwt.sign({ email: user.email, id: user._id }, tokenSecret);
};

export const checkTokenSignature = (): boolean => {
    return true;
};
export const extractInfo = (token: string): TokenDataInterface => {
    const dataString: string = JSON.stringify(jwt.decode(token));
    return JSON.parse(dataString);
};
