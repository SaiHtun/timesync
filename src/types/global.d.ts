interface IStartEndHours {
  start: string[];
  end: string[];
}

interface IMeetingHoursThreshold {
  hour12: StartEndHours;
  hour24: StartEndHours;
}

interface ITimezone {
  name: string;
  value: string;
  abbr: string;
  date: string;
  hour12: string;
  hour24: string;
  totalMeetingMinutes: number;
  meetingHoursThreshold: IMeetingHoursThreshold;
  offset: number;
  diffHoursFromHome: string;
  timeDials: ITimeDial[];
}

type Period = "am" | "pm";

interface ITimeDial {
  hour12: number;
  hour24: number;
  period: Period;
  date: string;
  isNewDay: boolean;
  isLastHour: boolean;
  dailyCircleBgColor: string;
}
