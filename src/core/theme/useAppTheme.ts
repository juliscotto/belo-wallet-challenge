import { useColorScheme } from "react-native";

export type AppColorScheme = "light" | "dark";

export function useAppTheme() {
  const systemColorScheme = useColorScheme();

  const colorScheme: AppColorScheme =
    systemColorScheme === "dark" ? "dark" : "light";

  return {
    colorScheme,
    isDark: colorScheme === "dark",
  };
}
