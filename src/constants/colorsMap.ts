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

export function getColorsMap(
  element: string
): Record<DialColors, Record<DailyCircles, string>> {
  return {
    gray: {
      primary: `${element}-zinc-500`,
      dawn: `${element}-dial-gray-dawn`,
      midday: `${element}-dial-gray-midday`,
      dusk: `${element}-dial-gray-dusk`,
      midnight: `${element}-dial-gray-midnight`,
      newday: `${element}-dial-gray-newday`,
    },
    pink: {
      primary: `${element}-pink-500`,
      dawn: `${element}-dial-pink-dawn`,
      midday: `${element}-dial-pink-midday`,
      dusk: `${element}-dial-pink-dusk`,
      midnight: `${element}-dial-pink-midnight`,
      newday: `${element}-dial-pink-newday`,
    },
    purple: {
      primary: `${element}-purple-500`,
      dawn: `${element}-dial-purple-dawn`,
      midday: `${element}-dial-purple-midday`,
      dusk: `${element}-dial-purple-dusk`,
      midnight: `${element}-dial-purple-midnight`,
      newday: `${element}-dial-purple-newday`,
    },
    blue: {
      primary: `${element}-blue-500`,
      dawn: `${element}-dial-blue-dawn`,
      midday: `${element}-dial-blue-midday`,
      dusk: `${element}-dial-blue-dusk`,
      midnight: `${element}-dial-blue-midnight`,
      newday: `${element}-dial-blue-newday`,
    },
    teal: {
      primary: `${element}-teal-500`,
      dawn: `${element}-dial-teal-dawn`,
      midday: `${element}-dial-teal-midday`,
      dusk: `${element}-dial-teal-dusk`,
      midnight: `${element}-dial-teal-midnight`,
      newday: `${element}-dial-teal-newday`,
    },
    indigo: {
      primary: `${element}-indigo-500`,
      dawn: `${element}-dial-indigo-dawn`,
      midday: `${element}-dial-indigo-midday`,
      dusk: `${element}-dial-indigo-dusk`,
      midnight: `${element}-dial-indigo-midnight`,
      newday: `${element}-dial-indigo-newday`,
    },
  };
}

const bgColorsMap = getColorsMap("bg");

export const dialColors = (Object.keys(bgColorsMap) as Array<DialColors>).map(
  (c) => ({
    name: c,
    primaryColor: bgColorsMap[c].primary,
  })
);
