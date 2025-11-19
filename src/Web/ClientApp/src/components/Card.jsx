import { useContext } from "react";
import { BasketContext } from "../context/basketContext";

const Card = ({ product }) => {
  const { addToBasket } = useContext(BasketContext);

  return (
    <div className="card py-2" style={{ width: "250px" }}>
      <div className="d-flex justify-content-center">
        <img
          className="object-fit-contain"
          height={120}
          src={product?.image}
          alt={product?.name}
        />
      </div>

      <div className="card-body d-flex flex-column gap-1">
        <h4 className="text-truncate">{product?.title}</h4>
        <p>{product?.price}</p>
        <p>{product?.category}</p>
        <button onClick={() => addToBasket(product)}>Sepete Ekle</button>
      </div>
    </div>
  );
};

export default Card;
