import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { useAppTheme } from "../../../../core/theme/useAppTheme";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { usePriceAlertStore } from "../../store/priceAlertStore";

export function PriceAlertsScreen() {
  const { t } = useTranslation();

  const { styles } = useThemeStyles();

  const { isDark } = useAppTheme();

  const alerts = usePriceAlertStore((state) => state.alerts);

  const removeAlert = usePriceAlertStore((state) => state.removeAlert);

  return (
    <SafeAreaView style={[tw`flex-1`, styles.screen]} edges={["top", "bottom"]}>
      <View
        style={tw`
          flex-row
          items-center
          px-5
          py-4
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

        <Text
          style={[
            tw`
              flex-1
              text-2xl
              font-bold
            `,
            styles.primaryText,
          ]}
        >
          {t("priceAlerts.title")}
        </Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          tw`px-5 pb-6`,
          alerts.length === 0 && tw`flex-1`,
        ]}
        ItemSeparatorComponent={() => <View style={tw`h-3`} />}
        renderItem={({ item }) => (
          <View
            style={[
              tw`
                flex-row
                items-center
                rounded-2xl
                border
                p-4
              `,
              styles.border,
              styles.surface,
            ]}
          >
            <View style={tw`flex-1`}>
              <Text
                style={[
                  tw`
                    text-base
                    font-bold
                  `,
                  styles.primaryText,
                ]}
              >
                {item.symbol}
              </Text>

              <Text style={[tw`mt-1 text-sm`, styles.secondaryText]}>
                {t(
                  item.condition === "ABOVE"
                    ? "priceAlerts.listAbove"
                    : "priceAlerts.listBelow",
                  {
                    price: item.targetPriceUsd.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    }),
                  },
                )}
              </Text>

              <Text
                style={[
                  tw`mt-2 text-xs`,
                  item.isActive ? tw`text-blue-500` : tw`text-green-500`,
                ]}
              >
                {item.isActive
                  ? t("priceAlerts.active")
                  : t("priceAlerts.triggered")}
              </Text>
            </View>

            <Pressable
              style={tw`p-2`}
              onPress={() => {
                removeAlert(item.id);
              }}
              accessibilityRole="button"
              accessibilityLabel={t("priceAlerts.remove")}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </Pressable>
          </View>
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
              name="trending-up-outline"
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
              {t("priceAlerts.emptyTitle")}
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
              {t("priceAlerts.emptyDescription")}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
