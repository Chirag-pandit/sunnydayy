import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cart from "./routes/cart.js";
import admin from "./routes/admin.js";
import users from "./routes/users.js";
import products from "./routes/products.js";
import categories from "./routes/categories.js";

const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin, credentials: true }));

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/cart", cart);
app.use("/api/admin", admin);
app.use("/api", users);
app.use("/api/products", products);
app.use("/api/categories", categories);

// db + start
// db + start
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sunnydayy";

// ensure URI ends with /sunnydayy if no db name provided
if (!/\/[A-Za-z0-9_\-]+(\?|$)/.test(MONGODB_URI)) {
  if (MONGODB_URI.endsWith("/")) MONGODB_URI += "sunnydayy";
  else MONGODB_URI += "/sunnydayy";
}

async function start() {
  try {
    await mongoose.connect(MONGODB_URI); // dbName is in the URI (sunnydayy)
    console.log("MongoDB connected ->", MONGODB_URI);
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (e) {
    console.error("Failed to start server", e);
    process.exit(1);
  }
}

start();
