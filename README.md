# Crypto Wallet Challenge

A mobile cryptocurrency wallet simulation built with React Native, Expo, and TypeScript.

Users can view their portfolio, check cryptocurrency prices, simulate asset swaps, receive in-app transaction alerts, and choose between live or simulated market data.

## Features

- Portfolio with persisted balances
- Live prices from CoinGecko
- Explicit remote and mock market data modes
- Settings screen for changing the market data source
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

You can also provide a `.env.example` file:

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

Clear the Metro cache:

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
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── notifications.tsx
│   ├── settings.tsx
│   ├── coin/
│   └── swap/
├── core/
├── features/
│   ├── market/
│   ├── portfolio/
│   ├── swap/
│   ├── notifications/
│   └── settings/
└── providers/
```

The project is organized by feature, separating domain logic, data access, presentation, and state management.

## Market Data

The app uses CoinGecko to retrieve current USD prices and 24-hour percentage changes.

TanStack Query handles:

- Request caching
- Loading and error states
- Background refetching
- Stale data
- Request deduplication

The project supports two explicit market data modes:

- `remote`: retrieves live prices from CoinGecko
- `mock`: uses predefined local prices without network requests

The selected mode is stored in a Zustand settings store.

The market repository reads the current setting and selects the corresponding data source:

```text
Settings store
      ↓
Market repository
      ↓
Remote or mock data source
```

The selected mode is also included in the TanStack Query key, ensuring that prices are requested again when the user changes the data source.

The app does not silently fall back to mock prices when CoinGecko fails. In remote mode, API failures are exposed through the corresponding UI error state.

## Settings

A settings button is available next to the notification button on the portfolio screen.

The Settings screen allows the user to choose between:

- Remote market data
- Mock market data

Remote mode uses CoinGecko and requires network access.

Mock mode uses predictable local prices and is useful for development, testing, API rate limits, or unavailable credentials.

The setting is applied immediately after selection.

## Portfolio

The total balance is calculated by multiplying each asset balance by its current USD price and adding all holding values.

Portfolio balances are persisted using Zustand Persist and AsyncStorage.

## Swap Flow

1. Select source and destination assets.
2. Enter the amount to exchange.
3. Validate the amount, balance, asset selection, and prices.
4. Calculate the destination amount.
5. Review the confirmation screen.
6. Confirm the transaction.
7. Update both balances atomically.
8. Create an in-app transaction notification.

Swaps are simulated locally and do not execute real cryptocurrency transactions.

### Quote Expiration

Swap quotes are valid for 30 seconds. The confirmation screen displays a countdown and prevents execution after expiration.

Expired quotes can be refreshed using the latest available market prices. Refreshing preserves the source amount but may change the destination amount and exchange rate.

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

These are in-app alerts, not operating system push notifications.

### Price Alerts

Users can create persistent price alerts from coin detail screens. Alerts support above and below conditions and are evaluated whenever fresh market prices are available while the application is running.

Triggered alerts create persistent in-app notifications and are automatically deactivated to prevent duplicate alerts. Background push notifications are outside the current scope.

## Internationalization

The app supports English and Spanish using i18next and React i18next.

The initial language follows the device locale.

Notifications store structured transaction data instead of translated strings, allowing them to be rendered in the currently selected language.

## Dark Mode

The UI follows the system color scheme and updates automatically between light and dark mode.

## Accessibility

The app includes:

- Accessible labels and roles
- Disabled accessibility states
- Screen-reader-friendly buttons
- Announced validation errors
- Accessible settings options
- Larger touch targets
- Scalable text
- Safe area support

## Haptics

Haptic feedback is used for:

- Asset selection
- Validation errors
- Successful swaps

A physical device is recommended for testing haptic feedback.

## Error Handling

Expected errors are represented through explicit UI states.

API failures are captured by TanStack Query and exposed through properties such as:

```text
isPending
isError
error
refetch
```

Affected screens can display loading, error, and retry states without crashing the application.

Invalid swaps remain inside the swap flow and display translated validation messages for cases such as:

- Invalid amount
- Same source and destination asset
- Insufficient balance
- Invalid or unavailable prices

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
- Failure cases that must not modify balances

Integration tests cover the main Swap Screen flow, including:

- Rendering the screen
- Entering an amount
- Displaying the estimated destination amount
- Continuing to the confirmation route

AsyncStorage is mocked in Jest because its real implementation depends on native modules.

## Main Technical Decisions

### Zustand

Used for local state such as:

- Portfolio balances
- Market data mode
- Pending swaps
- Completed swaps
- Notifications

### TanStack Query

Used for remote market data, caching, loading, errors, and refetching.

The selected market data mode is included in the query key so changing from remote to mock, or from mock to remote, triggers the appropriate query.

### Repository Data Source Selection

The market repository receives both remote and mock data sources.

It reads the current Zustand setting through a callback and selects the appropriate implementation before requesting prices.

This keeps the UI independent from the concrete data source.

### Domain Use Cases

Business calculations and validations are kept outside React components to improve reuse and testability.

### Temporary Quotes

Pending swap quotes are not persisted because market prices may become stale.

### Explicit Mock Mode

Mock data is selected manually from the Settings screen.

The app does not automatically replace failed remote prices with simulated prices, preventing mock values from being mistaken for live market data.

## Trade-offs

- Swaps are simulated locally
- No backend or blockchain integration
- No real funds or private keys
- CoinGecko depends on network availability and API limits
- Mock mode must be selected manually
- The selected market data mode is not persisted after restarting the app
- Notifications are in-app only
- Transaction history and price charts are outside the current scope

## Security Notice

This project is a technical challenge and a simulated cryptocurrency wallet.

It does not store real private keys, execute real trades, or transfer real funds.
