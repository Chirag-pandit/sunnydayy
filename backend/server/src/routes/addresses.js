import express from "express";
import Address from "../models/Address.js";
import Order from "../models/Order.js";

const router = express.Router();

function getUserId(req) {
  return req.header("x-user-id") || req.query.userId || "guest";
}

// List addresses for current user
router.get("/addresses", async (req, res) => {
  try {
    const userId = getUserId(req);
    let addresses = await Address.find({ userId }).sort({ isDefault: -1, updatedAt: -1 });

    // If no saved addresses, try to bootstrap from the user's most recent order
    if (!addresses.length) {
      const lastOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
      if (lastOrder) {
        const doc = await Address.create({
          userId,
          type: "home",
          name: lastOrder.fullName,
          phone: lastOrder.phone,
          email: lastOrder.email,
          street: lastOrder.addressLine1,
          city: lastOrder.city,
          state: lastOrder.state,
          zipCode: lastOrder.pincode,
          country: "India",
          isDefault: true,
        });
        addresses = [doc];
      }
    }

    res.json({ addresses });
  } catch (err) {
    console.error("Get addresses failed:", err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});

// Create new address for current user
router.post("/addresses", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { type = "home", name, phone, email, street, city, state, zipCode, country = "India", isDefault = false } = req.body || {};

    if (!name || !phone || !street || !city || !state || !zipCode) {
      return res.status(400).json({ message: "Missing required address fields" });
    }

    const count = await Address.countDocuments({ userId });

    // If this is the first address or isDefault is true, ensure it's the only default
    if (count === 0 || isDefault) {
      await Address.updateMany({ userId, isDefault: true }, { $set: { isDefault: false } });
    }

    const doc = await Address.create({
      userId,
      type,
      name,
      phone,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: count === 0 ? true : !!isDefault,
    });

    res.json({ success: true, address: doc });
  } catch (err) {
    console.error("Create address failed:", err);
    res.status(500).json({ message: "Failed to create address" });
  }
});

// Update address
router.patch("/addresses/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const update = { ...req.body };
    delete update._id;
    delete update.userId;

    const doc = await Address.findOneAndUpdate({ _id: id, userId }, { $set: update }, { new: true });
    if (!doc) return res.status(404).json({ message: "Address not found" });
    res.json({ success: true, address: doc });
  } catch (err) {
    console.error("Update address failed:", err);
    res.status(500).json({ message: "Failed to update address" });
  }
});

// Set default address
router.patch("/addresses/:id/default", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const target = await Address.findOne({ _id: id, userId });
    if (!target) return res.status(404).json({ message: "Address not found" });

    await Address.updateMany({ userId, isDefault: true }, { $set: { isDefault: false } });
    target.isDefault = true;
    await target.save();

    res.json({ success: true, address: target });
  } catch (err) {
    console.error("Set default address failed:", err);
    res.status(500).json({ message: "Failed to set default address" });
  }
});

// Delete address
router.delete("/addresses/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const deleted = await Address.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: "Address not found" });

    // If default was deleted, set another as default (if exists)
    if (deleted.isDefault) {
      const next = await Address.findOne({ userId }).sort({ updatedAt: -1 });
      if (next) {
        next.isDefault = true;
        await next.save();
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete address failed:", err);
    res.status(500).json({ message: "Failed to delete address" });
  }
});

export default router;
