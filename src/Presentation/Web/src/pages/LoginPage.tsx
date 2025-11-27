import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@hooks/useRedux';
import { setCredentials } from '@store/slices/authSlice';
import { authApi } from '@api/authApi';

const LoginPage: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authApi.login({ email, password });

            // Decode JWT to get user info
            if (!response.accessToken) {
                throw new Error('No token received');
            }

            const tokenPayload = JSON.parse(atob(response.accessToken.split('.')[1]));
            const user = {
                id: tokenPayload.nameid,
                email: tokenPayload.email,
                roles: tokenPayload.role ? (Array.isArray(tokenPayload.role) ? tokenPayload.role : [tokenPayload.role]) : [],
            };

            // Save to Redux and localStorage
            dispatch(setCredentials({ user, token: response.accessToken }));
            localStorage.setItem('refreshToken', response.refreshToken);

            toast.success(t('loginSuccess'));

            // Navigate to return URL or home
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || t('loginFailed');
            toast.error(errorMessage);
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
                                <h2 className="fw-bold">{t('signIn')}</h2>
                                <p className="text-muted">
                                    {t('dontHaveAccount')}{' '}
                                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                                        {t('signUp')}
                                    </Link>
                                </p>
                            </div>

                            {/* Login Form */}
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

                                <div className="mb-4">
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
                                            t('signIn')
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

                            {/* Social Login */}
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-secondary">
                                    <i className="bi bi-google me-2"></i>
                                    Continue with Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
