import { format, formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { DialColors, colorsMap } from "~/constants/colorsMap";
import { arrayRange } from ".";
import { addDays } from "date-fns";
import { HoursFormat } from "~/atoms/hours-format";

export function isDecimal(hour: number) {
  return hour % 1 !== 0;
}

export function getDailyCircleColor(
  hour: number,
  dialColor: DialColors,
  isNewDay: boolean
) {
  const dailyCircleColor = colorsMap[dialColor];
  if (isNewDay) {
    return dailyCircleColor["newday"];
  } else if (hour >= 6 && hour <= 7.5) {
    return dailyCircleColor["dawn"];
  } else if (hour >= 8 && hour <= 17.5) {
    return dailyCircleColor["midday"];
  } else if (hour >= 18 && hour <= 21.5) {
    return dailyCircleColor["dusk"];
  } else if ((hour >= 22 && hour <= 23.5) || (hour >= 1 && hour <= 5.5)) {
    return dailyCircleColor["midnight"];
  } else {
    return dailyCircleColor["dawn"];
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

function createHomeTimeDials(
  hours: number[],
  dialColor: DialColors,
  currentTimezone: ITimezone,
  homeSelectedTimezone: ITimezone
): ITimeDial[] {
  const { offset, diffHoursFromHome } = currentTimezone;
  return hours.map((hour, index) => {
    let h = hour;

    if (isDecimal(offset) || isDecimal(Number(diffHoursFromHome))) {
      h += 0.5;
    }

    const timeMeridian: TimeMeriDian = h >= 12 ? "pm" : "am";

    const hour12 = h % 12 === 0.5 ? 12.5 : h % 12 || 12;
    const hour24 = h % 24 === 0.5 ? 24.5 : h % 24 || 24;

    return {
      hour12,
      hour24,
      timeMeridian,
      dailyCircleBgColor: getDailyCircleColor(h, dialColor, index === 0),
      day: homeSelectedTimezone.currentDate,
      isLastHour: false,
      isNewDay: index === 0,
    };
  });
}

function createChildsTimeDials(
  hours: number[],
  dialColor: DialColors,
  currentTimezone: ITimezone,
  homeSelectedTimezone: ITimezone
) {
  return hours.map((_, index) => {
    const { currentDate, timeDials, diffHoursFromHome } = homeSelectedTimezone;
    const { name } = currentTimezone;
    const dial = timeDials[index];
    const hour = isDecimal(dial.hour12)
      ? `${Math.round(dial.hour12)}:30`
      : `${dial.hour12}:00`;
    const d = `${currentDate}, ${hour} ${dial.timeMeridian}`;

    const [h12, newDay] = formatInTimeZone(
      new Date(d),
      name,
      "h:aaa-eee, MMM d, y"
    ).split("-");

    const h24 = formatInTimeZone(new Date(d), name, "k-eee, MMM d, y").split(
      "-"
    )[0];

    function parsedHour(strHour: string) {
      const decimal =
        isDecimal(Number(diffHoursFromHome)) ||
        isDecimal(Number(currentTimezone.diffHoursFromHome));
      const parsedHour = Number(strHour);
      return decimal ? parsedHour + 0.5 : parsedHour;
    }

    const [h, timeMeridian] = h12.split(":");
    const hour12 = parsedHour(h);
    const hour24 = parsedHour(h24);

    let isNewDay =
      (timeMeridian === "am" && (hour12 === 12 || hour12 === 12.5)) ||
      hour24 === 24 ||
      hour24 === 24.5;
    let isLastHour =
      (timeMeridian === "pm" && (hour12 === 11 || hour12 === 11.5)) ||
      hour24 === 23 ||
      hour24 === 23.5;

    return {
      isNewDay,
      hour12,
      hour24,
      day: newDay,
      timeMeridian: timeMeridian as TimeMeriDian,
      dailyCircleBgColor: getDailyCircleColor(hour24, dialColor, isNewDay),
      isLastHour,
    };
  });
}

export function getTimeDials(
  timezone: ITimezone,
  dialColor: DialColors,
  homeSelectedTimezone: ITimezone,
  isHome = false
): ITimeDial[] {
  const hours = arrayRange(0, 23);
  let td = [] as ITimeDial[];
  if (isHome) {
    // home
    td = createHomeTimeDials(hours, dialColor, timezone, homeSelectedTimezone);
  } else {
    // children
    td = createChildsTimeDials(
      hours,
      dialColor,
      timezone,
      homeSelectedTimezone
    );
  }

  return td;
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
// eee, MMM d, y
export function populateTimezones(): ITimezone[] {
  const strFormat = `zzz, zzzz, eee, MMM d, y`;
  const date = new Date();

  return getSupportedTimezonesName().map((name) => {
    const now = formatInTimeZone(date, name, strFormat);
    const hour12 = currentTime(name, "hour12");
    const hour24 = currentTime(name, "hour24");
    const [abbr, value, ...currentDateArray] = now.split(", ");
    const currentDate = currentDateArray.join(", ");
    const offset = getTimezoneOffset(name, date) / (60 * 60 * 1_000);
    return {
      name,
      value,
      abbr,
      currentDate,
      hour12,
      hour24,
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
