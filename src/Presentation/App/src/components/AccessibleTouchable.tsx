import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';

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
 *       style={styles.button}
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
        style={[styles.touchable, style]}
        {...rest}
    >
        {children}
    </TouchableOpacity>
);

export default AccessibleTouchable;

const styles = StyleSheet.create({
    touchable: {
        minHeight: 48,
        minWidth: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
