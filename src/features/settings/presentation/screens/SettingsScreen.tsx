import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { useAppTheme } from "../../../../core/theme/useAppTheme";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { MarketModeSelector } from "../components/MarketModeSelector";

export function SettingsScreen() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { styles } = useThemeStyles();

  return (
    <SafeAreaView style={[tw`flex-1`, styles.screen]} edges={["top", "bottom"]}>
      <View style={tw`flex-row items-center px-5 py-4`}>
        <Pressable
          style={tw`mr-3 p-1`}
          onPress={() => {
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          hitSlop={8}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={isDark ? "#ffffff" : "#171717"}
          />
        </Pressable>

        <Text style={[tw`text-2xl font-bold`, styles.primaryText]}>
          {t("settings.title")}
        </Text>
      </View>

      <View style={tw`px-5 pt-4`}>
        <Text style={[tw`text-lg font-semibold`, styles.primaryText]}>
          {t("settings.marketDataSource")}
        </Text>

        <Text style={[tw`mb-5 mt-2 text-sm`, styles.secondaryText]}>
          {t("settings.marketDataDescription")}
        </Text>

        <MarketModeSelector />
      </View>
    </SafeAreaView>
  );
}
