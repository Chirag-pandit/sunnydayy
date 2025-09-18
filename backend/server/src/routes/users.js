import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Get user orders
router.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Create or update user profile
router.post("/users", async (req, res) => {
  try {
    const { firebase_uid, email, display_name, photo_url, date_of_birth, gender, bio } = req.body;
    
    // This is a simple implementation - in a real app, you'd have a User model
    // For now, we'll just return success since orders are the main focus
    res.json({ 
      message: "User profile created/updated successfully",
      user: { firebase_uid, email, display_name, photo_url, date_of_birth, gender, bio }
    });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).json({ message: "Failed to create/update user" });
  }
});

// Update user profile
router.put("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, email, phone, date_of_birth, gender, bio } = req.body;
    
    // This is a simple implementation - in a real app, you'd have a User model
    // For now, we'll just return success since orders are the main focus
    res.json({ 
      message: "User profile updated successfully",
      user: { userId, first_name, last_name, email, phone, date_of_birth, gender, bio }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Get user addresses (placeholder implementation)
router.get("/addresses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // This is a placeholder - in a real app, you'd fetch from a database
    res.json({ 
      addresses: [
        {
          id: "addr-1",
          type: "home",
          name: "Home Address",
          street: "123 Fighter Street, Apt 4B",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
          isDefault: true,
        }
      ]
    });
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});

export default router;
