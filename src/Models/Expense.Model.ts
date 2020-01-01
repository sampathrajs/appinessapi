import { Schema, Document, model } from "mongoose";
import { ExpenseInterface } from "../Interfaces/Expense.Interface";

const expenseSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    category: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "category",
    },
    amount: {
        required: true,
        type: Number,
    },
    expenseDate: {
        required: true,
        type: Number,
    },
    createdAt: {
        type: Number,
        default: Date.now(),
        required: false,
    },
    isDeleted: {
        required: false,
        type: Boolean,
        default: false,
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "user",
    },
});

const expenseModel = model<ExpenseInterface & Document>("Expense", expenseSchema);

export default expenseModel;
