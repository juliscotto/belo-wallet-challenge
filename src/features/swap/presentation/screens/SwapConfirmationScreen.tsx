import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { formatUsd } from "../../../../core/formatting/formatCurrency";
import {
    triggerErrorHaptic,
    triggerSuccessHaptic,
} from "../../../../core/haptics/haptics";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";

import { useAssetPrices } from "../../../market/presentation/hooks/useAssetPrices";

import { createNotificationId } from "../../../notifications/domain/createNotificationId";
import { useNotificationStore } from "../../../notifications/store/notificationStore";

import { usePortfolioStore } from "../../../portfolio/store/portfolioStore";

import { AssetIcon } from "@/src/features/market/presentation/components/AssetIcon";
import { createSwapQuote } from "../../domain/useCases/createSwapQuote";
import {
    getSwapQuoteRemainingSeconds,
    isSwapQuoteExpired,
} from "../../domain/useCases/swapQuoteExpiration";
import { useSwapStore } from "../../store/swapStore";

export function SwapConfirmationScreen() {
  const { t } = useTranslation();
  const { styles, isDark } = useThemeStyles();

  const quote = useSwapStore((state) => state.pendingQuote);

  const setPendingQuote = useSwapStore((state) => state.setPendingQuote);

  const completeSwap = useSwapStore((state) => state.completeSwap);

  const clearPendingQuote = useSwapStore((state) => state.clearPendingQuote);

  const swapBalances = usePortfolioStore((state) => state.swapBalances);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const symbols = quote ? [quote.fromSymbol, quote.toSymbol] : [];

  const pricesQuery = useAssetPrices(symbols);

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    quote ? getSwapQuoteRemainingSeconds(quote) : 0,
  );

  const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);

  const [refreshError, setRefreshError] = useState(false);

  useEffect(() => {
    if (!quote) {
      setRemainingSeconds(0);
      return;
    }

    setRemainingSeconds(getSwapQuoteRemainingSeconds(quote));

    const intervalId = setInterval(() => {
      setRemainingSeconds(getSwapQuoteRemainingSeconds(quote));
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [quote]);

  if (!quote) {
    return (
      <SafeAreaView
        style={[
          tw`
            flex-1
            items-center
            justify-center
            p-5
          `,
          styles.screen,
        ]}
      >
        <Text style={[tw`text-center text-lg`, styles.primaryText]}>
          {t("swap.noPendingSwap")}
        </Text>

        <Pressable
          style={tw`
            mt-6
            rounded-2xl
            bg-blue-600
            px-6
            py-4
          `}
          onPress={() => {
            router.replace("/");
          }}
          accessibilityRole="button"
        >
          <Text
            style={tw`
              font-semibold
              text-white
            `}
          >
            {t("swap.backToPortfolio")}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const expired = remainingSeconds <= 0 || isSwapQuoteExpired(quote);

  const valueUsd = quote.fromAmount * quote.fromPriceUsd;

  async function handleRefreshQuote() {
    if (!quote || isRefreshingQuote) {
      return;
    }

    setIsRefreshingQuote(true);
    setRefreshError(false);

    try {
      const queryResult = await pricesQuery.refetch();

      const prices = queryResult.data ?? pricesQuery.data;

      const fromPrice = prices?.find(
        (price) => price.symbol === quote.fromSymbol,
      );

      const toPrice = prices?.find((price) => price.symbol === quote.toSymbol);

      if (!fromPrice || !toPrice) {
        setRefreshError(true);
        void triggerErrorHaptic();
        return;
      }

      const refreshedQuote = createSwapQuote({
        fromSymbol: quote.fromSymbol,

        toSymbol: quote.toSymbol,

        fromAmount: quote.fromAmount,

        fromPriceUsd: fromPrice.priceUsd,

        toPriceUsd: toPrice.priceUsd,
      });

      setPendingQuote(refreshedQuote);
    } catch {
      setRefreshError(true);
      void triggerErrorHaptic();
    } finally {
      setIsRefreshingQuote(false);
    }
  }

  function handleConfirm() {
    if (!quote) {
      return;
    }

    if (isSwapQuoteExpired(quote)) {
      setRemainingSeconds(0);
      void triggerErrorHaptic();
      return;
    }

    const result = swapBalances(
      quote.fromSymbol,
      quote.toSymbol,
      quote.fromAmount,
      quote.toAmount,
      quote.fromPriceUsd,
    );

    if (!result.success) {
      clearPendingQuote();

      router.replace({
        pathname: "/swap",
        params: {
          fromSymbol: quote.fromSymbol,
        },
      });

      return;
    }

    void triggerSuccessHaptic();

    addNotification({
      id: createNotificationId(),

      type: "SWAP_COMPLETED",

      createdAt: new Date().toISOString(),

      isRead: false,

      data: {
        fromSymbol: quote.fromSymbol,

        toSymbol: quote.toSymbol,

        fromAmount: quote.fromAmount,

        toAmount: quote.toAmount,
      },
    });

    completeSwap(quote);

    router.replace("/swap/result");
  }

  return (
    <SafeAreaView
      style={[tw`flex-1 p-5`, styles.screen]}
      edges={["top", "bottom"]}
    >
      <View
        style={tw`
          mb-6
          flex-row
          items-center
        `}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          hitSlop={8}
        >
          <Text style={[tw`mr-4 text-2xl`, styles.primaryText]}>‹</Text>
        </Pressable>

        <Text style={[tw`text-2xl font-bold`, styles.primaryText]}>
          {t("swap.confirmationTitle")}
        </Text>
      </View>

      <View style={[tw`rounded-3xl p-6`, styles.surface]}>
        <View style={tw`flex-row items-center`}>
          <AssetIcon symbol={quote.fromSymbol} size={40} />

          <View style={tw`ml-3 flex-1`}>
            <Text style={[tw`text-sm`, styles.secondaryText]}>
              {t("swap.from")}
            </Text>

            <Text style={[tw`mt-1 text-xl font-bold`, styles.primaryText]}>
              {quote.fromAmount} {quote.fromSymbol}
            </Text>
            <Text style={[tw`mt-2 text-sm`, styles.secondaryText]}>
              {formatUsd(valueUsd)}
            </Text>
          </View>
        </View>

        <View style={[tw`my-6 border-t`, styles.border]} />

        <View style={tw`flex-row items-center`}>
          <AssetIcon symbol={quote.toSymbol} size={40} />

          <View style={tw`ml-3 flex-1`}>
            <Text style={[tw`text-sm`, styles.secondaryText]}>
              {t("swap.to")}
            </Text>

            <Text style={[tw`mt-1 text-xl font-bold`, styles.primaryText]}>
              {quote.toAmount.toFixed(8)} {quote.toSymbol}
            </Text>
          </View>
        </View>

        <View style={[tw`my-6 border-t`, styles.border]} />

        <View
          style={tw`
            flex-row
            justify-between
          `}
        >
          <Text style={styles.secondaryText}>{t("swap.exchangeRate")}</Text>

          <Text
            style={[
              tw`
                ml-5
                flex-1
                text-right
              `,
              styles.primaryText,
            ]}
          >
            1 {quote.fromSymbol} = {quote.exchangeRate.toFixed(8)}{" "}
            {quote.toSymbol}
          </Text>
        </View>
      </View>

      <View
        style={[
          tw`
            mt-5
            rounded-2xl
            border
            p-4
          `,
          expired
            ? tw`
                border-red-500/40
                bg-red-500/10
              `
            : tw`
                border-blue-500/30
                bg-blue-500/10
              `,
        ]}
      >
        {!expired ? (
          <View
            style={tw`
              flex-row
              items-center
              justify-between
            `}
          >
            <Text style={[tw`text-sm`, styles.secondaryText]}>
              {t("swap.quoteExpiresIn")}
            </Text>

            <Text
              style={tw`
                font-semibold
                text-blue-500
              `}
              accessibilityLiveRegion="polite"
            >
              {formatCountdown(remainingSeconds)}
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={tw`
                text-center
                font-semibold
                text-red-500
              `}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
            >
              {t("swap.quoteExpired")}
            </Text>

            <Pressable
              style={[
                tw`
                  mt-4
                  items-center
                  rounded-xl
                  px-4
                  py-3
                `,
                isRefreshingQuote ? tw`bg-neutral-500` : tw`bg-blue-600`,
              ]}
              onPress={() => {
                void handleRefreshQuote();
              }}
              disabled={isRefreshingQuote}
              accessibilityRole="button"
              accessibilityLabel={t("swap.refreshQuote")}
              accessibilityState={{
                disabled: isRefreshingQuote,
                busy: isRefreshingQuote,
              }}
            >
              {isRefreshingQuote ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text
                  style={tw`
                    font-semibold
                    text-white
                  `}
                >
                  {t("swap.refreshQuote")}
                </Text>
              )}
            </Pressable>
          </>
        )}

        {refreshError && (
          <Text
            style={tw`
              mt-3
              text-center
              text-sm
              text-red-500
            `}
            accessibilityRole="alert"
          >
            {t("swap.refreshQuoteError")}
          </Text>
        )}
      </View>

      <View style={tw`mt-auto`}>
        <Pressable
          style={[
            tw`
              items-center
              rounded-2xl
              p-4
            `,
            expired ? tw`bg-neutral-500` : tw`bg-blue-600`,
          ]}
          onPress={handleConfirm}
          disabled={expired}
          accessibilityRole="button"
          accessibilityLabel={t("swap.confirm")}
          accessibilityState={{
            disabled: expired,
          }}
        >
          <Text
            style={tw`
              text-base
              font-semibold
              text-white
            `}
          >
            {t("swap.confirm")}
          </Text>
        </Pressable>

        <Pressable
          style={[
            tw`
              mt-3
              items-center
              rounded-2xl
              border
              p-4
            `,
            styles.border,
          ]}
          onPress={() => {
            router.back();
          }}
          accessibilityRole="button"
        >
          <Text
            style={[
              tw`
                text-base
                font-semibold
              `,
              styles.primaryText,
            ]}
          >
            {t("common.cancel")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}
