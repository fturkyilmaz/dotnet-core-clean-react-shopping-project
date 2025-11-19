import axios from "axios";
import { createContext, useEffect, useState } from "react";
/*


   * Context API:
    Uygulamada birden çok bileşenin ihtiyacı olan verileri bileşenlerden bağımsız bir şekilde konumlanan merkezlerde yönetmeye yarar.

    *Context yapısı içerisinde verilen state'ini ve verileri değiştirmeye yarayan fonksiyonlar tutulabilir.

    *Context, tuttuğumuz değişkenleri bileşenlere doğrudan aktarım yapabilen MERKEZİ AKTARIM state yönetim aracıdır.
*/

// Context yapısının temelini bu şekilde oluştururuz :
export const ProductContext = createContext();

//Sağlayıcı ve onun tuttuğu verileri tanımlama bu şekilde oluştururuz:
export function ProductProvider({ children }) {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setProducts(null);
    const url =
      category === "all"
        ? "https://fakestoreapi.com/products"
        : `https://fakestoreapi.com/products/category/${category}`;

    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [category]);
  //Context yapısında tuttuğumuz verileri bileşenlere bu şekilde sağlarız:

  // Value olarak eklenen veriler projedeki bütün bileşenler tarafından erişilebilir duruma gelir.

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("category", category);
  }, [category]);

  return (
    <ProductContext.Provider value={{ products, category, setCategory }}>
      {children}
    </ProductContext.Provider>
  );
}
