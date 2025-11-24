# Maestro E2E Testing

This directory contains end-to-end tests for the Shopping App mobile application using Maestro.

## Prerequisites

1. **Install Maestro CLI**:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   export PATH="$PATH":"$HOME/.maestro/bin"
   ```

2. **Verify installation**:
   ```bash
   maestro --version
   ```

## Test Structure

```
.maestro/
├── config.yaml              # Global configuration
├── flows/
│   ├── auth/               # Authentication tests
│   │   ├── login.yaml
│   │   └── register.yaml
│   ├── products/           # Product browsing tests
│   │   └── browse-products.yaml
│   ├── cart/               # Cart operation tests
│   │   ├── add-to-cart.yaml
│   │   ├── update-cart.yaml
│   │   └── checkout.yaml
│   └── notifications/      # Real-time notification tests
│       └── real-time-updates.yaml
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests by category
```bash
npm run test:e2e:auth       # Authentication tests
npm run test:e2e:products   # Product tests
npm run test:e2e:cart       # Cart tests
```

### Run on specific platform
```bash
npm run test:e2e:ios        # iOS only
npm run test:e2e:android    # Android only
```

### Watch mode (for development)
```bash
npm run test:e2e:watch
```

### Run single test file
```bash
maestro test .maestro/flows/auth/login.yaml
```

## Environment Variables

Configure in `.maestro/config.yaml`:
- `API_URL`: Backend API URL (default: http://localhost:5000)
- `TEST_USER_EMAIL`: Test user email
- `TEST_USER_PASSWORD`: Test user password

## Test Scenarios

### Authentication
- ✅ User login with valid credentials
- ✅ User registration
- ❌ Login with invalid credentials (TODO)
- ❌ Logout (TODO)

### Products
- ✅ Browse product list
- ✅ View product details
- ✅ Search products
- ❌ Filter products (TODO)

### Cart
- ✅ Add product to cart
- ✅ Update cart quantity
- ✅ Remove item from cart
- ✅ Complete checkout

### Notifications
- ✅ SignalR connection
- ✅ Receive real-time notifications
- ✅ Local notifications

## Screenshots

Screenshots are automatically saved to `.maestro/screenshots/` after each test run.

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests
- Manual workflow dispatch

See `.github/workflows/mobile-e2e.yml` for configuration.

## Troubleshooting

### App not launching
- Ensure the app is built: `npx expo prebuild`
- Check simulator/emulator is running
- Verify app ID in `config.yaml` matches your app

### Tests timing out
- Increase timeout in `config.yaml`
- Check network connectivity
- Ensure backend API is running

### Element not found
- Use Maestro Studio to inspect elements: `maestro studio`
- Check element IDs and text labels
- Add `testID` props to React Native components

## Best Practices

1. **Use testID**: Add `testID` props to important UI elements
2. **Wait for elements**: Use `assertVisible` with timeout
3. **Reuse flows**: Use `runFlow` to compose tests
4. **Take screenshots**: Document test results visually
5. **Keep tests independent**: Each test should be runnable standalone

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [Maestro Cloud](https://cloud.mobile.dev/)
