import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 md:p-12 text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="relative inline-block mb-8"
          >
            <div className="text-8xl md:text-9xl font-bold text-primary/20 select-none">
              404
            </div>
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <AlertCircle className="h-16 w-16 md:h-20 md:w-20 text-destructive" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t("pageNotFound") || "Page Not Found"}
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {t("pageNotFoundDesc") || "Oops! The page you're looking for seems to have wandered off. Let's get you back on track."}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link to="/">
                  <Home className="h-5 w-5" />
                  {t("backToHome") || "Back to Home"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link to="/category">
                  <Search className="h-5 w-5" />
                  {t("browseProducts") || "Browse Products"}
                </Link>
              </Button>
            </div>

            {/* Go Back */}
            <button
              onClick={() => window.history.back()}
              className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("goBack") || "Go Back"}
            </button>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/50 rounded-full blur-3xl"
            />
          </div>
        </Card>

        {/* Help Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {t("needHelp") || "Need help? Try these:"}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/category" className="text-primary hover:underline">
              {t("allCategories")}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/carts" className="text-primary hover:underline">
              {t("shoppingCart")}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/login" className="text-primary hover:underline">
              {t("signIn")}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
