import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Card from './Card';
import type { Product } from '@/types/product';

const meta = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <div style={{ width: '300px' }}>
                    <Story />
                </div>
            </BrowserRouter>
        ),
    ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleProduct: Product = {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use',
    category: 'men\'s clothing',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: {
        rate: 3.9,
        count: 120,
    },
};

export const Default: Story = {
    args: {
        product: sampleProduct,
    },
};

export const HighRating: Story = {
    args: {
        product: {
            ...sampleProduct,
            rating: {
                rate: 4.8,
                count: 350,
            },
        },
    },
};

export const LowRating: Story = {
    args: {
        product: {
            ...sampleProduct,
            rating: {
                rate: 2.1,
                count: 15,
            },
        },
    },
};

export const ExpensiveProduct: Story = {
    args: {
        product: {
            ...sampleProduct,
            title: 'Premium Leather Jacket',
            price: 599.99,
            category: 'men\'s clothing',
        },
    },
};

export const ElectronicsCategory: Story = {
    args: {
        product: {
            ...sampleProduct,
            title: 'Samsung 49-Inch CHG90 Gaming Monitor',
            category: 'electronics',
            price: 999.99,
            image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
        },
    },
};

export const LongTitle: Story = {
    args: {
        product: {
            ...sampleProduct,
            title: 'This is a very long product title that should be truncated to prevent layout issues and maintain a clean card appearance',
        },
    },
};
