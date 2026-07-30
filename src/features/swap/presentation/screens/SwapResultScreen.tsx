import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { useThemeStyles } from "../../../../core/theme/useThemeStyles";

import { useSwapStore } from "../../store/swapStore";

export function SwapResultScreen() {
  const { t } = useTranslation();
  const { styles } = useThemeStyles();

  const completedSwap = useSwapStore((state) => state.completedSwap);

  const clearCompletedSwap = useSwapStore((state) => state.clearCompletedSwap);

  if (!completedSwap) {
    return (
      <SafeAreaView
        style={[tw`flex-1 items-center justify-center p-5`, styles.screen]}
      >
        <Text style={[tw`text-center`, styles.primaryText]}>
          {t("swap.noCompletedSwap")}
        </Text>

        <Pressable
          style={tw`mt-6 rounded-2xl bg-blue-600 px-6 py-4`}
          onPress={() => {
            router.replace("/");
          }}
        >
          <Text style={tw`font-semibold text-white`}>
            {t("swap.backToPortfolio")}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  function handleFinish() {
    clearCompletedSwap();

    router.dismissAll();
    router.replace("/");
  }

  return (
    <SafeAreaView
      style={[tw`flex-1 items-center justify-center p-5`, styles.screen]}
      edges={["top", "bottom"]}
    >
      <View
        style={tw`h-20 w-20 items-center justify-center rounded-full bg-emerald-500`}
      >
        <Text style={tw`text-4xl text-white`}>✓</Text>
      </View>

      <Text
        style={[tw`mt-6 text-center text-2xl font-bold`, styles.primaryText]}
      >
        {t("swap.success")}
      </Text>

      <Text style={[tw`mt-3 text-center`, styles.secondaryText]}>
        {t("swap.exchanged")}
      </Text>

      <View style={[tw`mt-8 w-full rounded-3xl p-6`, styles.surface]}>
        <Text style={[tw`text-center text-lg`, styles.primaryText]}>
          {completedSwap.fromAmount} {completedSwap.fromSymbol}
        </Text>

        <Text style={[tw`my-3 text-center text-xl`, styles.secondaryText]}>
          ↓
        </Text>

        <Text style={[tw`text-center text-2xl font-bold`, styles.primaryText]}>
          {completedSwap.toAmount.toFixed(8)} {completedSwap.toSymbol}
        </Text>
      </View>

      <Pressable
        style={tw`mt-8 w-full items-center rounded-2xl bg-blue-600 p-4`}
        onPress={handleFinish}
        accessibilityRole="button"
      >
        <Text style={tw`text-base font-semibold text-white`}>
          {t("swap.backToPortfolio")}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
