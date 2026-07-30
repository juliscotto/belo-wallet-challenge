import { Text, View } from "react-native";
import tw from "twrnc";

type NotificationBadgeProps = {
  count: number;
};

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) {
    return null;
  }

  const displayedCount = count > 99 ? "99+" : String(count);

  return (
    <View
      style={tw`
        absolute
        -right-2
        -top-2
        min-w-5
        items-center
        justify-center
        rounded-full
        bg-red-500
        px-1
      `}
    >
      <Text style={tw`text-xs font-bold text-white`}>{displayedCount}</Text>
    </View>
  );
}
