export type DialColors =
  | "gray"
  | "indigo"
  | "pink"
  | "purple"
  | "blue"
  | "teal";
type DailyCircles =
  | "primary"
  | "dawn"
  | "midday"
  | "dusk"
  | "midnight"
  | "newday";

export const colorsMap: Record<DialColors, Record<DailyCircles, string>> = {
  gray: {
    primary: "bg-zinc-500",
    dawn: "bg-dial-gray-dawn",
    midday: "bg-dial-gray-midday",
    dusk: "bg-dial-gray-dusk",
    midnight: "bg-dial-gray-midnight",
    newday: "bg-dial-gray-newday",
  },
  pink: {
    primary: "bg-pink-500",
    dawn: "bg-dial-pink-dawn",
    midday: "bg-dial-pink-midday",
    dusk: "bg-dial-pink-dusk",
    midnight: "bg-dial-pink-midnight",
    newday: "bg-dial-pink-newday",
  },
  purple: {
    primary: "bg-purple-500",
    dawn: "bg-dial-purple-dawn",
    midday: "bg-dial-purple-midday",
    dusk: "bg-dial-purple-dusk",
    midnight: "bg-dial-purple-midnight",
    newday: "bg-dial-purple-newday",
  },
  blue: {
    primary: "bg-blue-500",
    dawn: "bg-dial-blue-dawn",
    midday: "bg-dial-blue-midday",
    dusk: "bg-dial-blue-dusk",
    midnight: "bg-dial-blue-midnight",
    newday: "bg-dial-blue-newday",
  },
  teal: {
    primary: "bg-teal-500",
    dawn: "bg-dial-teal-dawn",
    midday: "bg-dial-teal-midday",
    dusk: "bg-dial-teal-dusk",
    midnight: "bg-dial-teal-midnight",
    newday: "bg-dial-teal-newday",
  },
  indigo: {
    primary: "bg-indigo-500",
    dawn: "bg-dial-indigo-dawn",
    midday: "bg-dial-indigo-midday",
    dusk: "bg-dial-indigo-dusk",
    midnight: "bg-dial-indigo-midnight",
    newday: "bg-dial-indigo-newday",
  },
};

export const dialColors = (Object.keys(colorsMap) as Array<DialColors>).map(
  (c) => ({
    name: c,
    primaryColor: colorsMap[c].primary,
  })
);
