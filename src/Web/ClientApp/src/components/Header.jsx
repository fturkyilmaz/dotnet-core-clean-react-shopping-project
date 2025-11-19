import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { BasketContext } from "./../context/basketContext";

const Header = () => {
  const { basket } = useContext(BasketContext);

  /* Sepetteki ürün sayısını hesapla */
  const total = basket?.reduce((total, product) => total + product.amount, 0);

  return (
    <nav className="navbar navbar-dark bg-black sticky-top navbar-expand-md ">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          FT Store
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
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasDarkNavbar"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              FT Store
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
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
                  <span className="badge bg-danger ms-1">{total}</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/category"
                  role="button"
                  // data-bs-toggle="dropdown"
                  // aria-expanded="false"
                >
                  Kategoriler
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
