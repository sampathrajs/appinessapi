import { Schema } from "mongoose";
export type UserId = Schema.Types.ObjectId;
export interface UserInterface {
    id?: string;
    createdAt?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    budget: number;
}
