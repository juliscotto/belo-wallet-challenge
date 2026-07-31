import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import type { ErrorBoundaryProps } from "expo-router";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { QueryProvider } from "../app/providers/QueryProvider";
import "../core/i18n/i18n";
import { useAppTheme } from "../core/theme/useAppTheme";
import { useThemeStyles } from "../core/theme/useThemeStyles";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <RootErrorScreen message={error.message} onRetry={retry} />;
}

type RootErrorScreenProps = {
  message: string;
  onRetry: () => void;
};

function RootErrorScreen({ message, onRetry }: RootErrorScreenProps) {
  const { t } = useTranslation();
  const { styles } = useThemeStyles();

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        },
        styles.screen,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 22,
            fontWeight: "700",
            textAlign: "center",
          },
          styles.primaryText,
        ]}
      >
        {t("errors.unexpectedTitle")}
      </Text>

      {__DEV__ && (
        <Text
          style={[
            {
              marginTop: 12,
              textAlign: "center",
            },
            styles.secondaryText,
          ]}
        >
          {message}
        </Text>
      )}

      <Pressable
        style={{
          marginTop: 24,
          borderRadius: 16,
          backgroundColor: "#2563eb",
          paddingHorizontal: 24,
          paddingVertical: 14,
        }}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={t("errors.retry")}
      >
        <Text
          style={{
            color: "#ffffff",
            fontWeight: "600",
          }}
        >
          {t("errors.retry")}
        </Text>
      </Pressable>
    </View>
  );
}

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
