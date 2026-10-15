import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Sports"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Re-fetch whenever a filter changes (small delay while typing)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ search, category, sort });
        setProducts(await api(`/products?${params}`));
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "Cannot reach the server. Is the backend running?"
            : err.message
        );
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  return (
    <>
      <section className="hero">
        <h1>Everyday things, well made.</h1>
        <p>Electronics, fashion, home and sports essentials. Free shipping on orders over $100.</p>
      </section>

      <section className="filters">
        <input
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="">Sort: Featured</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </section>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading products...</p>}
      {!loading && !error && products.length === 0 && (
        <p className="muted">No products match your search. Try a different word or category.</p>
      )}

      <section className="grid">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </section>
    </>
  );
}
