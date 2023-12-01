export function currentTime(timezoneName = getCurrentUserTimezoneName()) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    timeZone: timezoneName,
    day: "numeric",
    weekday: "short",
    month: "short",
  };

  return new Intl.DateTimeFormat("en-En", options).format(new Date());
}

export function getCurrentUserTimezoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const res = currentTime();

console.log(res);
