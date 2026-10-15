import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/products/${id}`).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="muted">Loading...</p>;

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      <Link to="/" className="back">Back to shop</Link>
      <div className="detail">
        <img src={product.image} alt={product.name} />
        <div>
          <span className="tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="rating">Rating {product.rating} / 5</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <p className="muted">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>

          <div className="row">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
              }
              className="qty"
              aria-label="Quantity"
            />
            <button className="btn" onClick={handleAdd} disabled={product.stock < 1}>
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
