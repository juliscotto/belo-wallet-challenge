import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

import { formatUsd } from "../../../../core/formatting/formatCurrency";
import {
    AssetSymbol,
    SUPPORTED_ASSETS,
} from "../../../market/domain/entities/Asset";

type AssetRowProps = {
  symbol: AssetSymbol;
  balance: number;
  priceUsd: number;
  changePercentage24h: number | null;
};

import { useThemeStyles } from "../../../../core/theme/useThemeStyles";

export function AssetRow({
  symbol,
  balance,
  priceUsd,
  changePercentage24h,
}: AssetRowProps) {
  const asset = SUPPORTED_ASSETS[symbol];
  const holdingValueUsd = balance * priceUsd;
  const { styles } = useThemeStyles();

  const formattedChange =
    changePercentage24h === null
      ? "—"
      : `${changePercentage24h >= 0 ? "+" : ""}${changePercentage24h.toFixed(
          2,
        )}%`;

  const changeStyle =
    changePercentage24h === null
      ? styles.secondaryText
      : changePercentage24h >= 0
        ? tw`text-emerald-500`
        : tw`text-red-500`;

  return (
    <Pressable
      style={[
        tw`flex-row items-center justify-between border-b py-4`,
        styles.border,
      ]}
      accessible
      accessibilityLabel={`${asset.name}, balance ${balance} ${symbol}, value ${formatUsd(
        holdingValueUsd,
      )}`}
      onPress={() => {
        router.push({
          pathname: "/coin/[symbol]",
          params: {
            symbol,
          },
        });
      }}
    >
      <View style={tw`flex-1`}>
        <Text style={[tw`text-base font-semibold`, styles.primaryText]}>
          {symbol}
        </Text>

        <Text style={[tw`mt-1 text-sm`, styles.secondaryText]}>
          {asset.name}
        </Text>
      </View>

      <View style={tw`items-end`}>
        <Text style={[tw`text-base font-medium`, styles.primaryText]}>
          {balance} {symbol}
        </Text>

        <Text style={[tw`mt-1 text-sm`, styles.secondaryText]}>
          {formatUsd(holdingValueUsd)}
        </Text>

        <Text style={[tw`mt-1 text-sm`, changeStyle]}>{formattedChange}</Text>
      </View>
    </Pressable>
  );
}
