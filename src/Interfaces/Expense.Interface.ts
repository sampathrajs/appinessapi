import { UserInterface } from "./User.Interface";
import { CategoryInterface } from "./Category.Interface";
import { Schema } from "mongoose";
//TODO: add all values like _id
export interface ExpenseInterface {
    category: Schema.Types.ObjectId | CategoryInterface;
    name: string;
    amount: number;
    expenseDate: number;
    //TODO: change to date type for above
    createdAt: number;
    _id: string;
    isDeleted: boolean;
    user: Schema.Types.ObjectId | UserInterface;
}
