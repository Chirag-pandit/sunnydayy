import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Create/place an order (COD or pre-payment creation)
router.post("/orders/place", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      addressLine1,
      addressLine2 = "",
      city,
      state,
      pincode,
      paymentMethod, // 'online' | 'cod'
      amount,
      currency = "INR",
      items = [],
      razorpayOrderId,
      paymentId,
      paymentSignature,
    } = req.body || {};

    // Basic validation
    const required = { fullName, email, phone, addressLine1, city, state, pincode, paymentMethod, amount };
    for (const [k, v] of Object.entries(required)) {
      if (v === undefined || v === null || v === "") {
        return res.status(400).json({ message: `Missing required field: ${k}` });
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Map items to schema shape
    const mappedItems = items.map((it) => ({
      productId: String(it.id || it.productId || ""),
      name: it.name,
      price: Number(it.price),
      quantity: Number(it.quantity || 1),
      image: it.image || "",
    }));

    const userId = req.header("x-user-id") || req.query.userId || "guest";

    const order = new Order({
      userId,
      amount: Number(amount),
      currency,
      status: paymentMethod === "cod" ? "pending" : "created",
      paymentMethod,
      paymentId,
      razorpayOrderId,
      paymentSignature,
      fullName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      items: mappedItems,
    });

    const saved = await order.save();
    return res.json({ success: true, orderId: saved._id, status: saved.status });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Failed to place order" });
  }
});

// Verify/update order after online payment (simple version)
router.post("/orders/verify", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body || {};
    if (!orderId) return res.status(400).json({ message: "orderId is required" });

    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "paid",
        paymentId: paymentId || undefined,
        paymentSignature: signature || undefined,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });
    return res.json({ success: true, orderId: updated._id, status: updated.status });
  } catch (error) {
    console.error("Error verifying order:", error);
    return res.status(500).json({ message: "Failed to verify order" });
  }
});

export default router;
