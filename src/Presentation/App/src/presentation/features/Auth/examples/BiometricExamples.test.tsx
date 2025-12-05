import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SimpleBiometricLoginButton, PaymentAuthorizationButton, BiometricSettingsToggle } from './BiometricExamples';

// Mock the biometric auth hook
jest.mock('../hooks/useBiometricAuth', () => ({
  useBiometricAuth: () => ({
    authenticate: jest.fn().mockResolvedValue({ success: true }),
    authenticateWithOptions: jest.fn().mockResolvedValue({ success: true }),
    isLoading: false,
    isAvailable: true,
    getBiometryTypeName: () => 'Fingerprint',
    availability: {
      hasHardware: true,
      isEnrolled: true,
      biometryType: 'FINGERPRINT'
    }
  }),
}));

describe('Biometric Examples', () => {
  describe('SimpleBiometricLoginButton', () => {
    it('should render correctly', () => {
      const { getByText } = render(<SimpleBiometricLoginButton />);
      expect(getByText('Login with Fingerprint')).toBeTruthy();
    });

    it('should handle authentication on press', async () => {
      const { getByText } = render(<SimpleBiometricLoginButton />);
      const button = getByText('Login with Fingerprint');

      fireEvent.press(button);
      // Authentication should be called and show success alert
    });
  });

  describe('PaymentAuthorizationButton', () => {
    it('should render correctly', () => {
      const { getByText } = render(<PaymentAuthorizationButton onPaymentSuccess={() => {}} />);
      expect(getByText('Authorize Payment')).toBeTruthy();
    });

    it('should call onPaymentSuccess when authentication succeeds', async () => {
      const mockOnPaymentSuccess = jest.fn();
      const { getByText } = render(<PaymentAuthorizationButton onPaymentSuccess={mockOnPaymentSuccess} />);
      const button = getByText('Authorize Payment');

      fireEvent.press(button);
      expect(mockOnPaymentSuccess).toHaveBeenCalled();
    });
  });

  describe('BiometricSettingsToggle', () => {
    it('should render correctly', () => {
      const { getByText } = render(
        <BiometricSettingsToggle isEnabled={true} onToggle={() => {}} />
      );
      expect(getByText('Biometric Authentication')).toBeTruthy();
      expect(getByText('Enabled')).toBeTruthy();
    });

    it('should call onToggle when pressed', () => {
      const mockOnToggle = jest.fn();
      const { getByText } = render(
        <BiometricSettingsToggle isEnabled={false} onToggle={mockOnToggle} />
      );
      const button = getByText('Disabled');

      fireEvent.press(button);
      expect(mockOnToggle).toHaveBeenCalledWith(true);
    });
  });
});