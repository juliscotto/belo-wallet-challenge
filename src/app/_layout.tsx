import { QueryProvider } from "@/src/app/providers/QueryProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useAppTheme } from "./../core/theme/useAppTheme";

import "../core/i18n/i18n";

export default function RootLayout() {
  const { isDark } = useAppTheme();
  return (
    <QueryProvider>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
