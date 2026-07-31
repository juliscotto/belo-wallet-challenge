export const es = {
  portfolio: {
    title: "Portafolio",
    estimatedBalance: "Balance estimado",
    assets: "Activos",
    loading: "Cargando portafolio...",
    updatingPrices: "Actualizando precios...",
    unableToLoadPrices: "No se pudieron cargar los precios",
    openAssetDetails: "Abrir detalle del activo",
  },

  market: {
    priceChange24h: "Variación en 24 h",
  },

  settings: {
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
  },

  coinDetail: {
    currentPrice: "Precio actual",
    yourBalance: "Tu balance",
    invalidAsset: "Activo inválido",
    priceUnavailable: "Precio no disponible",
  },

  common: {
    retry: "Reintentar",
    loading: "Cargando...",
    cancel: "Cancelar",
  },

  swap: {
    title: "Intercambiar",
    from: "Entregás",
    to: "Recibís",
    amount: "Cantidad",
    availableBalance: "Balance disponible",
    estimatedAmount: "Cantidad estimada",
    exchangeRate: "Tasa de cambio",
    continue: "Continuar",
    confirm: "Confirmar intercambio",
    confirmationTitle: "Confirmar intercambio",
    loadingPrices: "Cargando precios...",
    success: "Intercambio realizado",
    exchanged: "Intercambiaste correctamente",
    noPendingSwap: "No hay un intercambio pendiente de confirmación",
    noCompletedSwap: "No hay un intercambio completado",
    backToPortfolio: "Volver al portafolio",

    errors: {
      invalidAmount: "Ingresá una cantidad válida",
      sameAsset: "Elegí dos activos diferentes",
      insufficientBalance: "Balance insuficiente",
      invalidPrice: "La información del precio no está disponible",
    },
  },
  notifications: {
    title: "Notificaciones",
    open: "Abrir notificaciones",

    unreadCount: "{{count}} notificación sin leer",
    unreadCount_other: "{{count}} notificaciones sin leer",

    markAllAsRead: "Marcar todas como leídas",

    emptyTitle: "Todavía no hay notificaciones",
    emptyDescription: "Las notificaciones de tu actividad aparecerán acá.",

    swapCompleted: {
      title: "Intercambio completado",
      description:
        "Intercambiaste {{fromAmount}} {{fromSymbol}} por {{toAmount}} {{toSymbol}}.",
    },

    general: {
      title: "Notificación",
    },

    errors: {
      unexpectedTitle: "Ocurrió un error",
      retry: "Intentar nuevamente",
    },

    amountAccessibilityHint:
      "Ingresá la cantidad del activo de origen que querés intercambiar",
  },
} as const;
