import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { AppNotification } from "../../domain/entities/AppNotification";

type NotificationRowProps = {
  notification: AppNotification;
  onPress: () => void;
};

export function NotificationRow({
  notification,
  onPress,
}: NotificationRowProps) {
  const { t, i18n } = useTranslation();
  const { styles } = useThemeStyles();

  function getTitle(): string {
    switch (notification.type) {
      case "SWAP_COMPLETED":
        return t("notifications.swapCompleted.title");

      case "GENERAL":
        return t("notifications.general.title");
    }
  }

  function getDescription(): string {
    switch (notification.type) {
      case "SWAP_COMPLETED":
        return t("notifications.swapCompleted.description", {
          fromAmount: notification.data.fromAmount,
          fromSymbol: notification.data.fromSymbol,
          toAmount: notification.data.toAmount.toFixed(8),
          toSymbol: notification.data.toSymbol,
        });

      case "GENERAL":
        return t(notification.data.messageKey);
    }
  }

  const formattedDate = new Intl.DateTimeFormat(
    i18n.language === "es" ? "es-AR" : "en-US",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(new Date(notification.createdAt));

  return (
    <Pressable
      style={[
        tw`
          flex-row
          border-b
          py-4
        `,
        styles.border,
        !notification.isRead && styles.surface,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View
        style={tw`
          mr-4
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-blue-600
        `}
      >
        <Ionicons name="swap-horizontal" size={22} color="#ffffff" />
      </View>

      <View style={tw`flex-1`}>
        <View
          style={tw`
            flex-row
            items-start
            justify-between
          `}
        >
          <Text
            style={[
              tw`flex-1 text-base`,
              notification.isRead
                ? styles.primaryText
                : [tw`font-bold`, styles.primaryText],
            ]}
          >
            {getTitle()}
          </Text>

          {!notification.isRead && (
            <View
              style={tw`
                ml-2
                mt-1
                h-2
                w-2
                rounded-full
                bg-blue-500
              `}
            />
          )}
        </View>

        <Text style={[tw`mt-1 text-sm`, styles.secondaryText]}>
          {getDescription()}
        </Text>

        <Text style={[tw`mt-2 text-xs`, styles.secondaryText]}>
          {formattedDate}
        </Text>
      </View>
    </Pressable>
  );
}
