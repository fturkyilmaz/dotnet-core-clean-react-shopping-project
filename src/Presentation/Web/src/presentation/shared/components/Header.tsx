import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/presentation/store/slices/authSlice";
import { useTheme } from "@/context/theme-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Store,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItems = useAppSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isAdmin = user?.roles?.some(
    (role) => role.toLowerCase() === "admin" || role.toLowerCase() === "administrator"
  );

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { path: "/", label: t("home") },
    { path: "/category", label: t("categories") },
    { path: "/carts", label: t("cart"), badge: totalItems },
    ...(isAdmin ? [{ path: "/admin", label: "Admin", icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden text-xl font-bold sm:inline-block">
              Furkan Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {"icon" in item && item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
                {item.badge ? (
                  <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1 text-xs">
                    {item.badge}
                  </Badge>
                ) : null}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative group">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Globe className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 top-full mt-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-popover border rounded-lg shadow-lg p-1">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    i18n.language === "en"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => changeLanguage("tr")}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    i18n.language === "tr"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  🇹🇷 Türkçe
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" className="gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline-block max-w-[120px] truncate">
                    {user?.email}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-popover border rounded-lg shadow-lg p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-destructive"
                  >
                    {t("logout")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t("signIn")}</Link>
                </Button>
                <Button className="bg-white text-black border border-gray-200 hover:bg-gray-100" asChild>
                  <Link to="/register">{t("signUp")}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-2 text-base font-medium transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    {"icon" in item && item.icon && <item.icon className="h-5 w-5" />}
                    {item.label}
                  </span>
                  {item.badge ? (
                    <Badge variant="destructive">{item.badge}</Badge>
                  ) : null}
                </NavLink>
              ))}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{t("language")}</span>
                  <div className="flex gap-2">
                    <Button
                      variant={i18n.language === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => changeLanguage("en")}
                    >
                      EN
                    </Button>
                    <Button
                      variant={i18n.language === "tr" ? "default" : "outline"}
                      size="sm"
                      onClick={() => changeLanguage("tr")}
                    >
                      TR
                    </Button>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login">{t("signIn")}</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/register">{t("signUp")}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
