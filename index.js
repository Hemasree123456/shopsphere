import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Fallback for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () => console.log(`ShopSphere API running on port ${PORT}`));
