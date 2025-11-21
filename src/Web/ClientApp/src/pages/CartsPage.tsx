import type { FC } from "react";
import { useBasket } from "../hooks";
import BasketItem from "../components/BasketItem";
import { Link } from "react-router-dom";

const CartsPage: FC = () => {
  const { basket, addToBasket, removeFromBasket, purchaseBasket, totalItems, totalPrice } = useBasket();

  const shippingCost = totalPrice > 0 ? 29.99 : 0;
  const grandTotal = totalPrice + shippingCost;

  if (basket.length === 0) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="text-center p-5">
              {/* Animated Shopping Cart Icon */}
              <div className="mb-4" style={{ fontSize: "120px", animation: "float 3s ease-in-out infinite" }}>
                🛒
              </div>

              <h1 className="display-5 fw-bold mb-3">Sepetiniz Boş</h1>

              <p className="lead text-muted mb-4">
                Henüz sepetinize ürün eklemediniz. Harika ürünlerimizi keşfetmek için alışverişe başlayın!
              </p>

              <div className="d-grid gap-3">
                <Link
                  to="/"
                  className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <i className="bi bi-shop me-2"></i>
                  Alışverişe Başla
                </Link>

                <Link
                  to="/category"
                  className="btn btn-outline-secondary btn-lg px-5 py-2 rounded-pill"
                >
                  <i className="bi bi-grid-3x3 me-2"></i>
                  Kategorilere Göz At
                </Link>
              </div>

              {/* Decorative Elements */}
              <div className="mt-5 pt-4 border-top">
                <div className="row g-4 text-start">
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <div className="fs-3 me-3">🚚</div>
                      <div>
                        <h6 className="fw-bold mb-1">Ücretsiz Kargo</h6>
                        <small className="text-muted">500₺ üzeri alışverişlerde</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <div className="fs-3 me-3">💳</div>
                      <div>
                        <h6 className="fw-bold mb-1">Güvenli Ödeme</h6>
                        <small className="text-muted">256-bit SSL koruması</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <div className="fs-3 me-3">🎁</div>
                      <div>
                        <h6 className="fw-bold mb-1">Hediye Paketleme</h6>
                        <small className="text-muted">Ücretsiz hediye paketi</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(13, 110, 253, 0.3) !important;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Alışveriş Sepetim</h2>
      <div className="row g-4">
        {/* Cart Items Section */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-4">
                {basket.map((item) => (
                  <div key={item.id}>
                    <BasketItem
                      item={item}
                      addToBasket={addToBasket}
                      removeFromBasket={removeFromBasket}
                    />
                    <hr className="my-4 text-muted opacity-25" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm position-sticky" style={{ top: "100px" }}>
            <div className="card-body p-4">
              <h4 className="card-title fw-bold mb-4">Sipariş Özeti</h4>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Toplam Ürün</span>
                <span className="fw-semibold">{totalItems} adet</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Ara Toplam</span>
                <span className="fw-semibold">{totalPrice.toFixed(2)} ₺</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Kargo</span>
                <span className={shippingCost === 0 ? "text-success fw-semibold" : "fw-semibold"}>
                  {shippingCost === 0 ? "Ücretsiz" : `${shippingCost.toFixed(2)} ₺`}
                </span>
              </div>

              <hr className="my-4" />

              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="fs-5 fw-bold">Toplam</span>
                <span className="fs-4 fw-bold text-primary">{grandTotal.toFixed(2)} ₺</span>
              </div>

              <button
                className="btn btn-primary w-100 py-3 fs-5 fw-semibold rounded-3 shadow-sm"
                onClick={purchaseBasket}
              >
                Siparişi Tamamla
              </button>

              <Link to="/" className="btn btn-outline-secondary w-100 mt-3 py-2 border-0">
                <i className="bi bi-arrow-left me-2"></i>
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartsPage;
