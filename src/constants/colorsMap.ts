export type DialColors =
  | "primary"
  | "indigo"
  | "pink"
  | "purple"
  | "blue"
  | "teal";
type DailyCircles = "dawn" | "midday" | "dusk" | "midnight" | "newday";

export const colorsMap: Record<DialColors, Record<DailyCircles, string>> = {
  primary: {
    dawn: "bg-dial-primary-dawn",
    midday: "bg-dial-primary-midday",
    dusk: "bg-dial-primary-dusk",
    midnight: "bg-dial-primary-midnight",
    newday: "bg-dial-primary-newday",
  },
  indigo: {
    dawn: "bg-dial-indigo-dawn",
    midday: "bg-dial-indigo-midday",
    dusk: "bg-dial-indigo-dusk",
    midnight: "bg-dial-indigo-midnight",
    newday: "bg-dial-indigo-newday",
  },
  pink: {
    dawn: "bg-dial-pink-dawn",
    midday: "bg-dial-pink-midday",
    dusk: "bg-dial-pink-dusk",
    midnight: "bg-dial-pink-midnight",
    newday: "bg-dial-pink-newday",
  },
  purple: {
    dawn: "bg-dial-purple-dawn",
    midday: "bg-dial-purple-midday",
    dusk: "bg-dial-purple-dusk",
    midnight: "bg-dial-purple-midnight",
    newday: "bg-dial-purple-newday",
  },
  blue: {
    dawn: "bg-dial-blue-dawn",
    midday: "bg-dial-blue-midday",
    dusk: "bg-dial-blue-dusk",
    midnight: "bg-dial-blue-midnight",
    newday: "bg-dial-blue-newday",
  },
  teal: {
    dawn: "bg-dial-teal-dawn",
    midday: "bg-dial-teal-midday",
    dusk: "bg-dial-teal-dusk",
    midnight: "bg-dial-teal-midnight",
    newday: "bg-dial-teal-newday",
  },
};

export const dialColors = (Object.keys(colorsMap) as Array<DialColors>).map(
  (c) => ({
    name: c,
    color: colorsMap[c].midnight,
    hoverColor: colorsMap[c].newday,
  })
);
