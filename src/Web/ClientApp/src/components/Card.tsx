import { useBasket } from "../hooks";
import type { Product } from "../types";
import type { FC } from "react";

interface CardProps {
  product: Product;
}

const Card: FC<CardProps> = ({ product }) => {
  const { addToBasket } = useBasket();

  const handleAddToBasket = (): void => {
    addToBasket(product);
  };

  return (
    <div className="product-card card border-0 shadow-sm h-100" style={{ transition: "all 0.3s ease" }}>
      <div className="position-relative overflow-hidden" style={{ height: "200px", backgroundColor: "#f8f9fa" }}>
        <img
          className="w-100 h-100 object-fit-contain p-3"
          src={product.image}
          alt={product.title}
          style={{ transition: "transform 0.3s ease" }}
        />
        {product.rating && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-warning text-dark">
              ⭐ {product.rating.rate.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary w-fit mb-2 text-capitalize" style={{ width: "fit-content" }}>
          {product.category}
        </span>

        <h5 className="card-title fw-bold mb-2 text-truncate" title={product.title}>
          {product.title}
        </h5>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-4 fw-bold text-primary">{product.price} ₺</span>
            {product.rating && (
              <small className="text-muted">
                {product.rating.count} değerlendirme
              </small>
            )}
          </div>

          <button
            onClick={handleAddToBasket}
            className="btn btn-primary w-100 py-2 fw-semibold"
            type="button"
          >
            <i className="bi bi-cart-plus me-2"></i>
            Sepete Ekle
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          transform: translateY(0);
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.15) !important;
        }
        .product-card:hover img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Card;
