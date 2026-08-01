import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import tw from "twrnc";

import { triggerSelectionHaptic } from "../../../../core/haptics/haptics";
import { useAppTheme } from "../../../../core/theme/useAppTheme";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import {
    AssetSymbol,
    SUPPORTED_ASSETS,
} from "../../../market/domain/entities/Asset";
import { AssetIcon } from "../../../market/presentation/components/AssetIcon";

type AssetSelectorProps = {
  label: string;
  selectedSymbol: AssetSymbol;
  excludedSymbol?: AssetSymbol;
  onSelect: (symbol: AssetSymbol) => void;
};

const ASSET_SYMBOLS = Object.keys(SUPPORTED_ASSETS) as AssetSymbol[];

export function AssetSelector({
  label,
  selectedSymbol,
  excludedSymbol,
  onSelect,
}: AssetSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);

  const { styles } = useThemeStyles();
  const { isDark } = useAppTheme();

  const availableSymbols = ASSET_SYMBOLS.filter(
    (symbol) => symbol !== excludedSymbol,
  );

  const iconColor = isDark ? "#ffffff" : "#171717";

  return (
    <>
      <Text style={[tw`mb-2 text-sm`, styles.secondaryText]}>{label}</Text>

      <Pressable
        style={[
          tw`flex-row items-center rounded-2xl border p-4`,
          styles.surface,
          styles.border,
        ]}
        onPress={() => {
          setIsVisible(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedSymbol}`}
      >
        <AssetIcon symbol={selectedSymbol} size={40} />

        <View style={tw`ml-3 flex-1`}>
          <Text style={[tw`text-lg font-semibold`, styles.primaryText]}>
            {selectedSymbol}
          </Text>

          <Text style={[tw`mt-0.5 text-sm`, styles.secondaryText]}>
            {SUPPORTED_ASSETS[selectedSymbol].name}
          </Text>
        </View>

        <Ionicons name="chevron-down" size={20} color={iconColor} />
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setIsVisible(false);
        }}
      >
        <Pressable
          style={tw`flex-1 justify-end bg-black/50`}
          onPress={() => {
            setIsVisible(false);
          }}
        >
          <Pressable
            style={[
              tw`rounded-t-3xl px-5 pb-8 pt-5`,
              styles.screen,
              styles.elevatedSurface,
            ]}
            onPress={(event) => {
              event.stopPropagation();
            }}
          >
            <View style={tw`mb-4 flex-row items-center justify-between`}>
              <Text style={[tw`text-xl font-bold`, styles.primaryText]}>
                {label}
              </Text>

              <Pressable
                style={tw`p-2`}
                onPress={() => {
                  setIsVisible(false);
                }}
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
                hitSlop={8}
              >
                <Ionicons name="close" size={24} color={iconColor} />
              </Pressable>
            </View>

            {availableSymbols.map((symbol) => {
              const asset = SUPPORTED_ASSETS[symbol];
              const isSelected = symbol === selectedSymbol;

              return (
                <Pressable
                  key={symbol}
                  style={[
                    tw`flex-row items-center rounded-2xl px-3 py-4`,
                    isSelected && tw`bg-blue-500/10`,
                  ]}
                  onPress={() => {
                    void triggerSelectionHaptic();
                    onSelect(symbol);
                    setIsVisible(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{
                    selected: isSelected,
                  }}
                >
                  <AssetIcon symbol={symbol} size={40} />

                  <View style={tw`ml-3 flex-1`}>
                    <Text
                      style={[
                        tw`text-base font-semibold`,
                        isSelected ? tw`text-blue-500` : styles.primaryText,
                      ]}
                    >
                      {symbol}
                    </Text>

                    <Text style={[tw`mt-0.5 text-sm`, styles.secondaryText]}>
                      {asset.name}
                    </Text>
                  </View>

                  {isSelected && (
                    <View
                      style={tw`
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-600
                      `}
                    >
                      <Ionicons name="checkmark" size={18} color="#ffffff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
