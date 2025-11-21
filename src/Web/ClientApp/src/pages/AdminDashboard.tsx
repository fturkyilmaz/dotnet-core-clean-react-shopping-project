import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProduct } from '../hooks';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const AdminDashboard: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { products } = useProduct();
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

    // Mock statistics
    const stats = {
        totalProducts: products?.length || 0,
        totalOrders: 156,
        totalRevenue: 45678.90,
        activeUsers: 1234,
    };

    const handleDeleteProduct = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            // TODO: Implement delete API call
            toast.success('Product deleted successfully');
        }
    };

    const handleAddProduct = () => {
        navigate('/admin/products/add');
    };

    if (!products) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Loader />
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col">
                    <h1 className="display-5 fw-bold">Admin Dashboard</h1>
                    <p className="text-muted">Manage your e-commerce platform</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Total Products</p>
                                    <h3 className="fw-bold mb-0">{stats.totalProducts}</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-box-seam fs-3 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Total Orders</p>
                                    <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-cart-check fs-3 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Total Revenue</p>
                                    <h3 className="fw-bold mb-0">${stats.totalRevenue.toLocaleString()}</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-currency-dollar fs-3 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Active Users</p>
                                    <h3 className="fw-bold mb-0">{stats.activeUsers}</h3>
                                </div>
                                <div className="bg-info bg-opacity-10 p-3 rounded">
                                    <i className="bi bi-people fs-3 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Overview
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <i className="bi bi-box-seam me-2"></i>
                        Products
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <i className="bi bi-receipt me-2"></i>
                        Orders
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="row g-4">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">Recent Activity</h5>
                                <div className="list-group list-group-flush">
                                    <div className="list-group-item border-0 px-0">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                                                <i className="bi bi-check-circle text-success"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 fw-semibold">New order received</p>
                                                <small className="text-muted">Order #1234 - $299.99</small>
                                            </div>
                                            <small className="text-muted">2 min ago</small>
                                        </div>
                                    </div>
                                    <div className="list-group-item border-0 px-0">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                                                <i className="bi bi-box-seam text-primary"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 fw-semibold">Product added</p>
                                                <small className="text-muted">New product in Electronics</small>
                                            </div>
                                            <small className="text-muted">1 hour ago</small>
                                        </div>
                                    </div>
                                    <div className="list-group-item border-0 px-0">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                                                <i className="bi bi-person-plus text-info"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 fw-semibold">New user registered</p>
                                                <small className="text-muted">john.doe@example.com</small>
                                            </div>
                                            <small className="text-muted">3 hours ago</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">Quick Actions</h5>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" onClick={handleAddProduct}>
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Add New Product
                                    </button>
                                    <button className="btn btn-outline-primary">
                                        <i className="bi bi-receipt me-2"></i>
                                        View All Orders
                                    </button>
                                    <button className="btn btn-outline-primary">
                                        <i className="bi bi-people me-2"></i>
                                        Manage Users
                                    </button>
                                    <button className="btn btn-outline-primary">
                                        <i className="bi bi-gear me-2"></i>
                                        Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="card-title fw-bold mb-0">Product Management</h5>
                            <button className="btn btn-primary" onClick={handleAddProduct}>
                                <i className="bi bi-plus-circle me-2"></i>
                                Add Product
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Rating</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.slice(0, 10).map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                />
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{product.title.substring(0, 40)}...</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">{product.category}</span>
                                            </td>
                                            <td className="fw-bold">${product.price}</td>
                                            <td>
                                                <span className="text-warning">
                                                    ★ {product.rating.rate}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    <button className="btn btn-outline-primary">
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title fw-bold mb-4">Recent Orders</h5>
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            Order management feature coming soon!
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
