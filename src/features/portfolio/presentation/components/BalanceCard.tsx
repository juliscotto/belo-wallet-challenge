import { Text, View } from "react-native";
import tw from "twrnc";

import { useTranslation } from "react-i18next";
import { formatUsd } from "../../../../core/formatting/formatCurrency";
import { useAppTheme } from "../../../../core/theme/useAppTheme";

type BalanceCardProps = {
  totalBalanceUsd: number;
  isUpdating?: boolean;
};

export function BalanceCard({
  totalBalanceUsd,
  isUpdating = false,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  return (
    <View
      style={[
        tw`rounded-3xl p-6`,
        isDark ? tw`bg-neutral-800` : tw`bg-neutral-900`,
      ]}
      accessible
      accessibilityLabel={`Estimated balance ${formatUsd(totalBalanceUsd)}`}
    >
      <Text style={tw`text-sm text-neutral-400`} allowFontScaling>
        {t("portfolio.estimatedBalance")}
      </Text>

      <Text style={tw`mt-2 text-3xl font-bold text-white`} allowFontScaling>
        {formatUsd(totalBalanceUsd)}
      </Text>

      {isUpdating && (
        <Text style={tw`mt-2 text-sm text-neutral-400`}>
          {t("portfolio.updatingPrices")}
        </Text>
      )}
    </View>
  );
}
