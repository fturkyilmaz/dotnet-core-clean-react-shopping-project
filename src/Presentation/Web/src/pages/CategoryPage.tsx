import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useProducts } from "@hooks";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

interface CategoryIcons {
  [key: string]: string;
}

interface CategoryColors {
  [key: string]: string;
}

const categoryIcons: CategoryIcons = {
  "all": "🏪",
  "electronics": "💻",
  "jewelery": "💎",
  "men's clothing": "👔",
  "women's clothing": "👗"
};

const categoryColors: CategoryColors = {
  "all": "primary",
  "electronics": "info",
  "jewelery": "warning",
  "men's clothing": "secondary",
  "women's clothing": "danger"
};

import { useSearchParams } from "react-router-dom";

const CategoryPage: FC = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  const handleSetCategory = useCallback((cat: string): void => {
    navigate(`/?category=${encodeURIComponent(cat)}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="container my-5">
        <Loader />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="container my-5">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Kategoriler</h1>
        <p className="text-muted fs-5">İlgilendiğiniz kategoriyi seçin ve alışverişe başlayın</p>
      </div>

      <div className="row g-4">
        {/* All Categories Card */}
        <div className="col-md-6 col-lg-4">
          <div
            onClick={() => handleSetCategory("all")}
            className={`category-card card border-0 shadow-sm h-100 ${category === "all" ? "active" : ""}`}
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleSetCategory("all")}
          >
            <div className="card-body text-center p-4">
              <div className="category-icon fs-1 mb-3">{categoryIcons["all"]}</div>
              <h3 className="card-title fw-bold text-capitalize mb-2">Tüm Ürünler</h3>
              <p className="text-muted small mb-0">Tüm kategorilerdeki ürünleri görüntüleyin</p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        {categories.map((cat) => (
          <div className="col-md-6 col-lg-4" key={cat}>
            <div
              onClick={() => handleSetCategory(cat)}
              className={`category-card card border-0 shadow-sm h-100 ${category === cat ? "active" : ""}`}
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && handleSetCategory(cat)}
            >
              <div className="card-body text-center p-4">
                <div className="category-icon fs-1 mb-3">
                  {categoryIcons[cat] || "📦"}
                </div>
                <h3 className="card-title fw-bold text-capitalize mb-2">{cat}</h3>
                <span className={`badge bg-${categoryColors[cat] || "primary"} px-3 py-2`}>
                  Kategoriye Git
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .category-card {
          transform: translateY(0);
          border: 2px solid transparent !important;
        }
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        }
        .category-card.active {
          border-color: var(--bs-primary) !important;
          box-shadow: 0 8px 24px rgba(13,110,253,0.3) !important;
        }
        .category-icon {
          transition: transform 0.3s ease;
        }
        .category-card:hover .category-icon {
          transform: scale(1.2) rotate(5deg);
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
