import { FC } from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductListSkeletonProps {
    count?: number;
}

const ProductListSkeleton: FC<ProductListSkeletonProps> = ({ count = 8 }) => {
    return (
        <div className="row g-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <ProductCardSkeleton />
                </div>
            ))}
        </div>
    );
};

export default ProductListSkeleton;
