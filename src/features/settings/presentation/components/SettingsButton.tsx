import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import tw from "twrnc";

import { useAppTheme } from "../../../../core/theme/useAppTheme";

export function SettingsButton() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();

  return (
    <Pressable
      style={tw`p-2`}
      onPress={() => {
        router.push("/settings");
      }}
      accessibilityRole="button"
      accessibilityLabel={t("settings.open")}
      hitSlop={8}
    >
      <Ionicons
        name="settings-outline"
        size={26}
        color={isDark ? "#ffffff" : "#171717"}
      />
    </Pressable>
  );
}
