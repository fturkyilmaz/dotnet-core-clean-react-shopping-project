import type { FC } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "@/presentation/shared/components/Loader";
import Card from "@/presentation/features/product/components/ProductCard";
import { useProducts } from "../hooks/useProducts";

const HomePage: FC = () => {
  const { t } = useTranslation();
  const { data: products, isLoading, isError } = useProducts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  const filteredProducts = category === "all"
    ? products
    : products?.filter(p => p.category.toLowerCase() === category.toLowerCase());

  const displayCategory = category === "all" ? t("products") : category;
  const productCount = filteredProducts?.length ?? 0;

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-capitalize">{displayCategory}</h1>
        <p className="text-muted fs-5" aria-live="polite">
          {isLoading
            ? t("loading")
            : t("productsFound", { count: productCount })}
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="d-flex justify-content-center my-5" role="status" aria-live="polite">
          <Loader />
        </div>
      ) : isError ? (
        <div className="text-center my-5" role="alert">
          <div className="p-5 bg-light rounded-3 shadow-sm">
            <h2 className="display-6 text-secondary mb-3">{t("error")}</h2>
            <p className="text-muted">{t("loginFailed")}</p>
          </div>
        </div>
      ) : productCount === 0 ? (
        <div className="text-center my-5">
          <div className="p-5 bg-light rounded-3 shadow-sm">
            <h2 className="display-6 text-secondary mb-3">{t("productNotFound")}</h2>
            <p className="text-muted">{t("cartEmptySubtitle")}</p>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredProducts?.map((product) => (
            <div className="col" key={product.id}>
              <Card product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
