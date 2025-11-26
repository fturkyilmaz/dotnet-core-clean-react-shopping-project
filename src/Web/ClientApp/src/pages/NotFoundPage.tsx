import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage: FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center p-5">
                <div className="mb-4">
                    <h1 className="display-1 fw-bold text-primary">404</h1>
                </div>
                <h2 className="display-6 fw-bold mb-3">Page Not Found</h2>
                <p className="text-muted mb-4 lead">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link to="/" className="btn btn-primary btn-lg">
                        <i className="bi bi-house-door me-2"></i>
                        {t('home')}
                    </Link>
                    <Link to="/category" className="btn btn-outline-secondary btn-lg">
                        <i className="bi bi-grid me-2"></i>
                        {t('categories')}
                    </Link>
                </div>
                <div className="mt-5">
                    <img
                        src="/404-illustration.svg"
                        alt="404 Not Found"
                        className="img-fluid"
                        style={{ maxWidth: '400px', opacity: 0.6 }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
