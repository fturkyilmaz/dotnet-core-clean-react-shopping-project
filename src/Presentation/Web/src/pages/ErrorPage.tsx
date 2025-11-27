import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage: FC = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        window.location.reload();
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center p-5">
                <div className="mb-4">
                    <i className="bi bi-exclamation-octagon text-danger" style={{ fontSize: '5rem' }}></i>
                </div>
                <h1 className="display-4 fw-bold mb-3">Something Went Wrong</h1>
                <p className="text-muted mb-4 lead">
                    We're experiencing technical difficulties. Please try again later.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <button onClick={handleRetry} className="btn btn-primary btn-lg">
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Retry
                    </button>
                    <button onClick={handleGoBack} className="btn btn-outline-secondary btn-lg">
                        <i className="bi bi-arrow-left me-2"></i>
                        Go Back
                    </button>
                    <Link to="/" className="btn btn-outline-secondary btn-lg">
                        <i className="bi bi-house-door me-2"></i>
                        Home
                    </Link>
                </div>
                <div className="mt-5">
                    <p className="text-muted small">
                        If the problem persists, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
