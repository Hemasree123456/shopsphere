import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/orders").then(setOrders).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="muted">Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="empty">
        <h2>No orders yet</h2>
        <Link to="/" className="btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <>
      <h1>My orders</h1>
      {orders.map((o) => (
        <div className="order" key={o.id}>
          <div className="order-head">
            <strong>Order {o.id}</strong>
            <span className="tag">{o.status}</span>
            <span className="muted">{new Date(o.createdAt).toLocaleDateString()}</span>
            <strong>${o.total.toFixed(2)}</strong>
          </div>
          <ul>
            {o.items.map((i) => (
              <li key={i.productId}>{i.name} x {i.qty} - ${(i.price * i.qty).toFixed(2)}</li>
            ))}
          </ul>
          <p className="muted">Ship to: {o.shipping.name}, {o.shipping.address}, {o.shipping.city} {o.shipping.zip}</p>
        </div>
      ))}
    </>
  );
}
