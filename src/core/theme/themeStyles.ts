import tw from "twrnc";

export const lightThemeStyles = {
  screen: tw`bg-white`,
  surface: tw`bg-neutral-100`,
  card: tw`bg-neutral-900`,
  primaryText: tw`text-neutral-950`,
  secondaryText: tw`text-neutral-500`,
  border: tw`border-neutral-200`,
  elevatedSurface: tw`bg-white`,
  input: tw`bg-neutral-100`,
};

export const darkThemeStyles = {
  screen: tw`bg-neutral-950`,
  surface: tw`bg-neutral-900`,
  card: tw`bg-neutral-800`,
  primaryText: tw`text-white`,
  secondaryText: tw`text-neutral-400`,
  border: tw`border-neutral-800`,
  elevatedSurface: tw`bg-neutral-800`,
  input: tw`bg-neutral-900`,
};
