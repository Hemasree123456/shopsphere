import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-body">
        <span className="tag">{product.category}</span>
        <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <p className="rating">Rating {product.rating} / 5</p>
        <div className="product-footer">
          <strong>${product.price.toFixed(2)}</strong>
          <button className="btn" onClick={() => addToCart(product)} disabled={product.stock < 1}>
            {product.stock < 1 ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
