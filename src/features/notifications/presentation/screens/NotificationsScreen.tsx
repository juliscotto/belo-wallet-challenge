import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Animated, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { useEffect, useRef, useState } from "react";
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

  const [showMarkAll, setShowMarkAll] = useState(unreadCount > 0);

  const [hasMarkedAll, setHasMarkedAll] = useState(false);

  const markAllOpacity = useRef(new Animated.Value(1)).current;

  const markAllScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (unreadCount > 0) {
      setShowMarkAll(true);
      setHasMarkedAll(false);

      markAllOpacity.setValue(1);
      markAllScale.setValue(1);
    }
  }, [unreadCount, markAllOpacity, markAllScale]);

  function handleMarkAllAsRead() {
    if (hasMarkedAll) {
      return;
    }

    markAllAsRead();
    setHasMarkedAll(true);

    Animated.sequence([
      Animated.spring(markAllScale, {
        toValue: 1.06,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),

      Animated.spring(markAllScale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),

      Animated.delay(700),

      Animated.timing(markAllOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMarkAll(false);
    });
  }
  return (
    <SafeAreaView style={[tw`flex-1`, styles.screen]} edges={["top", "bottom"]}>
      <View style={tw`px-5 pb-4 pt-3`}>
        <View style={tw`flex-row items-center`}>
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

          <Text style={[tw`flex-1 text-2xl font-bold`, styles.primaryText]}>
            {t("notifications.title")}
          </Text>
        </View>

        {showMarkAll && (
          <Animated.View
            style={[
              tw`mt-3 items-end`,
              {
                opacity: markAllOpacity,
                transform: [
                  {
                    scale: markAllScale,
                  },
                ],
              },
            ]}
          >
            <Pressable
              style={[
                tw`
          flex-row
          items-center
          rounded-full
          px-3
          py-2
        `,
                hasMarkedAll ? tw`bg-green-500/15` : tw`bg-blue-500/10`,
              ]}
              onPress={handleMarkAllAsRead}
              disabled={hasMarkedAll}
              accessibilityRole="button"
              accessibilityLabel={
                hasMarkedAll
                  ? t("notifications.allMarkedAsRead")
                  : t("notifications.markAllAsRead")
              }
              accessibilityState={{
                disabled: hasMarkedAll,
              }}
              accessibilityLiveRegion="polite"
              hitSlop={8}
            >
              <Ionicons
                name={
                  hasMarkedAll ? "checkmark-circle" : "checkmark-done-outline"
                }
                size={18}
                color={hasMarkedAll ? "#22c55e" : "#3b82f6"}
              />

              <Text
                style={[
                  tw`ml-2 text-sm font-semibold`,
                  hasMarkedAll ? tw`text-green-500` : tw`text-blue-500`,
                ]}
              >
                {hasMarkedAll
                  ? t("notifications.allMarkedAsRead")
                  : t("notifications.markAllAsRead")}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>

      <FlatList
        style={tw`flex-1`}
        contentContainerStyle={[
          tw`px-5 pb-6`,
          notifications.length === 0 && tw`flex-1`,
        ]}
        data={notifications}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={tw`h-3`} />}
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
                tw`mt-5 text-center text-lg font-semibold`,
                styles.primaryText,
              ]}
            >
              {t("notifications.emptyTitle")}
            </Text>

            <Text style={[tw`mt-2 text-center text-sm`, styles.secondaryText]}>
              {t("notifications.emptyDescription")}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
