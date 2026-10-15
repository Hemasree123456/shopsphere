import { Router } from "express";
import { products } from "../data/products.js";

const router = Router();

// GET /api/products?search=&category=&sort=price_asc|price_desc|rating
router.get("/", (req, res) => {
  const { search = "", category = "", sort = "" } = req.query;
  let list = [...products];

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (category && category !== "All") {
    list = list.filter((p) => p.category === category);
  }
  if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

  res.json(list);
});

router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;
