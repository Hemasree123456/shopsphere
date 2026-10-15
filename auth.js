import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { readDB, writeDB } from "../db.js";
import { JWT_SECRET, requireAuth } from "../middleware/auth.js";

const router = Router();

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const db = readDB();
  const exists = db.users.find((u) => u.email === email.toLowerCase().trim());
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDB(db);

  res.status(201).json({
    token: makeToken(user),
    user: { id: user.id, name: user.name, email: user.email },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email === String(email || "").toLowerCase().trim());

  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    token: makeToken(user),
    user: { id: user.id, name: user.name, email: user.email },
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

export default router;
