import React from 'react';
import { Platform, Text, StyleSheet, View, TextStyle } from 'react-native';

// Map of Ionicons names to SF Symbols names
const ICON_MAP: Record<string, string> = {
  // Navigation
  'arrow-back': 'chevron.left',
  'arrow-forward': 'chevron.right',
  'chevron-forward': 'chevron.right',
  'chevron-back': 'chevron.left',

  // Home & Person
  'home': 'house',
  'home-outline': 'house',
  'person': 'person.fill',
  'person-outline': 'person',
  'person-add': 'person.badge.plus',

  // Cart & Shopping
  'cart': 'cart.fill',
  'cart-outline': 'cart',
  'pricetag': 'tag',

  // Grid & Categories
  'grid': 'square.grid.2x2',
  'grid-outline': 'square.grid.2x2',

  // Notifications
  'notifications': 'bell.fill',
  'notifications-outline': 'bell',

  // Settings & Security
  'shield-checkmark': 'checkmark.shield.fill',
  'help-circle': 'questionmark.circle',
  'log-out': 'rectangle.portrait.and.arrow.right',
  'log-out-outline': 'rectangle.portrait.and.arrow.right',

  // General
  'alert-circle': 'exclamationmark.circle.fill',
  'alert-circle-outline': 'exclamationmark.circle',
  'checkmark-circle': 'checkmark.circle.fill',
  'checkmark-circle-outline': 'checkmark.circle',
  'information-circle': 'info.circle.fill',
  'information-circle-outline': 'info.circle',

  // Cloud
  'cloud-outline': 'cloud',
  'cloud-offline-outline': 'cloud.slash',
  'cloud-upload-outline': 'icloud.and.arrow.up',

  // Device
  'phone-portrait-outline': 'iphone',
  'finger-print': 'touchid',

  // Star & Rating
  'star': 'star.fill',
  'star-outline': 'star',

  // Lock & Security
  'lock-closed-outline': 'lock.fill',
  'lock-closed': 'lock.fill',
  'key': 'key.fill',

  // Mail
  'mail-outline': 'envelope',

  // User
  'person-outline': 'person.fill',

  // Moon & Sun
  'moon': 'moon.fill',
  'sunny': 'sun.max.fill',

  // Trash
  'trash-outline': 'trash',

  // Language
  'language': 'globe',

  // Categories icons
  'hardware-chip-outline': 'cpu',
  'diamond-outline': 'diamond',
  'shirt-outline': 'tshirt',
  'woman-outline': 'figure.stand',

  // Misc
  'key-outline': 'key',
};

// Try to import expo-symbols, fall back to Ionicons
let SymbolView: React.ComponentType<any> | null = null;
let Ionicons: React.ComponentType<any> | null = null;

try {
  const expoSymbols = require('expo-symbols');
  SymbolView = expoSymbols.SymbolView;
} catch (e) {
  // expo-symbols not available
}

try {
  Ionicons = require('@expo/vector-icons').Ionicons;
} catch (e) {
  // Ionicons not available
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: object;
  className?: string; // For Tailwind - ignored in this component
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000',
  style,
  className
}) => {
  // Try to use SF Symbols first on iOS
  if (Platform.OS === 'ios' && SymbolView) {
    const symbolName = ICON_MAP[name] || name;
    return (
      <SymbolView
        name={symbolName}
        size={size}
        tintColor={color}
        style={style}
        fallback={false}
      />
    );
  }

  // Fall back to Ionicons
  if (Ionicons) {
    return (
      <Ionicons
        name={name}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // Ultimate fallback - render a simple view
  return (
    <Text style={[styles.fallback, { fontSize: size, color }, style]}>
      •
    </Text>
  );
};

// Helper for tab bar icons with proper typing
export const TabIcon: React.FC<{ name: string; color: string; size: number }> = ({
  name,
  color,
  size
}) => {
  return <Icon name={name} size={size} color={color} />;
};

const styles = StyleSheet.create({
  fallback: {
    textAlign: 'center',
  },
});

export default Icon;
