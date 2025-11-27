import { BasketItem as BasketItemType, Product } from "../types";

interface BasketItemProps {
  item: BasketItemType;
  addToBasket: (product: Product) => void;
  removeFromBasket: (id: number) => void;
}

const BasketItem = ({ item, addToBasket, removeFromBasket }: BasketItemProps) => {
  return (
    <div className="row align-items-center g-3">
      <div className="col-md-2 text-center">
        <div className="bg-white p-2 rounded border border-light" style={{ height: "100px", width: "100px", margin: "0 auto" }}>
          <img
            className="w-100 h-100 object-fit-contain"
            src={item?.image}
            alt={item?.title}
          />
        </div>
      </div>

      <div className="col-md-5">
        <h5 className="mb-1 text-muted fw-semibold text-truncate" title={item?.title}>
          {item?.title}
        </h5>
        <p className="text-muted small mb-0 text-truncate">
          {item?.category}
        </p>
      </div>

      <div className="col-md-3">
        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 bg-light rounded-pill p-1" style={{ width: "fit-content" }}>
          <button
            onClick={() => removeFromBasket(item?.id)}
            className="btn btn-sm btn-white rounded-circle shadow-sm text-danger fw-bold"
            style={{ width: "32px", height: "32px" }}
          >
            -
          </button>
          <span className="fw-bold px-2">{item?.amount}</span>
          <button
            onClick={() => addToBasket(item)}
            className="btn btn-sm btn-white rounded-circle shadow-sm text-success fw-bold"
            style={{ width: "32px", height: "32px" }}
          >
            +
          </button>
        </div>
      </div>

      <div className="col-md-2 text-end">
        <span className="fs-5 fw-bold text-primary">
          {(item.price * item.amount).toFixed(2)} ₺
        </span>
        <div className="small text-muted">
          {item.price} ₺ / adet
        </div>
      </div>
    </div>
  );
};

export default BasketItem;
