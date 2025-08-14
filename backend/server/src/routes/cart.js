import express from "express";
import { CartItem } from "../models/CartItem.js";

const router = express.Router();

// helper to get userId (header, query, or default "guest")
const getUserId = (req) =>
  (req.header("x-user-id") || req.query.userId || "guest");

// GET /api/cart
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const items = await CartItem.find({ userId }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart  -> add or increase qty for existing config
router.post("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, name, image, price, size = "", color = "", quantity = 1 } = req.body;

    if (!productId || !name || typeof price !== "number") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const filter = { userId, productId, size, color };
    const update = {
      $setOnInsert: { userId, productId, name, image, price, size, color },
      $inc: { quantity: quantity }
    };

    const opts = { new: true, upsert: true };
    const item = await CartItem.findOneAndUpdate(filter, update, opts);
    res.status(201).json({ item });
  } catch (e) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PATCH /api/cart/:id  -> update quantity / options
router.patch("/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const update = {};

    if (typeof req.body.quantity === "number") update.quantity = req.body.quantity;
    if (typeof req.body.size === "string") update.size = req.body.size;
    if (typeof req.body.color === "string") update.color = req.body.color;

    const item = await CartItem.findOneAndUpdate(
      { _id: id, userId },
      { $set: update },
      { new: true }
    );

    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE /api/cart/:id
router.delete("/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const result = await CartItem.deleteOne({ _id: id, userId });
    if (!result.deletedCount) return res.status(404).json({ error: "Item not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// DELETE /api/cart (clear)
router.delete("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    await CartItem.deleteMany({ userId });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
