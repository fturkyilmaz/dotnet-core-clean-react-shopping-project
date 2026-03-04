import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useBasket } from "@/hooks";
import type { Product } from "@/types/product";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();
  const { addToBasket } = useBasket();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToBasket(product);
    toast.success(t("addedToCart"));
  };

  const discountPercentage = product.price > 100 ? 15 : 0;
  const discountedPrice = discountPercentage > 0
    ? product.price * (1 - discountPercentage / 100)
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link to={`/product/${product.id}`}>
            <motion.img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              whileHover={{ scale: 1.1 }}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-xs font-bold">
                -{discountPercentage}%
              </Badge>
            )}
            {product.rating && product.rating.rate >= 4.5 && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {t("topRated")}
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.info(t("addedToWishlist"));
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg"
              asChild
            >
              <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Quick Add Button - Appears on hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              className="w-full gap-2 shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {t("addToCart")}
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Category */}
          <Badge variant="outline" className="mb-2 text-xs capitalize">
            {product.category}
          </Badge>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[40px]">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating!.rate)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {discountedPrice.toFixed(2)} ₺
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {product.price.toFixed(2)} ₺
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
