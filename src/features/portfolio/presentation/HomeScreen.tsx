import { router } from "expo-router";
import {
    ActivityIndicator,
    Button,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";
import tw from "twrnc";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStyles } from "../../../core/theme/useThemeStyles";
import { AssetSymbol } from "../../market/domain/entities/Asset";
import { useAssetPrices } from "../../market/presentation/hooks/useAssetPrices";
import { NotificationButton } from "../../notifications/presentation/components/NotificationButton";
import { SettingsButton } from "../../settings/presentation/components/SettingsButton";
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
      <View style={[tw`flex-1 items-center justify-center`, styles.screen]}>
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
            title={
              pricesQuery.isFetching ? t("common.retrying") : t("common.retry")
            }
            onPress={() => {
              void pricesQuery.refetch();
            }}
            disabled={pricesQuery.isFetching}
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
            <View style={tw`mb-5 flex-row items-center justify-between`}>
              <Text style={[tw`text-2xl font-bold`, styles.primaryText]}>
                {t("portfolio.title")}
              </Text>
              <View style={tw`flex-row items-center gap-2`}>
                <SettingsButton />
                <NotificationButton />
              </View>
            </View>

            <BalanceCard
              totalBalanceUsd={totalBalanceUsd}
              isUpdating={pricesQuery.isFetching}
            />

            <Pressable
              style={tw`mt-8 items-center rounded-2xl bg-blue-600 p-4`}
              onPress={() => {
                router.push({
                  pathname: "/swap",
                });
              }}
            >
              <Text style={tw`font-semibold text-white`}>
                {t("swap.title")}
              </Text>
            </Pressable>

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
