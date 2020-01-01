import { Schema, Document, model } from "mongoose";
import { UserInterface } from "../Interfaces/User.Interface";

const userSchema = new Schema({
    createdAt: {
        type: Number,
        default: Date.now(),
        required: false,
    },
    firstName: {
        type: String,
        required: true,
        unique: false,
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    budget: {
        type: Number,
        required: false,
        default: 0,
    },
});

const userModel = model<UserInterface & Document>("user", userSchema);

userSchema.set("toJSON", {
    transform: (doc: UserInterface & Document, ret: UserInterface & Document): void => {
        ret.id = doc._id;
        delete ret.__v;
        delete ret._id;
        delete ret.password;
    },
});
export default userModel;
