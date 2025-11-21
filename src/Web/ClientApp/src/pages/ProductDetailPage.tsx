import { FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProduct, useBasket } from '@hooks';
import { useAppDispatch } from '@hooks/useRedux';
import { addToRecentlyViewed } from '@store/slices/productsSlice';
import { toast } from 'react-toastify';
import Loader from '@components/Loader';

const ProductDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { addToBasket } = useBasket();

    // Fetch product from API using existing hook
    const { products } = useProduct();
    const product = products?.find((p) => p.id === Number(id));

    // Add to recently viewed
    useEffect(() => {
        if (id) {
            dispatch(addToRecentlyViewed(Number(id)));
        }
    }, [id, dispatch]);

    const handleAddToCart = () => {
        if (product) {
            addToBasket({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                amount: 1,
            });
            toast.success(t('addedToCart'));
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/carts');
    };

    if (!products) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Loader />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">{t('error')}</h4>
                    <p>Product not found</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                        {t('continueShopping')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row g-4">
                {/* Product Image */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="card-img-top p-5"
                            style={{ height: '500px', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="col-lg-6">
                    <div className="d-flex flex-column h-100">
                        {/* Category Badge */}
                        <div className="mb-3">
                            <span className="badge bg-primary text-uppercase">{product.category}</span>
                        </div>

                        {/* Product Title */}
                        <h1 className="display-5 fw-bold mb-3">{product.title}</h1>

                        {/* Rating */}
                        <div className="d-flex align-items-center mb-3">
                            <div className="text-warning me-2 fs-5">
                                {'★'.repeat(Math.floor(product.rating.rate))}
                                {'☆'.repeat(5 - Math.floor(product.rating.rate))}
                            </div>
                            <span className="text-muted">
                                {product.rating.rate} ({product.rating.count} {t('reviews')})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <h2 className="display-4 fw-bold text-primary">
                                ${product.price.toFixed(2)}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <h5 className="fw-bold mb-2">Description</h5>
                            <p className="text-muted">{product.description}</p>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-4">
                            <span className="badge bg-success fs-6">
                                <i className="bi bi-check-circle me-1"></i>
                                {t('inStock')}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto">
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleBuyNow}
                                >
                                    <i className="bi bi-lightning-fill me-2"></i>
                                    Buy Now
                                </button>
                                <button
                                    className="btn btn-outline-primary btn-lg"
                                    onClick={handleAddToCart}
                                >
                                    <i className="bi bi-cart-plus me-2"></i>
                                    {t('addToCart')}
                                </button>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 pt-4 border-top">
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-truck fs-4 text-primary me-2"></i>
                                        <div>
                                            <small className="text-muted d-block">Free Shipping</small>
                                            <small className="fw-bold">Orders over $50</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-arrow-repeat fs-4 text-primary me-2"></i>
                                        <div>
                                            <small className="text-muted d-block">Easy Returns</small>
                                            <small className="fw-bold">30 Days Return</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-4">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    {t('continueShopping')}
                </button>
            </div>
        </div>
    );
};

export default ProductDetailPage;
