# Storybook Component Documentation

This directory contains Storybook stories for documenting and testing UI components in isolation.

## Running Storybook

### Development Mode
```bash
npm run storybook
```

This will start Storybook on [http://localhost:6006](http://localhost:6006)

### Build Static Storybook
```bash
npm run build-storybook
```

This creates a static build in `storybook-static/` that can be deployed.

## Available Stories

### Components
- **Card** - Product card component with various states
  - Default product
  - High/low ratings
  - Different categories
  - Long titles
  
- **Loader** - Loading spinner component
  - Default state
  - In container

## Writing New Stories

### Basic Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Your component props
  },
};
```

### Using Decorators

For components that need routing or context:

```typescript
decorators: [
  (Story) => (
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  ),
],
```

## Addons Included

- **Essentials** - Controls, actions, viewport, backgrounds, etc.
- **Interactions** - Test user interactions
- **A11y** - Accessibility testing
- **Links** - Link stories together

## Best Practices

1. **Use TypeScript** - All stories should be `.stories.tsx`
2. **Add Multiple Variants** - Show different states and props
3. **Use Autodocs** - Add `tags: ['autodocs']` for automatic documentation
4. **Test Accessibility** - Use the A11y addon to check accessibility
5. **Keep Stories Simple** - Focus on one component at a time

## Accessibility Testing

The A11y addon automatically checks for accessibility issues. Look for the "Accessibility" tab in Storybook to see violations and recommendations.

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook Best Practices](https://storybook.js.org/docs/writing-stories/introduction)
- [Accessibility Addon](https://storybook.js.org/addons/@storybook/addon-a11y)
