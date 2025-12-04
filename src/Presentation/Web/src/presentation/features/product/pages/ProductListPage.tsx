import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useProducts } from '../hooks/useProducts';
import { addToCart } from '@/presentation/store/slices/cartSlice';
import type { Product } from '@/types/product';

export default function ProductListPage() {
    const { t } = useTranslation();
    const { data: products, isLoading, error } = useProducts();
    const dispatch = useDispatch();

    const handleAddToCart = (product: Product): void => {
        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        }));
        toast.success(t('addedToCart'));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12" role="alert">
                <p className="text-red-600">{t('error')}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('products')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <Link to={`/products/${product.id}`}>
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-48 object-cover"
                            />
                        </Link>
                        <div className="p-4">
                            <Link to={`/products/${product.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-2xl font-bold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                                    aria-label={t('addToCart')}
                                >
                                    {t('addToCart')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
