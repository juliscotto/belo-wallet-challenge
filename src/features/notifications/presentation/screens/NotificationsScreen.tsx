import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { useAppTheme } from "../../../../core/theme/useAppTheme";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { useNotificationStore } from "../../store/notificationStore";
import { NotificationRow } from "../components/NotificationRow";

export function NotificationsScreen() {
  const { t } = useTranslation();
  const { styles } = useThemeStyles();
  const { isDark } = useAppTheme();

  const notifications = useNotificationStore((state) => state.notifications);

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <SafeAreaView style={[tw`flex-1`, styles.screen]} edges={["top", "bottom"]}>
      <View
        style={tw`
          flex-row
          items-center
          justify-between
          px-5
          py-4
        `}
      >
        <View
          style={tw`
            flex-row
            items-center
          `}
        >
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
            {t("notifications.title")}
          </Text>
        </View>

        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead} accessibilityRole="button">
            <Text
              style={tw`
                text-sm
                font-semibold
                text-blue-500
              `}
            >
              {t("notifications.markAllAsRead")}
            </Text>
          </Pressable>
        )}
      </View>

      <FlatList
        style={tw`flex-1`}
        contentContainerStyle={[
          tw`px-5`,
          notifications.length === 0 && tw`flex-1`,
        ]}
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationRow
            notification={item}
            onPress={() => {
              if (!item.isRead) {
                markAsRead(item.id);
              }
            }}
          />
        )}
        ListEmptyComponent={
          <View
            style={tw`
              flex-1
              items-center
              justify-center
              px-8
            `}
          >
            <Ionicons
              name="notifications-off-outline"
              size={52}
              color={isDark ? "#737373" : "#a3a3a3"}
            />

            <Text
              style={[
                tw`
                  mt-5
                  text-center
                  text-lg
                  font-semibold
                `,
                styles.primaryText,
              ]}
            >
              {t("notifications.emptyTitle")}
            </Text>

            <Text
              style={[
                tw`
                  mt-2
                  text-center
                  text-sm
                `,
                styles.secondaryText,
              ]}
            >
              {t("notifications.emptyDescription")}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
