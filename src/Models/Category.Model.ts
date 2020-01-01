import { Schema, Document, model } from "mongoose";
import { CategoryInterface } from "../Interfaces/Category.Interface";

const categorySchema = new Schema({
    name: {
        required: true,
        type: String,
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

const categoryModel = model<CategoryInterface & Document>("category", categorySchema);

categorySchema.set("toJSON", {
    transform: (doc: CategoryInterface & Document, ret: CategoryInterface & Document): void => {
        ret.id = doc._id;
        delete ret.__v;
        delete ret._id;
    },
});

export default categoryModel;
