const DAY_MS = 86_400_000;

type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function getDateTimeParts(milliseconds: number, timeZone: string): DateTimeParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  });
  const values = Object.fromEntries(
    formatter
      .formatToParts(new Date(milliseconds))
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function toComparableMilliseconds(value: DateTimeParts) {
  return Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute, value.second);
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function addYearsAndMonths(value: DateTimeParts, years: number, months: number): DateTimeParts {
  const year = value.year + years + Math.floor((value.month - 1 + months) / 12);
  const month = ((value.month - 1 + months) % 12) + 1;

  return {
    ...value,
    year,
    month,
    day: Math.min(value.day, daysInMonth(year, month)),
  };
}

type FormatCalendarDurationOptions = {
  omitZeroYears?: boolean;
  timeZone?: string;
};

/** 按指定时区的日历单位计算时长，避免把固定天数误算为一个月。 */
export function formatCalendarDuration(
  startMilliseconds: number,
  endMilliseconds: number,
  { omitZeroYears = false, timeZone = 'Asia/Shanghai' }: FormatCalendarDurationOptions = {},
) {
  const start = getDateTimeParts(startMilliseconds, timeZone);
  const end = getDateTimeParts(Math.max(startMilliseconds, endMilliseconds), timeZone);

  let years = end.year - start.year;
  let remainder = addYearsAndMonths(start, years, 0);
  if (toComparableMilliseconds(remainder) > toComparableMilliseconds(end)) {
    years -= 1;
    remainder = addYearsAndMonths(start, years, 0);
  }

  let months = (end.year - remainder.year) * 12 + end.month - remainder.month;
  let afterMonths = addYearsAndMonths(remainder, 0, months);
  if (toComparableMilliseconds(afterMonths) > toComparableMilliseconds(end)) {
    months -= 1;
    afterMonths = addYearsAndMonths(remainder, 0, months);
  }

  const remainingSeconds = Math.floor(
    (toComparableMilliseconds(end) - toComparableMilliseconds(afterMonths)) / 1_000,
  );
  const days = Math.floor(remainingSeconds / (DAY_MS / 1_000));
  const hours = Math.floor((remainingSeconds % (DAY_MS / 1_000)) / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);
  const seconds = remainingSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, '0');
  const yearsLabel = omitZeroYears && years === 0 ? '' : `${years}年`;

  return `${yearsLabel}${months}月${days}天${pad(hours)}小时${pad(minutes)}分${pad(seconds)}秒`;
}
