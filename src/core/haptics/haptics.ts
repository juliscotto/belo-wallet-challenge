import * as Haptics from "expo-haptics";

export async function triggerSelectionHaptic(): Promise<void> {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics should never block the user flow.
  }
}

export async function triggerSuccessHaptic(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics should never block the user flow.
  }
}

export async function triggerErrorHaptic(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // Haptics should never block the user flow.
  }
}
