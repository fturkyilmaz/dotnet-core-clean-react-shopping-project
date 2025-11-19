import Loader from "../components/Loader";
import Card from "../components/Card";
/* 
*useContext hooku kullanarak bir CONTEXT yapısına abone olmayı sağlayabiliriz.

*/

import { useContext } from "react";

/*
Abone olmak istediğimiz CONTEXT'i çağırmak için bu şekilde import etmeliyiz.
*/
import { ProductContext, ProductContextType } from "../context/productContext";

const HomePage = () => {
  /*
    * Context yapısında tutulan bir veriye projedeki bileşen içerisinde erişmek istiyorsak bileşenden ilgili context'e abone olmak gerekiyor.
    
    */

  const { products, category } = useContext(ProductContext) as ProductContextType;

  return (
    <div className="container">
      <h2 className="my-4">{category && category}</h2>

      <div className="d-flex flex-wrap justify-content-center justify-content-md-between gap-3 gap-md-4 my-5">
        {/*Veriler gelmediyse yükleniyor göster */}
        {!products && <Loader />}

        {/*Veriler geldiyse herbiri için kart basıp göster */}

        {products?.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
