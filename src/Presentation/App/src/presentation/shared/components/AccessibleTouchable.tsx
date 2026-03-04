import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

/**
 * AccessibleTouchable
 * -------------------
 * A wrapper around React Native's `TouchableOpacity` that enforces the
 * recommended minimum touch target size (48 dp) and adds an
 * `accessibilityLabel` for screen‑reader support.
 *
 * Usage example:
 *   <AccessibleTouchable
 *       accessibilityLabel="Add to cart"
 *       onPress={handleAdd}
 *       className="bg-primary"
 *   >
 *       <Text>Add</Text>
 *   </AccessibleTouchable>
 */
const AccessibleTouchable: React.FC<TouchableOpacityProps & { accessibilityLabel?: string }> = ({
    accessibilityLabel,
    style,
    children,
    ...rest
}) => (
    <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        className="min-h-12 min-w-12 justify-center items-center"
        style={style}
        {...rest}
    >
        {children}
    </TouchableOpacity>
);

export default AccessibleTouchable;
