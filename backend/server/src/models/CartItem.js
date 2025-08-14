import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // simple string user; "guest" by default
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

CartItemSchema.index({ userId: 1, productId: 1, size: 1, color: 1 }, { unique: true });

export const CartItem = mongoose.model("CartItem", CartItemSchema);
