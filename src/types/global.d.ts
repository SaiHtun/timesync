interface IMeetingHours {
  start: string[];
  end: string[];
}

interface ITimezone {
  name: string;
  value: string;
  abbr: string;
  currentDate: string;
  hour12Clock: string;
  hour24Clock: string;
  meetingHours?: IMeetingHours;
  offset: number;
  diffHoursFromHome: string;
  timeDials: ITimeDial[];
}

interface ITimeDial {
  hour12: number;
  hour24: number;
  timeMeridian: "am" | "pm";
  day: string;
  isNewDay: boolean;
  isLastHour: boolean;
  dailyCircleBgColor: string;
}
