import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading, error } = useProduct(Number(id));
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
            }));
            toast.success('Added to cart!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Product not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                    <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                    <div className="flex items-center mb-4">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-700">{product.rating.rate}</span>
                        <span className="ml-2 text-gray-500">({product.rating.count} reviews)</span>
                    </div>
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors text-lg font-semibold"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
