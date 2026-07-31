import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import tw from "twrnc";

import { CreatePriceAlertCard } from "@/src/features/priceAlerts/presentation/components/CreatePriceAlertCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatUsd } from "../../../../core/formatting/formatCurrency";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import {
    AssetSymbol,
    SUPPORTED_ASSETS,
} from "../../../market/domain/entities/Asset";
import { useAssetPrices } from "../../../market/presentation/hooks/useAssetPrices";
import { usePortfolioStore } from "../../../portfolio/store/portfolioStore";
import { PriceHistoryChart } from "../components/PriceHistoryChart";
import { usePriceHistory } from "../hooks/usePriceHistory";

export function CoinDetailScreen() {
  const { t } = useTranslation();
  const { styles, isDark } = useThemeStyles();

  const params = useLocalSearchParams<{
    symbol?: string;
  }>();

  const symbol = params.symbol as AssetSymbol;

  const asset = SUPPORTED_ASSETS[symbol];

  const balance = usePortfolioStore((state) => state.balances[symbol]);

  const pricesQuery = useAssetPrices(symbol ? [symbol] : []);

  const historyQuery = usePriceHistory(asset.coinGeckoId);
  if (historyQuery.isError) {
    console.error("Price history error:", historyQuery.error);
  }
  if (!asset) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, styles.screen]}>
        <Text style={styles.primaryText}>{t("coinDetail.invalidAsset")}</Text>
      </View>
    );
  }

  if (pricesQuery.isPending) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, styles.screen]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (pricesQuery.isError || !pricesQuery.data[0]) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, styles.screen]}>
        <Text style={styles.primaryText}>
          {t("coinDetail.priceUnavailable")}
        </Text>
      </View>
    );
  }

  const marketPrice = pricesQuery.data[0];

  const holdingValueUsd = balance * marketPrice.priceUsd;

  return (
    <SafeAreaView style={[tw`flex-1`, styles.screen]} edges={["top", "bottom"]}>
      <ScrollView style={tw`flex-1 p-5`}>
        <View style={tw`mb-6 flex-row items-center`}>
          <Pressable
            onPress={() => {
              router.back();
            }}
            accessibilityRole="button"
            accessibilityLabel={t("common.back")}
            hitSlop={12}
          >
            <Text style={[tw`mr-4 text-3xl`, styles.primaryText]}>‹</Text>
          </Pressable>

          <View>
            <Text style={[tw`text-3xl font-bold`, styles.primaryText]}>
              {asset.name}
            </Text>

            <Text style={[tw`mt-1 text-base`, styles.secondaryText]}>
              {symbol}
            </Text>
          </View>
        </View>

        <View style={[tw`rounded-3xl p-6`, styles.surface]}>
          <Text style={styles.secondaryText}>
            {t("coinDetail.currentPrice")}
          </Text>

          <Text style={[tw`mt-2 text-3xl font-bold`, styles.primaryText]}>
            {formatUsd(marketPrice.priceUsd)}
          </Text>

          <Text style={[tw`mt-6`, styles.secondaryText]}>
            {t("coinDetail.yourBalance")}
          </Text>

          <Text style={[tw`mt-2 text-xl font-semibold`, styles.primaryText]}>
            {balance} {symbol}
          </Text>

          <Text style={[tw`mt-1`, styles.secondaryText]}>
            {formatUsd(holdingValueUsd)}
          </Text>
        </View>
        <View style={[tw`mt-6 rounded-2xl p-4`, styles.surface]}>
          <Text style={[tw`mb-4 text-lg font-semibold`, styles.primaryText]}>
            {t("coinDetail.priceHistory24h")}
          </Text>

          {historyQuery.isPending && (
            <View style={tw`h-48 items-center justify-center`}>
              <ActivityIndicator color={isDark ? "#ffffff" : "#171717"} />
            </View>
          )}

          {historyQuery.isError && (
            <View style={tw`h-48 items-center justify-center`}>
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
                style={[tw`text-center`, styles.secondaryText]}
              >
                {t("coinDetail.priceHistoryError")}
              </Text>

              <Pressable
                style={[
                  tw`mt-4 rounded-xl px-4 py-3`,
                  historyQuery.isFetching
                    ? tw`bg-neutral-400`
                    : tw`bg-blue-600`,
                ]}
                onPress={() => {
                  void historyQuery.refetch();
                }}
                disabled={historyQuery.isFetching}
                accessibilityRole="button"
                accessibilityLabel={
                  historyQuery.isFetching
                    ? t("common.retrying")
                    : t("common.retry")
                }
                accessibilityState={{
                  disabled: historyQuery.isFetching,
                  busy: historyQuery.isFetching,
                }}
              >
                <Text style={tw`font-semibold text-white`}>
                  {historyQuery.isFetching
                    ? t("common.retrying")
                    : t("common.retry")}
                </Text>
              </Pressable>
            </View>
          )}

          {historyQuery.data && historyQuery.data.length > 1 && (
            <PriceHistoryChart
              points={historyQuery.data}
              accessibilityLabel={t("coinDetail.priceChartAccessibility")}
            />
          )}

          {historyQuery.data?.length === 0 && (
            <Text style={[tw`py-12 text-center`, styles.secondaryText]}>
              {t("coinDetail.noPriceHistory")}
            </Text>
          )}
        </View>
        <CreatePriceAlertCard
          symbol={asset.symbol}
          currentPriceUsd={marketPrice.priceUsd}
        />
        <Pressable
          style={tw`mt-8 items-center rounded-2xl bg-blue-600 p-4`}
          onPress={() => {
            router.push({
              pathname: "/swap",
              params: {
                fromSymbol: symbol,
              },
            });
          }}
        >
          <Text style={tw`font-semibold text-white`}>{t("swap.title")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
