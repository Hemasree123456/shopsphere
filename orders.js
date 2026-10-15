import { Router } from "express";
import crypto from "crypto";
import { readDB, writeDB } from "../db.js";
import { products } from "../data/products.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// POST /api/orders  body: { items: [{ productId, qty }], shipping: { name, address, city, zip } }
router.post("/", (req, res) => {
  const { items, shipping } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  if (!shipping?.name || !shipping?.address || !shipping?.city || !shipping?.zip) {
    return res.status(400).json({ error: "Complete shipping details are required" });
  }

  // Build the order from SERVER prices, never trust prices sent by the client
  const orderItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === Number(item.productId));
    const qty = Number(item.qty);
    if (!product || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: "Invalid item in cart" });
    }
    if (qty > product.stock) {
      return res.status(400).json({ error: `Only ${product.stock} of "${product.name}" in stock` });
    }
    orderItems.push({ productId: product.id, name: product.name, price: product.price, qty });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingFee = subtotal >= 100 ? 0 : 5;
  const total = Math.round((subtotal + shippingFee) * 100) / 100;

  const order = {
    id: crypto.randomUUID().slice(0, 8).toUpperCase(),
    userId: req.user.id,
    items: orderItems,
    shipping: {
      name: shipping.name,
      address: shipping.address,
      city: shipping.city,
      zip: shipping.zip,
    },
    subtotal: Math.round(subtotal * 100) / 100,
    shippingFee,
    total,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  const db = readDB();
  db.orders.push(order);
  writeDB(db);

  // Reduce stock in memory (resets on restart; a real DB would persist this)
  orderItems.forEach((i) => {
    const p = products.find((x) => x.id === i.productId);
    p.stock -= i.qty;
  });

  res.status(201).json(order);
});

// GET /api/orders -> orders of the logged-in user (newest first)
router.get("/", (req, res) => {
  const db = readDB();
  const mine = db.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(mine);
});

export default router;
