import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../core/i18n/i18n";

import { QueryProvider } from "../app/providers/QueryProvider";
import { useAppTheme } from "../core/theme/useAppTheme";

export default function RootLayout() {
  const { isDark } = useAppTheme();

  const backgroundColor = isDark ? "#0a0a0a" : "#ffffff";

  return (
    <QueryProvider>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "default",
            contentStyle: {
              backgroundColor,
            },
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
