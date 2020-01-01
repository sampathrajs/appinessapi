import { UserInterface } from "./User.Interface";
import { Schema } from "mongoose";
//TODO: add all values like _id
export interface CategoryInterface {
    name: string;
    id?: string;
    isDeleted?: boolean;
    user: Schema.Types.ObjectId | UserInterface;
}
