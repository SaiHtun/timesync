interface IMeetingHours {
  start: string[];
  end: string[];
}

interface ITimezone {
  name: string;
  value: string;
  abbr: string;
  currentDate: string;
  hour12: string;
  hour24: string;
  meetingHours?: IMeetingHours;
  offset: number;
  diffHoursFromHome: string;
  timeDials: ITimeDial[];
}

type TimeMeriDian = "am" | "pm";

interface ITimeDial {
  hour12: number;
  hour24: number;
  timeMeridian: "am" | "pm";
  day: string;
  isNewDay: boolean;
  isLastHour: boolean;
  dailyCircleBgColor: string;
}
