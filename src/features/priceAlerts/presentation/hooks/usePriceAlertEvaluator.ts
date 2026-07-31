import { useEffect } from "react";

import { createNotificationId } from "../../../notifications/domain/createNotificationId";
import { useNotificationStore } from "../../../notifications/store/notificationStore";

import { MarketPrice } from "../../../market/domain/entities/MarketPrice";

import { shouldTriggerPriceAlert } from "../../domain/useCases/shouldTriggerPriceAlert";
import { usePriceAlertStore } from "../../store/priceAlertStore";

type UsePriceAlertEvaluatorParams = {
  prices: MarketPrice[] | undefined;
};

export function usePriceAlertEvaluator({
  prices,
}: UsePriceAlertEvaluatorParams) {
  const alerts = usePriceAlertStore((state) => state.alerts);

  const markAsTriggered = usePriceAlertStore((state) => state.markAsTriggered);

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    if (!prices?.length) {
      return;
    }

    const activeAlerts = alerts.filter((alert) => alert.isActive);

    for (const alert of activeAlerts) {
      const marketPrice = prices.find((price) => price.symbol === alert.symbol);

      if (!marketPrice) {
        continue;
      }

      const shouldTrigger = shouldTriggerPriceAlert(
        alert,
        marketPrice.priceUsd,
      );

      if (!shouldTrigger) {
        continue;
      }

      const triggeredAt = new Date().toISOString();

      markAsTriggered(alert.id, triggeredAt);

      addNotification({
        id: createNotificationId(),

        type: "PRICE_ALERT_TRIGGERED",

        createdAt: triggeredAt,

        isRead: false,

        data: {
          symbol: alert.symbol,

          targetPriceUsd: alert.targetPriceUsd,

          currentPriceUsd: marketPrice.priceUsd,

          condition: alert.condition,
        },
      });
    }
  }, [addNotification, alerts, markAsTriggered, prices]);
}
