# Crypto Wallet Challenge

A mobile cryptocurrency wallet simulation built with React Native, Expo, and TypeScript.

Users can view their portfolio, check cryptocurrency prices, simulate asset swaps, and receive in-app transaction alerts.

## Features

- Portfolio with persisted balances
- Live prices from CoinGecko
- Mock mode for API failures or rate limits
- Asset detail screens
- Swap simulation with validations
- Atomic balance updates
- Swap confirmation and result screens
- Persistent in-app notifications
- Unread notification badge
- English and Spanish support
- System light and dark mode
- Accessibility support
- Haptic feedback
- Unit and integration tests
- Global Error Boundary

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- Zustand
- TanStack Query
- AsyncStorage
- TWRNC
- i18next
- Jest
- React Native Testing Library
- Bun

## Requirements

- Bun
- Node.js
- Android Studio, Android emulator, or Expo Go
- CoinGecko Demo API key

## Installation

```bash
git clone <repository-url>
cd crypto-wallet-challenge
bun install
```

Create a `.env` file:

```env
EXPO_PUBLIC_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
EXPO_PUBLIC_COINGECKO_API_KEY=your_demo_api_key
```

Do not commit your real API key.

Add `.env` to `.gitignore`:

```gitignore
.env
```

You can also provide a `.env.example`:

```env
EXPO_PUBLIC_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
EXPO_PUBLIC_COINGECKO_API_KEY=
```

## Running the Project

Start Android:

```bash
bun run android
```

Or start Expo:

```bash
bunx expo start
```

Clear Metro cache:

```bash
bunx expo start --clear
```

## Tests and Validation

Run all tests:

```bash
bun run test
```

Run tests in watch mode:

```bash
bun run test:watch
```

Generate coverage:

```bash
bun run test:coverage
```

Validate TypeScript:

```bash
bunx tsc --noEmit
```

Run Expo Doctor:

```bash
bunx expo-doctor
```

## Project Structure

```text
src/
├── app/
├── core/
├── features/
│   ├── market/
│   ├── portfolio/
│   ├── swap/
│   └── notifications/
└── providers/
```

The project is organized by feature, separating domain logic, data access, presentation, and state management.

## Market Data

The app uses CoinGecko to retrieve current USD prices and 24-hour percentage changes.

TanStack Query handles:

- Caching
- Loading and error states
- Background refetching
- Stale data

The project supports two data modes:

- `remote`: live CoinGecko prices
- `mock`: local predefined prices

## Portfolio

The total balance is calculated by multiplying each asset balance by its current USD price and adding all holding values.

Portfolio balances are persisted with Zustand Persist and AsyncStorage.

## Swap Flow

1. Select source and destination assets.
2. Enter the amount to exchange.
3. Validate amount, balance, asset selection, and prices.
4. Calculate the destination amount.
5. Review the confirmation screen.
6. Confirm the transaction.
7. Update both balances atomically.
8. Create an in-app transaction notification.

Swaps are simulated locally and do not execute real cryptocurrency transactions.

## Atomic Balance Updates

Both balances are updated inside a single Zustand state update.

Example:

```text
Before:
BTC: 0.05
ETH: 1.5

Swap:
0.01 BTC → 0.2 ETH

After:
BTC: 0.04
ETH: 1.7
```

## Transaction Alerts

Transaction alerts are persistent in-app notifications.

After a successful swap:

- A notification is created
- The unread badge increases
- The notification appears in the notification screen
- The user can mark it as read

These are in-app alerts, not system push notifications.

## Internationalization

The app supports English and Spanish using i18next and React i18next.

The initial language follows the device locale.

Notifications store structured data instead of translated strings, allowing them to be rendered in the current language.

## Dark Mode

The UI follows the system color scheme and updates automatically between light and dark mode.

## Accessibility

The app includes:

- Accessible labels and roles
- Disabled accessibility states
- Screen-reader-friendly buttons
- Announced validation errors
- Larger touch targets
- Scalable text
- Safe area support

## Haptics

Haptic feedback is used for:

- Asset selection
- Validation errors
- Successful swaps

A physical device is recommended for testing haptics.

## Error Handling

Expected errors, such as API failures or invalid swaps, are handled by the corresponding screen.

Unexpected React rendering errors are handled by a global Error Boundary in:

```text
src/app/_layout.tsx
```

## Testing

Unit tests cover:

- Portfolio calculations
- Swap quote calculations
- Swap validations
- Atomic balance updates

Integration tests cover the main Swap Screen flow.

AsyncStorage is mocked in Jest because its real implementation depends on native modules.

## Main Technical Decisions

### Zustand

Used for local state such as balances, pending swaps, and notifications.

### TanStack Query

Used for remote market data, caching, loading, errors, and refetching.

### Domain Use Cases

Business calculations and validations are kept outside React components to improve reuse and testability.

### Temporary Quotes

Pending swap quotes are not persisted because market prices may become stale.

## Trade-offs

- Swaps are simulated locally
- No backend or blockchain integration
- No real funds or private keys
- CoinGecko depends on network availability and API limits
- Notifications are in-app only
- Transaction history and price charts are outside the current scope

## Security Notice

This project is a technical challenge and a simulated cryptocurrency wallet.

It does not store real private keys, execute real trades, or transfer real funds.
