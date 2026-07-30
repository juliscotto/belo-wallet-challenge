import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import tw from "twrnc";

import { SafeAreaView } from "react-native-safe-area-context";
import { formatUsd } from "../../../../core/formatting/formatCurrency";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import {
    AssetSymbol,
    SUPPORTED_ASSETS,
} from "../../../market/domain/entities/Asset";
import { useAssetPrices } from "../../../market/presentation/hooks/useAssetPrices";
import { usePortfolioStore } from "../../../portfolio/store/portfolioStore";

export function CoinDetailScreen() {
  const { t } = useTranslation();
  const { styles } = useThemeStyles();

  const params = useLocalSearchParams<{
    symbol?: string;
  }>();

  const symbol = params.symbol as AssetSymbol;

  const asset = SUPPORTED_ASSETS[symbol];

  const balance = usePortfolioStore((state) => state.balances[symbol]);

  const pricesQuery = useAssetPrices(symbol ? [symbol] : []);

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
      <View style={tw`flex-1 p-5`}>
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
      </View>
    </SafeAreaView>
  );
}
