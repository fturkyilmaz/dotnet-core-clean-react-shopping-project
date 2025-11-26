import { FC } from 'react';

const ProductCardSkeleton: FC = () => {
    return (
        <div className="card h-100 border-0 shadow-sm">
            <div className="position-relative overflow-hidden bg-light" style={{ height: '250px' }}>
                <div className="skeleton-shimmer w-100 h-100"></div>
            </div>
            <div className="card-body">
                <div className="skeleton skeleton-text mb-2" style={{ width: '80%', height: '20px' }}></div>
                <div className="skeleton skeleton-text mb-3" style={{ width: '60%', height: '16px' }}></div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="skeleton skeleton-text" style={{ width: '80px', height: '24px' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '60px', height: '20px' }}></div>
                </div>
                <div className="skeleton skeleton-button w-100" style={{ height: '38px' }}></div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
