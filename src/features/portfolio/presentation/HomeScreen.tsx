import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";
import tw from "twrnc";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStyles } from "../../../core/theme/useThemeStyles";
import { AssetSymbol } from "../../market/domain/entities/Asset";
import { useAssetPrices } from "../../market/presentation/hooks/useAssetPrices";
import { calculatePortfolioTotal } from "../domain/useCases/calculatePortfolioTotal";
import { usePortfolioStore } from "../store/portfolioStore";
import { AssetRow } from "./components/AssetRow";
import { BalanceCard } from "./components/BalanceCard";

const PORTFOLIO_SYMBOLS: AssetSymbol[] = ["USDT", "USDC", "DAI", "BTC", "ETH"];

export function HomeScreen() {
  const { t } = useTranslation();

  const balances = usePortfolioStore((state) => state.balances);

  const hasHydrated = usePortfolioStore((state) => state.hasHydrated);

  const pricesQuery = useAssetPrices(PORTFOLIO_SYMBOLS);

  const { styles, isDark } = useThemeStyles();

  if (!hasHydrated || pricesQuery.isPending) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <ActivityIndicator color={isDark ? "#ffffff" : "#171717"} />

        <Text style={tw`mt-3 text-neutral-600`}>{t("portfolio.loading")}</Text>
      </View>
    );
  }

  if (pricesQuery.isError) {
    return (
      <View style={[tw`flex-1 items-center justify-center p-6`, styles.screen]}>
        <Text style={[tw`text-center text-base`, styles.primaryText]}>
          {t("portfolio.unableToLoadPrices")}
        </Text>

        <View style={tw`mt-4`}>
          <Button
            title={t("common.retry")}
            onPress={() => pricesQuery.refetch()}
          />
        </View>
      </View>
    );
  }

  const totalBalanceUsd = calculatePortfolioTotal(balances, pricesQuery.data);

  return (
    <SafeAreaView style={[tw`flex-1`, styles.screen]} edges={["top"]}>
      <FlatList
        style={[tw`flex-1`, styles.screen]}
        contentContainerStyle={tw`p-5`}
        data={pricesQuery.data}
        keyExtractor={(item) => item.symbol}
        refreshing={pricesQuery.isFetching}
        onRefresh={() => {
          void pricesQuery.refetch();
        }}
        ListHeaderComponent={
          <View>
            <Text style={[tw`mb-5 text-2xl font-bold`, styles.primaryText]}>
              {t("portfolio.title")}
            </Text>

            <BalanceCard
              totalBalanceUsd={totalBalanceUsd}
              isUpdating={pricesQuery.isFetching}
            />

            <Text
              style={[tw`mb-2 mt-8 text-lg font-semibold`, styles.primaryText]}
            >
              {t("portfolio.assets")}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <AssetRow
            symbol={item.symbol}
            balance={balances[item.symbol]}
            priceUsd={item.priceUsd}
            changePercentage24h={item.changePercentage24h}
          />
        )}
      />
    </SafeAreaView>
  );
}
