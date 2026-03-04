import type { FC } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonProductGrid } from "@/components/ui/skeleton";
import ProductCard from "@/presentation/features/product/components/ProductCard";
import { useProducts } from "@/presentation/features/product/hooks/useProducts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const features = [
  {
    icon: Truck,
    title: "freeShipping",
    description: "freeShippingDesc",
  },
  {
    icon: Shield,
    title: "securePayment",
    description: "securePaymentDesc",
  },
  {
    icon: Headphones,
    title: "24_7Support",
    description: "24_7SupportDesc",
  },
  {
    icon: ShoppingBag,
    title: "easyReturns",
    description: "easyReturnsDesc",
  },
];

const HomePage: FC = () => {
  const { t } = useTranslation();
  const { data: products, isLoading, isError } = useProducts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  const filteredProducts =
    category === "all"
      ? products
      : products?.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );

  const displayCategory = category === "all" ? t("products") : category;
  const productCount = filteredProducts?.length ?? 0;
  const featuredProducts = filteredProducts?.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/20 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge variant="secondary" className="text-sm">
                {t("newCollection") || "New Collection 2024"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t("heroTitle") || "Discover the Latest"}
                <span className="text-primary block">{t("heroTitleHighlight") || "Trends & Styles"}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                {t("heroDescription") || "Explore our curated collection of premium products. Quality meets style in every piece."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/category">
                    {t("shopNow") || "Shop Now"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/category">
                    {t("viewCategories") || "View Categories"}
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl transform rotate-3" />
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60"
                  alt="Hero"
                  className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{t(feature.title)}</h3>
                <p className="text-xs text-muted-foreground">{t(feature.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold capitalize">{displayCategory}</h2>
              <p className="text-muted-foreground mt-1">
                {isLoading
                  ? t("loading")
                  : t("productsFound", { count: productCount })}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/category">
                {t("viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <SkeletonProductGrid count={8} />
          ) : isError ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("error")}</h3>
              <p className="text-muted-foreground">{t("failedToLoadProducts")}</p>
            </div>
          ) : productCount === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("noProductsFound")}</h3>
              <p className="text-muted-foreground">{t("tryDifferentCategory")}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {featuredProducts?.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t("newsletterTitle") || "Subscribe to Our Newsletter"}
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              {t("newsletterDescription") || "Get the latest updates on new products and upcoming sales."}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t("emailPlaceholder") || "Enter your email"}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button variant="secondary" className="px-6">
                {t("subscribe") || "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
