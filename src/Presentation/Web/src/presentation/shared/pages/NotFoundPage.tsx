import type { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: FC = () => {
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 text-center">
                    <div className="p-5">
                        {/* 404 Animation */}
                        <div className="mb-4" style={{ fontSize: '120px', animation: 'bounce 2s infinite' }}>
                            🔍
                        </div>

                        <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
                        <h2 className="display-6 mb-4">Page Not Found</h2>

                        <p className="lead text-muted mb-4">
                            The page you're looking for doesn't exist or has been moved.
                        </p>

                        <div className="d-grid gap-3">
                            <Link
                                to="/"
                                className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm"
                            >
                                <i className="bi bi-house me-2"></i>
                                Back to Home
                            </Link>

                            <Link
                                to="/category"
                                className="btn btn-outline-secondary btn-lg px-5 py-2 rounded-pill"
                            >
                                <i className="bi bi-grid-3x3 me-2"></i>
                                Browse Categories
                            </Link>
                        </div>
                    </div>

                    <style>{`
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-20px);
              }
            }
          `}</style>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
