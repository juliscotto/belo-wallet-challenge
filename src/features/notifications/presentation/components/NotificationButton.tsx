import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import tw from "twrnc";

import { useAppTheme } from "../../../../core/theme/useAppTheme";
import { useNotificationStore } from "../../store/notificationStore";
import { NotificationBadge } from "./NotificationBadge";

export function NotificationButton() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();

  const unreadCount = useNotificationStore((state) =>
    state.notifications.reduce(
      (total, notification) => (notification.isRead ? total : total + 1),
      0,
    ),
  );

  return (
    <Pressable
      style={tw`relative p-2`}
      onPress={() => {
        router.push("/notifications");
      }}
      accessibilityRole="button"
      accessibilityLabel={
        unreadCount === 0
          ? t("notifications.open")
          : t("notifications.unreadCount", {
              count: unreadCount,
            })
      }
      accessibilityHint={
        unreadCount > 0
          ? t("notifications.unreadCount", {
              count: unreadCount,
            })
          : undefined
      }
      hitSlop={8}
    >
      <View style={tw`relative`}>
        <Ionicons
          name="notifications-outline"
          size={26}
          color={isDark ? "#ffffff" : "#171717"}
        />
        <NotificationBadge count={unreadCount} />
      </View>
    </Pressable>
  );
}
