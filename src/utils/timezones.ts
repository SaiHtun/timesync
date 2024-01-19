import { format, formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { DialColors, colorsMap } from "~/constants/colorsMap";
import { arrayRange } from ".";
import { addDays } from "date-fns";
import { HoursFormat } from "~/atoms/hours-format";

export function isDecimal(hour: number) {
  return hour % 1 !== 0;
}

export function getDailyCircleColor(hour: number, dialColor: DialColors) {
  const dailyCircleColor = colorsMap[dialColor];
  if (hour >= 6 && hour <= 7.5) {
    return dailyCircleColor["dawn"];
  } else if (hour >= 8 && hour <= 17.5) {
    return dailyCircleColor["midday"];
  } else if (hour >= 18 && hour <= 21.5) {
    return dailyCircleColor["dusk"];
  } else if ((hour >= 22 && hour <= 23.5) || (hour >= 1 && hour <= 5.5)) {
    return dailyCircleColor["midnight"];
  } else {
    return dailyCircleColor["newday"];
  }
}

export function getHours24(timezoneName: string): number[] {
  const startHours24 = parseInt(
    formatInTimeZone(new Date(), timezoneName, "k")
  );
  return arrayRange(startHours24, startHours24 + 23).map(
    (num) => num % 24 || 24
  );
}
// getNextDay could return pre/next day base on if "numberOfDays"(+/-)
export function getNextDay(currentTime: string, numberOfDays = 1): string {
  // currentTime = "dayOfWeek, monthAndDay, year" ( without year would Error :D )
  const date = new Date(currentTime);
  const nextDay = format(addDays(date, numberOfDays), "eee, MMM d, y");
  return nextDay;
}

type TimeSlices = Array<"dayOfWeek" | "monthAndDay" | "year">;

export function formatTimezoneToDateString(
  timezone: ITimezone,
  timeSlices: TimeSlices
) {
  let timeString = "";
  for (const slice of timeSlices) {
    timeString += timeString ? `, ${timezone[slice]}` : `${timezone[slice]}`;
  }
  return timeString;
}

export function getTimeDials(
  timezone: ITimezone,
  dialColor: DialColors
): ITimeDial[] {
  const { name, hour24Clock, offset } = timezone;
  const hours24Array = getHours24(name);
  const startHours = parseInt(hour24Clock.split(" ")[0].split(":")[0]);
  const hours = arrayRange(startHours, startHours + 23);

  const currentTime = formatTimezoneToDateString(timezone, [
    "dayOfWeek",
    "monthAndDay",
    "year",
  ]);

  let startNewDay = false;

  const timeDials = hours.map((h, index) => {
    let hour = h;
    if (isDecimal(offset)) {
      hour += 0.5;
    }
    // handling 24/12 hours and edge cases coz some countries like Myanmar is off by -30mins
    const hour12 = hour % 12 === 0.5 ? 12.5 : hour % 12 || 12;
    const hour24 = hour % 24 === 0.5 ? 24.5 : hour % 24 || 24;

    const isNewDay = hours[index] === 24;
    if (isNewDay) {
      startNewDay = true;
    }

    const isLastHour = hours[index] === 23;
    const timeMeridian: "am" | "pm" = hour24 >= 12 ? "pm" : "am";
    const day = startNewDay ? getNextDay(currentTime) : currentTime;
    const dailyCircleBgColor = getDailyCircleColor(
      hours24Array[index],
      dialColor
    );

    return {
      isNewDay,
      hour12,
      hour24,
      timeMeridian,
      day,
      isLastHour,
      dailyCircleBgColor,
    };
  });

  return timeDials;
}

export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function diffHourFormat(diffHours: number) {
  return isDecimal(diffHours) ? diffHours.toFixed(1) : diffHours;
}

export function getDifferenceHoursFromHome(
  otherTimezoneName: string,
  homeTimezoneName = getCurrentUserTimezoneName()
) {
  const homeTimezone = new Date().toLocaleString("en-US", {
    timeZone: homeTimezoneName,
  });
  const otherTimezone = new Date().toLocaleString("en-US", {
    timeZone: otherTimezoneName,
  });

  const parsedHome = new Date(homeTimezone) as unknown as number;
  const parsedOther = new Date(otherTimezone) as unknown as number;

  const diffHours = (parsedOther - parsedHome) / (60 * 60 * 1000);

  return diffHours >= 0
    ? `+${diffHourFormat(diffHours)}`
    : `${diffHourFormat(diffHours)}`;
}

export function currentTime(
  timezoneName: string,
  hoursFormat: HoursFormat = "hour24"
) {
  const date = new Date();
  const hour = hoursFormat === "hour24" ? "k" : "h";
  const strFormat = `${hour}:mm a`;

  return formatInTimeZone(date, timezoneName, strFormat);
}

function getSupportedTimezonesName(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

export function populateTimezones(): ITimezone[] {
  const strFormat = `eee, MMM d, y, zzz, zzzz`;
  const date = new Date();

  return getSupportedTimezonesName().map((name) => {
    const now = formatInTimeZone(date, name, strFormat);
    const hour12Clock = currentTime(name, "hour12");
    const hour24Clock = currentTime(name, "hour24");
    const [dayOfWeek, monthAndDay, year, abbr, value] = now.split(", ");
    const offset = getTimezoneOffset(name, date) / (60 * 60 * 1_000);
    return {
      name,
      value,
      abbr,
      dayOfWeek,
      monthAndDay,
      year,
      hour12Clock,
      hour24Clock,
      offset,
      diffHoursFromHome: "",
      meetingHours: { start: [], end: [] },
      timeDials: [],
    };
  });
}

export function getTimezonesMap() {
  const map = new Map<string | "defaultTimezone", ITimezone>();
  const timezones = populateTimezones();
  timezones.forEach((timezone) => map.set(timezone.name, timezone));

  return map;
}

export function getLocalTime() {
  const res = formatInTimeZone(
    new Date(),
    getCurrentUserTimezoneName(),
    "eee, MMM d, y"
  );
  return res;
}
