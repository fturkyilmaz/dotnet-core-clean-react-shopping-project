import type { Meta, StoryObj } from '@storybook/react';
import Loader from './Loader';

const meta = {
    title: 'Components/Loader',
    component: Loader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContainer: Story = {
    decorators: [
        (Story) => (
            <div style={{ width: '400px', height: '300px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Story />
            </div>
        ),
    ],
};
