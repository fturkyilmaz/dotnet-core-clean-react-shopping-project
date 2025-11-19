import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { ProductContext, ProductContextType } from "../context/productContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const { setCategory } = useContext(ProductContext) as ProductContextType;
  const handleSetCategory = (category: string) => {
    setCategory(category);
    navigate("/");
  };

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">Kategoriler</h2>
      <ul className="">
        {/*Veriler gelmediyse yükleniyor göster */}
        {categories.length === 0 && <Loader />}
        <li onClick={() => handleSetCategory("all")} className="">
          <button className="btn btn-light mb-2">Hepsi</button>
        </li>
        {categories.map((cat) => (
          <li onClick={() => handleSetCategory(cat)} key={cat} className="">
            <button className="btn btn-light mb-2">{cat}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
