import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Monitor,
  Gem,
  Shirt,
  ShoppingBag,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkeletonProductGrid } from "@/components/ui/skeleton";
import ProductCard from "@/presentation/features/product/components/ProductCard";
import { useProducts } from "@/presentation/features/product/hooks/useProducts";

interface CategoryData {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  gradient: string;
}

const categoryData: CategoryData[] = [
  {
    id: "all",
    name: "allProducts",
    icon: Grid3X3,
    description: "browseAllProducts",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "electronics",
    name: "electronics",
    icon: Monitor,
    description: "latestGadgets",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "jewelery",
    name: "jewelry",
    icon: Gem,
    description: "elegantJewelry",
    color: "bg-yellow-500",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: "men's clothing",
    name: "mensClothing",
    icon: Shirt,
    description: "mensFashion",
    color: "bg-slate-500",
    gradient: "from-slate-500 to-gray-500",
  },
  {
    id: "women's clothing",
    name: "womensClothing",
    icon: ShoppingBag,
    description: "womensFashion",
    color: "bg-pink-500",
    gradient: "from-pink-500 to-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CategoryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: products, isLoading, isError } = useProducts();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  // Get unique categories for display
  useMemo(() => {
    if (!products) return [];
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === "all") {
      navigate("/");
    } else {
      navigate(`/?category=${encodeURIComponent(categoryId)}`);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === "all") return products;
    return products.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/20 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("categories")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("categoriesDescription") || "Explore our wide range of products across different categories"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {categoryData.map((category) => {
              const isActive =
                category.id === selectedCategory ||
                (category.id === "all" && selectedCategory === "all");
              const productCount =
                category.id === "all"
                  ? products?.length || 0
                  : products?.filter((p) => p.category === category.id).length || 0;

              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card
                    onClick={() => handleCategorySelect(category.id)}
                    className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      isActive ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 transition-opacity duration-300 ${
                        isActive ? "opacity-10" : "group-hover:opacity-5"
                      }`}
                    />
                    <div className="p-6">
                      <div
                        className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4`}
                      >
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">
                        {t(category.name)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t(category.description)}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {productCount} {t("products")}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold capitalize">
                {selectedCategory === "all"
                  ? t("allProducts")
                  : selectedCategory}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} {t("productsFound")}
              </p>
            </div>
            {selectedCategory !== "all" && (
              <Button variant="outline" onClick={() => handleCategorySelect("all")}>
                {t("viewAllCategories")}
              </Button>
            )}
          </div>

          {isLoading ? (
            <SkeletonProductGrid count={8} />
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-destructive">{t("error")}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">
                {t("noProductsInCategory")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("tryDifferentCategory")}
              </p>
              <Button onClick={() => handleCategorySelect("all")}>
                {t("viewAllProducts")}
              </Button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
