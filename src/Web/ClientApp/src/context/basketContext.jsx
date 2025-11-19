import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

/* 1-) Context Yapısını Tanımla */
export const BasketContext = createContext();

/*2-) Context'de tutulan verileri uygulamaya aktaracak bir sağlayıcı bileşeni tanımla */

export function BasketProvider({ children }) {
  const [basket, setBasket] = useState([]);
  /*
  Sepete Ürün Ekleme
  */
  const addToBasket = (newProduct) => {
    /*1-) Bu üründen sepette var mı kontrol et */
    const found = basket.find((i) => i.id === newProduct.id);

    if (found) {
      /*2-) Bu üründen sepette varsa miktarı arttır */
      /* a) bulunan ürünün miktarını arttır */
      const updated = { ...found, amount: found.amount + 1 };

      /* b) sepet dizisindeki eskş ürünün yerine güncel halini koy */
      const newBasket = basket.map((item) =>
        item.id === updated.id ? updated : item
      );

      /* c) state'i güncelle */
      setBasket(newBasket);

      toast.info(`Ürün miktarı arttırıldı (${updated.amount})`);
    } else {
      /*3-) Bu üründen sepette yoksa ürünü sepete ekle */

      const newBaskets = [...basket, { ...newProduct, amount: 1 }];

      setBasket(newBaskets);

      toast.success("Ürün sepete eklendi");
    }
  };

  /* ürünü sepetten kaldır */

  const removeFromBasket = (delete_id) => {
    const found = basket.find((i) => i.id === delete_id);

    if (found.amount > 1) {
      const updated = { ...found, amount: found.amount - 1 };

      const newBasket = basket.map((i) => (i.id === updated.id ? updated : i));

      setBasket(newBasket);

      toast.info(`Ürün miktarı azaltıldı (${updated.amount})`);
    } else {
      const filtred = basket.filter((i) => i.id !== delete_id);

      setBasket(filtred);

      toast.error(`Ürün sepetten kaldırıldı`);
    }
  };

  // Burada satın alma işlemi ile ilgili işlemler yapılacak
  // Örneğin:
  // - Kullanıcıyı ödeme sayfasına yönlendirme
  // - Sipariş veritabanına kaydetme
  // - Sepetin boşaltılması
  // - Kullanıcıya bildirim gösterme

  // Basit bir örnek olarak, bir alert ile başarı mesajı gösterelim:
  const purchaseBasket = () => {
    setBasket([]);
    toast.info(`Satın alma gerçekleşti iyi günler dileriz.`);
    alert("Satın alma işlemi başarılı!");
  };

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(basket));
  }, [basket]);

  return (
    <BasketContext.Provider
      value={{ basket, addToBasket, removeFromBasket, purchaseBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
}
