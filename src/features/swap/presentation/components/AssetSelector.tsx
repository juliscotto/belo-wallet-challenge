import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import tw from "twrnc";

import { triggerSelectionHaptic } from "../../../../core/haptics/haptics";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import {
    AssetSymbol,
    SUPPORTED_ASSETS,
} from "../../../market/domain/entities/Asset";

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

  const availableSymbols = ASSET_SYMBOLS.filter(
    (symbol) => symbol !== excludedSymbol,
  );

  return (
    <>
      <Text style={[tw`mb-2 text-sm`, styles.secondaryText]}>{label}</Text>

      <Pressable
        style={[
          tw`flex-row items-center justify-between rounded-2xl border p-4`,
          styles.surface,
          styles.border,
        ]}
        onPress={() => {
          setIsVisible(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedSymbol}`}
      >
        <View>
          <Text style={[tw`text-lg font-semibold`, styles.primaryText]}>
            {selectedSymbol}
          </Text>

          <Text style={[tw`mt-1 text-sm`, styles.secondaryText]}>
            {SUPPORTED_ASSETS[selectedSymbol].name}
          </Text>
        </View>

        <Text style={[tw`text-lg`, styles.secondaryText]}>▾</Text>
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
              tw`rounded-t-3xl p-5`,
              styles.screen,
              styles.elevatedSurface,
            ]}
            onPress={(event) => {
              event.stopPropagation();
            }}
          >
            <View style={tw`mb-5 flex-row items-center justify-between`}>
              <Text style={[tw`text-xl font-bold`, styles.primaryText]}>
                {label}
              </Text>

              <Pressable
                onPress={() => {
                  setIsVisible(false);
                }}
                accessibilityRole="button"
              >
                <Text style={[tw`text-base`, styles.secondaryText]}>✕</Text>
              </Pressable>
            </View>

            {availableSymbols.map((symbol) => {
              const asset = SUPPORTED_ASSETS[symbol];

              const isSelected = symbol === selectedSymbol;

              return (
                <Pressable
                  key={symbol}
                  style={[
                    tw`flex-row items-center justify-between border-b py-4`,
                    styles.border,
                  ]}
                  onPress={() => {
                    void triggerSelectionHaptic();
                    onSelect(symbol);
                    setIsVisible(false);
                  }}
                >
                  <View>
                    <Text
                      style={[tw`text-base font-semibold`, styles.primaryText]}
                    >
                      {symbol}
                    </Text>

                    <Text style={[tw`mt-1 text-sm`, styles.secondaryText]}>
                      {asset.name}
                    </Text>
                  </View>

                  {isSelected && (
                    <Text style={tw`text-lg text-blue-500`}>✓</Text>
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
