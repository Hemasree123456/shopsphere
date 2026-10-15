import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, subtotal, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 5;

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p className="muted">Add something you like and it will show up here.</p>
        <Link to="/" className="btn">Browse products</Link>
      </div>
    );
  }

  return (
    <>
      <h1>Your cart</h1>
      <div className="cart-layout">
        <div>
          {items.map((i) => (
            <div className="cart-item" key={i.id}>
              <img src={i.image} alt={i.name} />
              <div className="cart-info">
                <Link to={`/product/${i.id}`}>{i.name}</Link>
                <span className="muted">${i.price.toFixed(2)} each</span>
              </div>
              <input
                type="number"
                min="1"
                value={i.qty}
                onChange={(e) => updateQty(i.id, Number(e.target.value))}
                className="qty"
                aria-label={`Quantity of ${i.name}`}
              />
              <strong>${(i.price * i.qty).toFixed(2)}</strong>
              <button className="btn btn-ghost" onClick={() => removeFromCart(i.id)}>Remove</button>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          <p className="line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p>
          <p className="line"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></p>
          <p className="line total"><span>Total</span><span>${(subtotal + shipping).toFixed(2)}</span></p>
          <button className="btn btn-block" onClick={() => navigate("/checkout")}>Go to checkout</button>
        </aside>
      </div>
    </>
  );
}
