import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { MarketDataMode, useSettingsStore } from "../../store/settingsStore";

type ModeOptionProps = {
  mode: MarketDataMode;
  label: string;
  description: string;
};

export function MarketModeSelector() {
  const { t } = useTranslation();
  const { styles } = useThemeStyles();

  const marketDataMode = useSettingsStore((state) => state.marketDataMode);

  const setMarketDataMode = useSettingsStore(
    (state) => state.setMarketDataMode,
  );

  function renderOption({ mode, label, description }: ModeOptionProps) {
    const isSelected = marketDataMode === mode;

    return (
      <Pressable
        key={mode}
        style={[
          tw`mb-3 rounded-2xl border p-4`,
          styles.border,
          isSelected ? tw`border-blue-600 bg-blue-600` : styles.surface,
        ]}
        onPress={() => {
          setMarketDataMode(mode);
        }}
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityState={{
          selected: isSelected,
        }}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1 pr-4`}>
            <Text
              style={[
                tw`text-base font-semibold`,
                isSelected ? tw`text-white` : styles.primaryText,
              ]}
            >
              {label}
            </Text>

            <Text
              style={[
                tw`mt-1 text-sm`,
                isSelected ? tw`text-blue-100` : styles.secondaryText,
              ]}
            >
              {description}
            </Text>
          </View>

          <View
            style={[
              tw`h-5 w-5 items-center justify-center rounded-full border-2`,
              isSelected ? tw`border-white` : styles.border,
            ]}
          >
            {isSelected && (
              <View style={tw`h-2.5 w-2.5 rounded-full bg-white`} />
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View accessibilityRole="radiogroup">
      {renderOption({
        mode: "remote",
        label: t("settings.remote"),
        description: t("settings.remoteDescription"),
      })}

      {renderOption({
        mode: "mock",
        label: t("settings.mock"),
        description: t("settings.mockDescription"),
      })}
    </View>
  );
}
