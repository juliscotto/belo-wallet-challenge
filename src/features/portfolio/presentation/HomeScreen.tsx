import { Button, FlatList, Text, View } from "react-native";
import { AssetSymbol } from "../../market/domain/entities/Asset";
import { useAssetPrices } from "../../market/presentation/hooks/useAssetPrices";

const ASSET_SYMBOLS: AssetSymbol[] = ["USDT", "USDC", "DAI", "BTC", "ETH"];

export function HomeScreen() {
  const pricesQuery = useAssetPrices(ASSET_SYMBOLS);

  if (pricesQuery.isPending) {
    return <Text>Loading prices...</Text>;
  }

  if (pricesQuery.isError) {
    console.log("Prices query failed:", pricesQuery.error);
    return (
      <View>
        <Text>Unable to load prices</Text>
        <Text>
          {pricesQuery.error instanceof Error
            ? pricesQuery.error.message
            : "Unknown error"}
        </Text>
        <Button title="Retry" onPress={() => pricesQuery.refetch()} />
      </View>
    );
  }

  return (
    <FlatList
      data={pricesQuery.data}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => (
        <Text>
          {item.symbol}: USD {item.priceUsd}
        </Text>
      )}
    />
  );
}
