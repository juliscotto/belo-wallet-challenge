import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { formatUsd } from "../../../../core/formatting/formatCurrency";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { usePortfolioStore } from "../../../portfolio/store/portfolioStore";

import { createNotificationId } from "../../../notifications/domain/createNotificationId";
import { useNotificationStore } from "../../../notifications/store/notificationStore";

import { triggerSuccessHaptic } from "../../../../core/haptics/haptics";
import { useSwapStore } from "../../store/swapStore";

export function SwapConfirmationScreen() {
  const { t } = useTranslation();
  const { styles } = useThemeStyles();

  const quote = useSwapStore((state) => state.pendingQuote);

  const completeSwap = useSwapStore((state) => state.completeSwap);

  const clearPendingQuote = useSwapStore((state) => state.clearPendingQuote);

  const swapBalances = usePortfolioStore((state) => state.swapBalances);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  if (!quote) {
    return (
      <SafeAreaView
        style={[tw`flex-1 items-center justify-center p-5`, styles.screen]}
      >
        <Text style={[tw`text-center text-lg`, styles.primaryText]}>
          {t("swap.noPendingSwap")}
        </Text>

        <Pressable
          style={tw`mt-6 rounded-2xl bg-blue-600 px-6 py-4`}
          onPress={() => {
            router.replace("/");
          }}
        >
          <Text style={tw`font-semibold text-white`}>
            {t("swap.backToPortfolio")}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  function handleConfirm() {
    if (!quote) {
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

  const valueUsd = quote.fromAmount * quote.fromPriceUsd;

  return (
    <SafeAreaView
      style={[tw`flex-1 p-5`, styles.screen]}
      edges={["top", "bottom"]}
    >
      <View style={tw`mb-6 flex-row items-center`}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Text style={[tw`mr-4 text-2xl`, styles.primaryText]}>‹</Text>
        </Pressable>

        <Text style={[tw`text-2xl font-bold`, styles.primaryText]}>
          {t("swap.confirmationTitle")}
        </Text>
      </View>

      <View style={[tw`rounded-3xl p-6`, styles.surface]}>
        <Text style={[tw`text-sm`, styles.secondaryText]}>
          {t("swap.from")}
        </Text>

        <Text style={[tw`mt-2 text-2xl font-bold`, styles.primaryText]}>
          {quote.fromAmount} {quote.fromSymbol}
        </Text>

        <Text style={[tw`mt-2 text-sm`, styles.secondaryText]}>
          {formatUsd(valueUsd)}
        </Text>

        <View style={[tw`my-6 border-t`, styles.border]} />

        <Text style={[tw`text-sm`, styles.secondaryText]}>{t("swap.to")}</Text>

        <Text style={[tw`mt-2 text-2xl font-bold`, styles.primaryText]}>
          {quote.toAmount.toFixed(8)} {quote.toSymbol}
        </Text>

        <View style={[tw`my-6 border-t`, styles.border]} />

        <View style={tw`flex-row justify-between`}>
          <Text style={styles.secondaryText}>{t("swap.exchangeRate")}</Text>

          <Text style={[tw`ml-5 flex-1 text-right`, styles.primaryText]}>
            1 {quote.fromSymbol} = {quote.exchangeRate.toFixed(8)}{" "}
            {quote.toSymbol}
          </Text>
        </View>
      </View>

      <View style={tw`mt-auto`}>
        <Pressable
          style={tw`items-center rounded-2xl bg-blue-600 p-4`}
          onPress={handleConfirm}
          accessibilityRole="button"
        >
          <Text style={tw`text-base font-semibold text-white`}>
            {t("swap.confirm")}
          </Text>
        </Pressable>

        <Pressable
          style={[tw`mt-3 items-center rounded-2xl border p-4`, styles.border]}
          onPress={() => {
            router.back();
          }}
        >
          <Text style={[tw`text-base font-semibold`, styles.primaryText]}>
            {t("common.cancel")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
