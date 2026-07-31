export const en = {
  portfolio: {
    title: "Portfolio",
    estimatedBalance: "Estimated balance",
    assets: "Assets",
    loading: "Loading portfolio...",
    updatingPrices: "Updating prices...",
    unableToLoadPrices: "Unable to load prices",
    openAssetDetails: "Open asset details",
  },

  market: {
    priceChange24h: "24h change",
  },

  settings: {
    title: "Settings",
    open: "Open settings",

    language: "Language",
    english: "English",
    spanish: "Spanish",

    marketDataSource: "Market data source",
    marketDataDescription:
      "Choose whether prices come from CoinGecko or local simulated data.",

    remote: "Remote",
    remoteDescription: "Use live cryptocurrency prices from CoinGecko.",

    mock: "Mock",
    mockDescription: "Use predictable local prices without network requests.",
  },

  coinDetail: {
    currentPrice: "Current price",
    yourBalance: "Your balance",
    invalidAsset: "Invalid asset",
    priceUnavailable: "Price unavailable",
    priceHistory24h: "Price history · 24h",
    priceHistoryError: "Unable to load price history.",
    noPriceHistory: "No price history is available.",
    priceChartAccessibility: "Price chart for the last 24 hours",
  },

  common: {
    retry: "Retry",
    retrying: "Retrying...",
    loading: "Loading...",
    cancel: "Cancel",
  },

  swap: {
    title: "Swap",
    from: "You pay",
    to: "You receive",
    amount: "Amount",
    availableBalance: "Available balance",
    estimatedAmount: "Estimated amount",
    exchangeRate: "Exchange rate",
    continue: "Continue",
    confirm: "Confirm swap",
    confirmationTitle: "Confirm swap",
    loadingPrices: "Loading prices...",
    success: "Swap completed",
    exchanged: "You successfully exchanged",
    noPendingSwap: "There is no swap awaiting confirmation",
    noCompletedSwap: "There is no completed swap",
    backToPortfolio: "Back to portfolio",

    errors: {
      invalidAmount: "Enter a valid amount",
      sameAsset: "Choose two different assets",
      insufficientBalance: "Insufficient balance",
      invalidPrice: "Price information is unavailable",
      belowMinimumAmount: "The minimum transaction amount is USD 1.",
    },
  },
  notifications: {
    title: "Notifications",
    open: "Open notifications",

    unreadCount: "{{count}} unread notification",
    unreadCount_other: "{{count}} unread notifications",

    markAllAsRead: "Mark all as read",
    allMarkedAsRead: "All read",
    emptyTitle: "No notifications yet",
    emptyDescription: "Your activity notifications will appear here.",

    swapCompleted: {
      title: "Swap completed",
      description:
        "You exchanged {{fromAmount}} {{fromSymbol}} for {{toAmount}} {{toSymbol}}.",
    },

    general: {
      title: "Notification",
    },
  },

  errors: {
    unexpectedTitle: "Something went wrong",
    retry: "Try again",
  },

  amountAccessibilityHint:
    "Enter the amount of the source asset you want to exchange",
} as const;
