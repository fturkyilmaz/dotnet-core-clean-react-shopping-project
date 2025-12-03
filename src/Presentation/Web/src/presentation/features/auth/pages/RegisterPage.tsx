import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../validation/registerSchema';

const RegisterPage: FC = () => {
    const { t } = useTranslation();
    const { register: registerUser, isRegistering } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        registerUser(data);
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
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        {t('email')}
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        {...register('email')}
                                    />
                                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        {t('password')}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        {...register('password')}
                                    />
                                    {errors.password && <small className="text-danger">{errors.password.message}</small>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                        {t('confirmPassword')}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="confirmPassword"
                                        {...register('confirmPassword')}
                                    />
                                    {errors.confirmPassword && (
                                        <small className="text-danger">{errors.confirmPassword.message}</small>
                                    )}
                                </div>

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isRegistering}
                                    >
                                        {isRegistering ? (
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
