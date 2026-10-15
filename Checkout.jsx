import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", address: "", city: "", zip: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const shipping = subtotal >= 100 ? 0 : 5;

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function placeOrder(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api("/orders", {
        method: "POST",
        body: {
          items: items.map((i) => ({ productId: i.id, qty: i.qty })),
          shipping: form,
        },
      });
      clearCart();
      setOrder(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (order) {
    return (
      <div className="empty">
        <h2>Order {order.id} confirmed</h2>
        <p>Thank you, {order.shipping.name}. Order total: <strong>${order.total.toFixed(2)}</strong></p>
        <p className="muted">This is a demo store, so no real payment is taken.</p>
        <button className="btn" onClick={() => navigate("/orders")}>View my orders</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Nothing to check out</h2>
        <Link to="/" className="btn">Browse products</Link>
      </div>
    );
  }

  return (
    <>
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form className="form" onSubmit={placeOrder}>
          <h2>Shipping details</h2>
          <label>Full name
            <input name="name" value={form.name} onChange={update} required />
          </label>
          <label>Address
            <input name="address" value={form.address} onChange={update} required />
          </label>
          <label>City
            <input name="city" value={form.city} onChange={update} required />
          </label>
          <label>Postal code
            <input name="zip" value={form.zip} onChange={update} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn" disabled={loading}>
            {loading ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="summary">
          <h2>Your items</h2>
          {items.map((i) => (
            <p className="line" key={i.id}>
              <span>{i.name} x {i.qty}</span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </p>
          ))}
          <p className="line"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></p>
          <p className="line total"><span>Total</span><span>${(subtotal + shipping).toFixed(2)}</span></p>
        </aside>
      </div>
    </>
  );
}
