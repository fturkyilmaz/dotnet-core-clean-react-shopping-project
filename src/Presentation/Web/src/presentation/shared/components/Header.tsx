import { FC } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleTheme } from '@/presentation/store/slices/uiSlice';
import { logout } from '@/presentation/store/slices/authSlice';
import { GlobeAltIcon, MoonIcon, SunIcon, ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { CartItem } from '@/types/cart';

const Header: FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.ui.theme);
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const totalItems = cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  const isAdmin = user?.roles?.some(role =>
    role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator'
  );

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const currentLanguage = i18n.language || 'en';

  return (
    <nav
      className={`navbar sticky-top navbar-expand-md shadow-sm ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'
        }`}
      style={{
        backgroundColor: theme === 'dark' ? '#0d1117' : '#ffffff',
        transition: 'background-color 0.3s ease',
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
          className={`offcanvas offcanvas-end ${theme === 'dark' ? 'text-bg-dark' : 'bg-white'
            }`}
          tabIndex={-1}
          id="offcanvasDarkNavbar"
          style={{ transition: 'background-color 0.3s ease' }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              Furkan TURKYILMAZ
            </h5>
            <button
              type="button"
              className={`btn-close ${theme === 'dark' ? 'btn-close-white' : ''}`}
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  {t('home')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/category">
                  {t('categories')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/carts">
                  <ShoppingCartIcon className="d-inline-block" style={{ width: '20px', height: '20px', marginRight: '4px' }} />
                  <span>{t('cart')}</span>
                  {totalItems > 0 && (
                    <span className="badge bg-danger ms-1">{totalItems}</span>
                  )}
                </NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Language & Theme Controls */}
            <div className="d-flex align-items-center gap-2 mt-3 mt-md-0 ms-md-3">
              {/* Language Switcher */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <GlobeAltIcon style={{ width: '18px', height: '18px' }} />
                  <span className="text-uppercase">{currentLanguage}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className={`dropdown-item ${currentLanguage === 'en' ? 'active' : ''}`}
                      onClick={() => changeLanguage('en')}
                    >
                      🇬🇧 English
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${currentLanguage === 'tr' ? 'active' : ''}`}
                      onClick={() => changeLanguage('tr')}
                    >
                      🇹🇷 Türkçe
                    </button>
                  </li>
                </ul>
              </div>

              {/* Theme Toggle */}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon style={{ width: '18px', height: '18px' }} />
                ) : (
                  <MoonIcon style={{ width: '18px', height: '18px' }} />
                )}
              </button>

              {/* Auth Navigation */}
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <UserCircleIcon style={{ width: '18px', height: '18px' }} />
                    <span>{user?.email}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        {t('logout')}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-primary btn-sm">
                    {t('signIn')}
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    {t('signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
