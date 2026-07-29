import { QueryProvider } from "@/src/app/providers/QueryProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack />
    </QueryProvider>
  );
}
