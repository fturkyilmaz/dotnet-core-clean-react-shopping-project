import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RegisterPage: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implement actual register API call
            // const response = await authApi.register({ email, password });

            // Mock register for now
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success(t('registerSuccess'));
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(t('registerFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <h2 className="fw-bold">{t('createAccount')}</h2>
                                <p className="text-muted">
                                    {t('alreadyHaveAccount')}{' '}
                                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                                        {t('signIn')}
                                    </Link>
                                </p>
                            </div>

                            {/* Register Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        {t('email')}
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        {t('password')}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <small className="text-muted">Minimum 6 characters</small>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                        {t('confirmPassword')}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {t('loading')}...
                                            </>
                                        ) : (
                                            t('createAccount')
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="position-relative my-4">
                                <hr />
                                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                                    or
                                </span>
                            </div>

                            {/* Social Register */}
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-secondary">
                                    <i className="bi bi-google me-2"></i>
                                    Continue with Google
                                </button>
                            </div>

                            {/* Terms */}
                            <p className="text-center text-muted mt-4 small">
                                By signing up, you agree to our{' '}
                                <a href="#" className="text-primary text-decoration-none">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
