import type { FC } from "react";
import { Link, NavLink } from "react-router-dom";
import { useBasket, useTheme } from "../hooks";
import ThemeToggle from "./ThemeToggle";

const Header: FC = () => {
  const { basket } = useBasket();
  const { theme } = useTheme();

  const totalItems = basket.reduce((total, product) => total + product.amount, 0);

  return (
    <nav
      className={`navbar sticky-top navbar-expand-md shadow-sm ${theme === "dark" ? "navbar-dark" : "navbar-light"}`}
      style={{
        backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
        transition: "background-color 0.3s ease"
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          🛒 Furkan Store
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`offcanvas offcanvas-end ${theme === "dark" ? "text-bg-dark" : "bg-white"}`}
          tabIndex={-1}
          id="offcanvasDarkNavbar"
          style={{ transition: "background-color 0.3s ease" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              Furkan TURKYILMAZ
            </h5>
            <button
              type="button"
              className={`btn-close ${theme === "dark" ? "btn-close-white" : ""}`}
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Anasayfa
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/checkout">
                  <span>Sepet</span>
                  <span className="badge bg-danger ms-1">{totalItems}</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/category">
                  Kategoriler
                </NavLink>
              </li>
            </ul>
            <div className="d-flex align-items-center mt-3 mt-md-0 ms-md-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
