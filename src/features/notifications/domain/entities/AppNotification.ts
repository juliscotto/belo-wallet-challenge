import { AssetSymbol } from "../../../market/domain/entities/Asset";

export type NotificationType = "SWAP_COMPLETED" | "GENERAL";

export type SwapCompletedNotificationData = {
  fromSymbol: AssetSymbol;
  toSymbol: AssetSymbol;
  fromAmount: number;
  toAmount: number;
};

export type GeneralNotificationData = {
  messageKey: string;
};

export type PriceAlertTriggeredNotificationData = {
  symbol: AssetSymbol;
  targetPriceUsd: number;
  currentPriceUsd: number;
  condition: "ABOVE" | "BELOW";
};

export type AppNotification =
  | {
      id: string;
      type: "SWAP_COMPLETED";
      createdAt: string;
      isRead: boolean;
      data: SwapCompletedNotificationData;
    }
  | {
      id: string;
      type: "GENERAL";
      createdAt: string;
      isRead: boolean;
      data: GeneralNotificationData;
    }
  | {
      id: string;
      type: "PRICE_ALERT_TRIGGERED";
      createdAt: string;
      isRead: boolean;
      data: PriceAlertTriggeredNotificationData;
    };
