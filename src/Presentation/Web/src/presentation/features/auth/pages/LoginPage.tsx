import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../validation/loginSchema';

const LoginPage: FC = () => {
    const { t } = useTranslation();
    const { login, isLoggingIn } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        login(data);
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
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        {t('email')}
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        placeholder="name@example.com"
                                        {...register('email')}
                                    />
                                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        {t('password')}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                    {errors.password && <small className="text-danger">{errors.password.message}</small>}
                                </div>

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isLoggingIn}
                                    >
                                        {isLoggingIn ? (
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
