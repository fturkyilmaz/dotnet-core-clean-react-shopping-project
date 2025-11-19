import type { FC } from "react";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { useProduct } from "../hooks";

const HomePage: FC = () => {
  const { products, category } = useProduct();

  const displayCategory = category === "all" ? "Tüm Ürünler" : category;
  const productCount = products?.length ?? 0;

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">{displayCategory}</h1>
        <p className="text-muted fs-5">
          {products ? `${productCount} ürün bulundu` : "Ürünler yükleniyor..."}
        </p>
      </div>

      {/* Products Grid */}
      {!products ? (
        <div className="d-flex justify-content-center my-5">
          <Loader />
        </div>
      ) : productCount === 0 ? (
        <div className="text-center my-5">
          <div className="p-5 bg-light rounded-3 shadow-sm">
            <h2 className="display-6 text-secondary mb-3">Ürün Bulunamadı</h2>
            <p className="text-muted">Bu kategoride şu anda ürün bulunmamaktadır.</p>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {products.map((product) => (
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
