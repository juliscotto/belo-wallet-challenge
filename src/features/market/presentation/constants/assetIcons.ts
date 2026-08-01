import { ImageSourcePropType } from "react-native";

import { AssetSymbol } from "../../domain/entities/Asset";

export const ASSET_ICONS: Record<AssetSymbol, ImageSourcePropType> = {
  BTC: require("../../../../../assets/crypto/btc.png"),
  ETH: require("../../../../../assets/crypto/eth.png"),
  USDT: require("../../../../../assets/crypto/usdt.png"),
  USDC: require("../../../../../assets/crypto/usdc.png"),
  DAI: require("../../../../../assets/crypto/dai.png"),
};
