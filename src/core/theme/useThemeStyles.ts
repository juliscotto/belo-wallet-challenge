import { darkThemeStyles, lightThemeStyles } from "./themeStyles";
import { useAppTheme } from "./useAppTheme";

export function useThemeStyles() {
  const { colorScheme, isDark } = useAppTheme();

  return {
    colorScheme,
    isDark,
    styles: isDark ? darkThemeStyles : lightThemeStyles,
  };
}
