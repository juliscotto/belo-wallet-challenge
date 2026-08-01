import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import { formatUsd } from "../../../../core/formatting/formatCurrency";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import {
    AssetSymbol,
    SUPPORTED_ASSETS,
} from "../../../market/domain/entities/Asset";
import { useAssetPrices } from "../../../market/presentation/hooks/useAssetPrices";
import { usePortfolioStore } from "../../../portfolio/store/portfolioStore";

import { AssetIcon } from "@/src/features/market/presentation/components/AssetIcon";
import { triggerErrorHaptic } from "../../../../core/haptics/haptics";
import { createSwapQuote } from "../../domain/useCases/createSwapQuote";
import {
    SwapValidationError,
    validateSwap,
} from "../../domain/useCases/validateSwap";
import { useSwapStore } from "../../store/swapStore";
import { AssetSelector } from "../components/AssetSelector";

const ASSET_SYMBOLS = Object.keys(SUPPORTED_ASSETS) as AssetSymbol[];

function isAssetSymbol(value: string | undefined): value is AssetSymbol {
  if (!value) {
    return false;
  }

  return ASSET_SYMBOLS.includes(value as AssetSymbol);
}

function parseAmountInput(value: string): number {
  const normalizedValue = value.trim().replace(",", ".");

  return Number(normalizedValue);
}

export function SwapScreen() {
  const { t } = useTranslation();
  const { styles, isDark } = useThemeStyles();

  const params = useLocalSearchParams<{
    fromSymbol?: string;
  }>();

  const initialFromSymbol = isAssetSymbol(params.fromSymbol)
    ? params.fromSymbol
    : "BTC";

  const initialToSymbol: AssetSymbol =
    initialFromSymbol === "ETH" ? "USDT" : "ETH";

  const [fromSymbol, setFromSymbol] = useState<AssetSymbol>(initialFromSymbol);

  const [toSymbol, setToSymbol] = useState<AssetSymbol>(initialToSymbol);

  const [amountText, setAmountText] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const balances = usePortfolioStore((state) => state.balances);

  const setPendingQuote = useSwapStore((state) => state.setPendingQuote);

  const pricesQuery = useAssetPrices([fromSymbol, toSymbol]);

  const fromAmount = parseAmountInput(amountText);

  const fromPrice = pricesQuery.data?.find(
    (price) => price.symbol === fromSymbol,
  );

  const toPrice = pricesQuery.data?.find((price) => price.symbol === toSymbol);

  const availableBalance = balances[fromSymbol];

  const validationError = useMemo<SwapValidationError | null>(() => {
    if (amountText.trim() === "") {
      return "INVALID_AMOUNT";
    }

    return validateSwap({
      fromSymbol,
      toSymbol,
      amount: fromAmount,
      availableBalance,
      fromPriceUsd: fromPrice?.priceUsd,
      toPriceUsd: toPrice?.priceUsd,
    });
  }, [
    amountText,
    availableBalance,
    fromAmount,
    fromPrice?.priceUsd,
    fromSymbol,
    toPrice?.priceUsd,
    toSymbol,
  ]);

  const quote = useMemo(() => {
    if (
      !fromPrice ||
      !toPrice ||
      !Number.isFinite(fromAmount) ||
      fromAmount <= 0
    ) {
      return null;
    }

    return createSwapQuote({
      fromSymbol,
      toSymbol,
      fromAmount,
      fromPriceUsd: fromPrice.priceUsd,
      toPriceUsd: toPrice.priceUsd,
    });
  }, [fromAmount, fromPrice, fromSymbol, toPrice, toSymbol]);

  function getValidationMessage(error: SwapValidationError): string {
    switch (error) {
      case "INVALID_AMOUNT":
        return t("swap.errors.invalidAmount");

      case "SAME_ASSET":
        return t("swap.errors.sameAsset");

      case "INSUFFICIENT_BALANCE":
        return t("swap.errors.insufficientBalance");

      case "INVALID_PRICE":
        return t("swap.errors.invalidPrice");

      case "BELOW_MINIMUM_AMOUNT":
        return t("swap.errors.belowMinimumAmount");
    }
  }

  function handleContinue() {
    setHasSubmitted(true);

    if (validationError || !quote) {
      void triggerErrorHaptic();
      return;
    }

    setPendingQuote(quote);

    router.push("/swap/confirm");
  }

  function handleFromSymbolChange(symbol: AssetSymbol) {
    setFromSymbol(symbol);
    setHasSubmitted(false);

    if (symbol === toSymbol) {
      const replacement = ASSET_SYMBOLS.find((item) => item !== symbol);

      if (replacement) {
        setToSymbol(replacement);
      }
    }
  }

  function handleToSymbolChange(symbol: AssetSymbol) {
    setToSymbol(symbol);
    setHasSubmitted(false);
  }

  if (pricesQuery.isPending) {
    return (
      <SafeAreaView
        style={[tw`flex-1 items-center justify-center`, styles.screen]}
      >
        <ActivityIndicator color={isDark ? "#ffffff" : "#171717"} />

        <Text style={[tw`mt-3`, styles.secondaryText]}>
          {t("swap.loadingPrices")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1`, styles.screen]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={tw`p-5 pb-10`}
        >
          <View style={tw`mb-6 flex-row items-center`}>
            <Pressable
              onPress={() => {
                router.back();
              }}
              accessibilityRole="button"
            >
              <Text style={[tw`mr-4 text-2xl`, styles.primaryText]}>‹</Text>
            </Pressable>

            <Text style={[tw`text-2xl font-bold`, styles.primaryText]}>
              {t("swap.title")}
            </Text>
          </View>

          <AssetSelector
            label={t("swap.from")}
            selectedSymbol={fromSymbol}
            excludedSymbol={toSymbol}
            onSelect={handleFromSymbolChange}
          />

          <Text style={[tw`mb-2 mt-5 text-sm`, styles.secondaryText]}>
            {t("swap.amount")}
          </Text>

          <View
            style={[
              tw`flex-row items-center rounded-2xl border px-4`,
              styles.surface,
              styles.border,
            ]}
          >
            <TextInput
              testID="swap-amount-input"
              style={[tw`flex-1 py-4 text-xl`, styles.primaryText]}
              value={amountText}
              onChangeText={(value) => {
                const sanitizedValue = value
                  .replace(",", ".")
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*)\./g, "$1");

                setAmountText(sanitizedValue);
                setHasSubmitted(false);
              }}
              keyboardType="decimal-pad"
              inputMode="decimal"
              placeholder="0"
              placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
              autoCorrect={false}
              accessibilityLabel={t("swap.amount")}
              accessibilityHint={t("swap.amountAccessibilityHint")}
            />

            <Text
              style={[tw`ml-3 text-base font-semibold`, styles.primaryText]}
            >
              {fromSymbol}
            </Text>
          </View>

          <View style={tw`mt-2 flex-row justify-between`}>
            <Text style={[tw`text-sm`, styles.secondaryText]}>
              {t("swap.availableBalance")}
            </Text>

            <Pressable
              onPress={() => {
                setAmountText(String(availableBalance));

                setHasSubmitted(false);
              }}
            >
              <Text style={tw`text-sm font-semibold text-blue-500`}>
                {availableBalance} {fromSymbol}
              </Text>
            </Pressable>
          </View>

          <View style={tw`mt-6`}>
            <AssetSelector
              label={t("swap.to")}
              selectedSymbol={toSymbol}
              excludedSymbol={fromSymbol}
              onSelect={handleToSymbolChange}
            />
          </View>

          <View style={[tw`mt-6 rounded-2xl p-5`, styles.surface]}>
            <Text style={[tw`text-sm`, styles.secondaryText]}>
              {t("swap.estimatedAmount")}
            </Text>

            <View style={tw`mt-2 flex-row items-center`}>
              <AssetIcon symbol={toSymbol} size={30} />

              <Text style={[tw`ml-3 text-2xl font-bold`, styles.primaryText]}>
                {quote
                  ? `${quote.toAmount.toFixed(8)} ${quote.toSymbol}`
                  : `— ${toSymbol}`}
              </Text>
            </View>

            {quote && (
              <>
                <Text style={[tw`mt-3 text-sm`, styles.secondaryText]}>
                  {formatUsd(quote.fromAmount * quote.fromPriceUsd)}
                </Text>

                <Text style={[tw`mt-3 text-sm`, styles.secondaryText]}>
                  1 {fromSymbol} = {quote.exchangeRate.toFixed(8)} {toSymbol}
                </Text>
              </>
            )}
          </View>

          {pricesQuery.isError && (
            <Text style={tw`mt-4 text-sm text-red-500`}>
              {t("swap.errors.invalidPrice")}
            </Text>
          )}

          {hasSubmitted && validationError && (
            <Text
              style={tw`mt-4 text-sm text-red-500`}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
            >
              {getValidationMessage(validationError)}
            </Text>
          )}

          <Pressable
            style={[
              tw`mt-8 items-center rounded-2xl p-4`,
              pricesQuery.isError ? tw`bg-neutral-400` : tw`bg-blue-600`,
            ]}
            disabled={pricesQuery.isError}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel={t("swap.continue")}
            accessibilityState={{
              disabled: pricesQuery.isError,
            }}
          >
            <Text style={tw`text-base font-semibold text-white`}>
              {t("swap.continue")}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
