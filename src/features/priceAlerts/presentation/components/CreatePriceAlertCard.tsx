import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";
import tw from "twrnc";

import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { AssetSymbol } from "../../../market/domain/entities/Asset";

import { createPriceAlertId } from "../../domain/createPriceAlertId";
import { PriceAlertCondition } from "../../domain/entities/PriceAlert";
import {
    PriceAlertValidationError,
    validatePriceAlert,
} from "../../domain/useCases/validatePriceAlert";
import { usePriceAlertStore } from "../../store/priceAlertStore";

type CreatePriceAlertCardProps = {
  symbol: AssetSymbol;
  currentPriceUsd: number;
};

function parsePriceInput(value: string): number {
  return Number(value.trim().replace(",", "."));
}

export function CreatePriceAlertCard({
  symbol,
  currentPriceUsd,
}: CreatePriceAlertCardProps) {
  const { t } = useTranslation();

  const { styles, isDark } = useThemeStyles();

  const addAlert = usePriceAlertStore((state) => state.addAlert);

  const [condition, setCondition] = useState<PriceAlertCondition>("ABOVE");

  const [targetText, setTargetText] = useState("");

  const [validationError, setValidationError] =
    useState<PriceAlertValidationError | null>(null);

  const [wasCreated, setWasCreated] = useState(false);

  function handleCreateAlert() {
    const targetPriceUsd = parsePriceInput(targetText);

    const error = validatePriceAlert({
      targetPriceUsd,
    });

    setValidationError(error);

    if (error) {
      return;
    }

    addAlert({
      id: createPriceAlertId(),

      symbol,

      targetPriceUsd,

      condition,

      createdAt: new Date().toISOString(),

      isActive: true,

      triggeredAt: null,
    });

    setWasCreated(true);
    setTargetText("");
  }

  return (
    <View style={[tw`mt-6 rounded-3xl p-5`, styles.surface]}>
      <Text style={[tw`text-lg font-bold`, styles.primaryText]}>
        {t("priceAlerts.createTitle")}
      </Text>

      <Text style={[tw`mt-2 text-sm`, styles.secondaryText]}>
        {t("priceAlerts.currentPrice", {
          price: currentPriceUsd.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          }),
        })}
      </Text>

      <View style={tw`mt-5 flex-row gap-3`}>
        <AlertConditionButton
          label={t("priceAlerts.above")}
          selected={condition === "ABOVE"}
          onPress={() => {
            setCondition("ABOVE");
            setWasCreated(false);
          }}
        />

        <AlertConditionButton
          label={t("priceAlerts.below")}
          selected={condition === "BELOW"}
          onPress={() => {
            setCondition("BELOW");
            setWasCreated(false);
          }}
        />
      </View>

      <Text style={[tw`mb-2 mt-5 text-sm`, styles.secondaryText]}>
        {t("priceAlerts.targetPrice")}
      </Text>

      <View
        style={[
          tw`
            flex-row
            items-center
            rounded-2xl
            border
            px-4
          `,
          styles.border,
        ]}
      >
        <Text style={[tw`mr-2 text-lg`, styles.secondaryText]}>$</Text>

        <TextInput
          style={[tw`flex-1 py-4 text-lg`, styles.primaryText]}
          value={targetText}
          onChangeText={(value) => {
            const sanitizedValue = value
              .replace(",", ".")
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1");

            setTargetText(sanitizedValue);

            setValidationError(null);

            setWasCreated(false);
          }}
          keyboardType="decimal-pad"
          inputMode="decimal"
          placeholder="0.00"
          placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
          accessibilityLabel={t("priceAlerts.targetPrice")}
        />
      </View>

      {validationError && (
        <Text
          style={tw`
            mt-3
            text-sm
            text-red-500
          `}
          accessibilityRole="alert"
        >
          {t("priceAlerts.errors.invalidTargetPrice")}
        </Text>
      )}

      {wasCreated && (
        <Text
          style={tw`
            mt-3
            text-sm
            text-green-500
          `}
          accessibilityLiveRegion="polite"
        >
          {t("priceAlerts.created")}
        </Text>
      )}

      <Pressable
        style={tw`
          mt-5
          items-center
          rounded-2xl
          bg-blue-600
          p-4
        `}
        onPress={handleCreateAlert}
        accessibilityRole="button"
        accessibilityLabel={t("priceAlerts.createAction")}
      >
        <Text
          style={tw`
            font-semibold
            text-white
          `}
        >
          {t("priceAlerts.createAction")}
        </Text>
      </Pressable>
    </View>
  );
}

type AlertConditionButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function AlertConditionButton({
  label,
  selected,
  onPress,
}: AlertConditionButtonProps) {
  const { styles } = useThemeStyles();

  return (
    <Pressable
      style={[
        tw`
          flex-1
          items-center
          rounded-xl
          border
          px-3
          py-3
        `,
        styles.border,
        selected
          ? tw`
              border-blue-600
              bg-blue-600
            `
          : styles.surface,
      ]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{
        selected,
      }}
    >
      <Text
        style={[
          tw`font-semibold`,
          selected ? tw`text-white` : styles.primaryText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
