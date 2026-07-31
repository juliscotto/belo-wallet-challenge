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
          rounded-2xl
          border
          px-4
          py-4
        `,
        styles.border,
        styles.surface,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${getTitle()}. ${getDescription()}`}
      accessibilityState={{
        selected: !notification.isRead,
      }}
    >
      <View
        style={tw`
          mr-4
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-blue-600
        `}
      >
        <Ionicons name="swap-horizontal" size={24} color="#ffffff" />
      </View>

      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-start`}>
          <Text
            style={[
              tw`flex-1 pr-3 text-base`,
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
                mt-1.5
                h-2.5
                w-2.5
                rounded-full
                bg-blue-500
              `}
            />
          )}
        </View>

        <Text style={[tw`mt-1 text-sm leading-5`, styles.secondaryText]}>
          {getDescription()}
        </Text>

        <Text style={[tw`mt-3 text-xs`, styles.secondaryText]}>
          {formattedDate}
        </Text>
      </View>
    </Pressable>
  );
}
