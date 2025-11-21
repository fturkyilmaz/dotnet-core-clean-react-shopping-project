import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ProductFormData {
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

const AddProductPage: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        description: '',
        price: 0,
        category: '',
        image: '',
    });

    const categories = [
        'Electronics',
        'Jewelery',
        "Men's Clothing",
        "Women's Clothing",
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Product title is required');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Product description is required');
            return;
        }
        if (formData.price <= 0) {
            toast.error('Price must be greater than 0');
            return;
        }
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }
        if (!formData.image.trim()) {
            toast.error('Product image URL is required');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implement actual API call
            // await productsApi.createProduct(formData);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Product added successfully!');
            navigate('/admin');
        } catch (error) {
            toast.error('Failed to add product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
            navigate('/admin');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className="btn btn-outline-secondary me-3"
                            onClick={handleCancel}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="display-6 fw-bold mb-0">Add New Product</h1>
                            <p className="text-muted mb-0">Fill in the product details below</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Product Title */}
                                <div className="mb-4">
                                    <label htmlFor="title" className="form-label fw-semibold">
                                        Product Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter product title"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="form-label fw-semibold">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Enter product description"
                                        required
                                    />
                                    <small className="text-muted">
                                        Provide a detailed description of the product
                                    </small>
                                </div>

                                {/* Price and Category Row */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="price" className="form-label fw-semibold">
                                            Price ($) <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="price"
                                                name="price"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="category" className="form-label fw-semibold">
                                            Category <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select form-select-lg"
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div className="mb-4">
                                    <label htmlFor="image" className="form-label fw-semibold">
                                        Image URL <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control form-control-lg"
                                        id="image"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />
                                    <small className="text-muted">
                                        Enter a valid image URL
                                    </small>
                                </div>

                                {/* Image Preview */}
                                {formData.image && (
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Image Preview</label>
                                        <div className="border rounded p-3 bg-light text-center">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/200?text=Invalid+URL';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="d-flex gap-2 pt-3 border-top">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg flex-grow-1"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding Product...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Add Product
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-lg"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Help Text */}
                    <div className="alert alert-info mt-4">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Tip:</strong> Make sure all required fields are filled out correctly before submitting.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;
