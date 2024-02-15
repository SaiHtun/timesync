import { format, formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { DialColors, colorsMap } from "~/constants/colorsMap";
import { arrayRange } from ".";
import { addDays, addMinutes } from "date-fns";
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
export function getNextDay(
  currentTime: string,
  numberOfDays = 1,
  formatStr = "eee, MMM d, y"
): string {
  // currentTime = "dayOfWeek, monthAndDay, year" ( without year would Error :D )
  const date = new Date(currentTime);
  const nextDay = format(addDays(date, numberOfDays), formatStr);
  return nextDay;
}

function transformNumHoursToStrHours(hours: number): string {
  if (isDecimal(hours)) {
    return String(Math.floor(hours)) + ":30";
  }

  return String(hours) + ":00";
}

function createHomeTimeDials(
  hours: number[],
  dialColor: DialColors,
  homeSelectedTimezone: ITimezone
): ITimeDial[] {
  return hours.map((hour, index) => {
    const timeMeridian: TimeMeriDian = hour >= 12 ? "pm" : "am";

    const hour12 = hour % 12;
    const hour24 = hour % 24;

    const date = `${homeSelectedTimezone.date}, ${transformNumHoursToStrHours(
      hour24
    )}`;

    const isLastHour =
      (timeMeridian === "pm" && (hour12 === 11 || hour12 === 11.5)) ||
      hour24 === 23 ||
      hour24 === 23.5;

    return {
      isNewDay: index === 0,
      hour12,
      hour24,
      date,
      timeMeridian,
      dailyCircleBgColor: getDailyCircleColor(hour, dialColor, index === 0),
      isLastHour,
    };
  });
}

function convertTo12HourFormat(hour: number) {
  if (hour > 12.5) {
    return hour - 12;
  } else if (hour === 0) {
    return 12;
  } else {
    return hour;
  }
}

function createChildsTimeDials(
  hours: number[],
  dialColor: DialColors,
  currentTimezone: ITimezone,
  homeSelectedTimezone: ITimezone
) {
  const { timeDials, offset: homeTzOffset } = homeSelectedTimezone;
  return hours.map((_, index) => {
    const { offset: currentTzOffset } = currentTimezone;
    const homeTimeDial = timeDials[index];

    const newDate = addMinutes(
      new Date(homeTimeDial.date),
      (currentTzOffset - homeTzOffset) * 60
    );

    const isOffsetDecimal =
      isDecimal(homeTzOffset) || isDecimal(currentTzOffset);

    const hour24 = newDate.getHours() + (isOffsetDecimal ? 0.5 : 0);
    const hour12 = convertTo12HourFormat(hour24);
    const timeMeridian = (hour24 >= 12 ? "pm" : "am") as TimeMeriDian;

    const formatStr = `eee, MMM d, y, H:mm`;
    const date = format(newDate, formatStr);

    const isNewDay =
      (timeMeridian === "am" && (hour12 === 0 || hour12 === 0.5)) ||
      hour24 === 0 ||
      hour24 === 0.5;

    const isLastHour =
      (timeMeridian === "pm" && (hour12 === 11 || hour12 === 11.5)) ||
      hour24 === 23 ||
      hour24 === 23.5;

    return {
      isNewDay,
      hour12,
      hour24,
      date,
      timeMeridian,
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
  if (isHome || !homeSelectedTimezone) {
    // home
    td = createHomeTimeDials(hours, dialColor, timezone);
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
  const d = new Date();

  return getSupportedTimezonesName().map((name) => {
    const now = formatInTimeZone(d, name, strFormat);
    const hour12 = currentTime(name, "hour12");
    const hour24 = currentTime(name, "hour24");
    const [abbr, value, ...currentDateArray] = now.split(", ");
    const date = currentDateArray.join(", ");
    const offset = getTimezoneOffset(name, d) / (60 * 60 * 1_000);
    return {
      name,
      value,
      abbr,
      date,
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

export function getLocalTime(
  formatStr: string = "eee, MMM d, y, h:mm aaa, zzz"
) {
  const res = formatInTimeZone(
    new Date(),
    getCurrentUserTimezoneName(),
    formatStr
  );
  return res;
}

export function arrangeHomeFirstTimezonesName(timezonesName: string[]) {
  const currentTimezoneName = getCurrentUserTimezoneName();
  const firstTimezoneName = timezonesName[0];
  if (
    !timezonesName.includes(currentTimezoneName) ||
    currentTimezoneName === firstTimezoneName
  )
    return timezonesName;

  const homeIndex = timezonesName.indexOf(currentTimezoneName);
  [timezonesName[0], timezonesName[homeIndex]] = [
    timezonesName[homeIndex],
    firstTimezoneName,
  ];

  return timezonesName;
}
