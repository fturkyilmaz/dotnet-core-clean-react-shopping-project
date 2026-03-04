import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronLeft,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/presentation/features/product/hooks/useProducts";
import { useBasket } from "@/hooks";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToBasket } = useBasket();
  const [quantity, setQuantity] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImage, _setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, isError } = useProduct(Number(id));

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToBasket(product);
      }
      toast.success(t("addedToCart"));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/carts");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info(t("linkCopied"));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">{t("productNotFound")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("productNotFoundDesc")}
          </p>
          <Button asChild>
            <Link to="/">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.price > 100 ? 15 : 0;
  const discountedPrice =
    discountPercentage > 0
      ? product.price * (1 - discountPercentage / 100)
      : product.price;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <span>/</span>
            <Link to="/category" className="hover:text-primary transition-colors">
              {t("categories")}
            </Link>
            <span>/</span>
            <span className="text-foreground capitalize">{product.category}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Button
          variant="ghost"
          className="mb-6 -ml-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <motion.img
                key={selectedImage}
                src={product.image}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain p-8"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-white">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <Badge variant="outline" className="mb-3 capitalize">
                {product.category}
              </Badge>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating?.rate || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating?.rate} ({product.rating?.count} {t("reviews")})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {discountedPrice.toFixed(2)} ₺
              </span>
              {discountPercentage > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.price.toFixed(2)} ₺
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 py-4 border-y">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>{t("freeShipping")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>{t("securePayment")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>{t("easyReturns")}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">{t("quantity")}:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                {t("addToCart")}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 gap-2"
                onClick={handleBuyNow}
              >
                {t("buyNow")}
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.info(isWishlisted ? t("removedFromWishlist") : t("addedToWishlist"));
                }}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-destructive text-destructive" : ""}`}
                />
                {t(isWishlisted ? "removeFromWishlist" : "addToWishlist")}
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-green-600 font-medium">{t("inStock")}</span>
              <span className="text-muted-foreground">- {t("shipsWithin24h")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
