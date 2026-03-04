import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  Truck,
  Shield,
  Gift,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/presentation/features/cart/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";

const EmptyCart = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-8"
      >
        <ShoppingCart className="h-16 w-16 text-primary" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-4">{t("cartEmptyTitle")}</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {t("cartEmptySubtitle")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild>
          <Link to="/">{t("startShopping")}</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/category">{t("browseCategories")}</Link>
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
        {[
          { icon: Truck, title: "freeShipping", desc: "freeShippingDesc" },
          { icon: Shield, title: "securePayment", desc: "securePaymentDesc" },
          { icon: Gift, title: "giftWrapping", desc: "giftWrappingDesc" },
        ].map((feature) => (
          <div key={feature.title} className="flex flex-col items-center">
            <feature.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-sm">{t(feature.title)}</h3>
            <p className="text-xs text-muted-foreground">{t(feature.desc)}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 p-4 bg-card rounded-xl border"
    >
      {/* Image */}
      <Link to={`/product/${item.id}`} className="shrink-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain p-2"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.id}`}>
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-lg font-bold text-primary mt-2">
          {item.price.toFixed(2)} ₺
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                if (item.quantity > 1) {
                  onUpdateQuantity(item.id, item.quantity - 1);
                } else {
                  onRemove(item.id);
                }
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("remove")}
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="text-right hidden sm:block">
        <p className="font-bold text-lg">
          {(item.price * item.quantity).toFixed(2)} ₺
        </p>
      </div>
    </motion.div>
  );
};

const CartsPage = () => {
  const { t } = useTranslation();
  const {
    cartItems,
    isLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const shippingCost = totalPrice > 500 ? 0 : 29.99;
  const grandTotal = totalPrice + shippingCost;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyCart />
      </div>
    );
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      updateCartItem({
        id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity,
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("cart")}</h1>
            <p className="text-muted-foreground">
              {totalItems} {t("itemsInCart")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => clearCart()}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("clearCart")}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </AnimatePresence>

            {/* Continue Shopping */}
            <Button variant="outline" className="mt-6" asChild>
              <Link to="/">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                {t("continueShopping")}
              </Link>
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h2 className="text-xl font-bold mb-6">{t("orderSummary")}</h2>

              {/* Summary Items */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("subtotal")} ({totalItems} {t("items")})
                  </span>
                  <span className="font-medium">{totalPrice.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">{t("free")}</span>
                    ) : (
                      `${shippingCost.toFixed(2)} ₺`
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t("freeShippingOver")} 500 ₺
                  </p>
                )}
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2 mb-6">
                <Input placeholder={t("couponCode")} className="flex-1" />
                <Button variant="outline">{t("apply")}</Button>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t("total")}</span>
                  <span className="text-2xl font-bold text-primary">
                    {grandTotal.toFixed(2)} ₺
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button size="lg" className="w-full gap-2">
                <ShoppingBag className="h-5 w-5" />
                {t("checkout")}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                {[
                  { icon: Truck, label: "fastShipping" },
                  { icon: Shield, label: "securePayment" },
                  { icon: Package, label: "easyReturns" },
                ].map((badge) => (
                  <div key={badge.label} className="text-center">
                    <badge.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{t(badge.label)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartsPage;
