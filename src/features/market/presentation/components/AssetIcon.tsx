import { Image, ImageStyle, StyleProp } from "react-native";

import { AssetSymbol } from "../../domain/entities/Asset";
import { ASSET_ICONS } from "../constants/assetIcons";

type AssetIconProps = {
  symbol: AssetSymbol;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function AssetIcon({ symbol, size = 40, style }: AssetIconProps) {
  return (
    <Image
      source={ASSET_ICONS[symbol]}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      accessible
      accessibilityLabel={`${symbol} icon`}
    />
  );
}
