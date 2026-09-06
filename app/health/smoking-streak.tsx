'use client';

import { useEffect, useState } from 'react';

const DAY_MS = 86_400_000;
const SMOKING_TIME_ZONE = 'Asia/Shanghai';

type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const timeFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SMOKING_TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
});

function getDateTimeParts(milliseconds: number): DateTimeParts {
  const values = Object.fromEntries(
    timeFormatter
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

function formatDuration(startMilliseconds: number, nowMilliseconds: number) {
  const start = getDateTimeParts(startMilliseconds);
  const end = getDateTimeParts(Math.max(startMilliseconds, nowMilliseconds));

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

  return `${years}年${months}月${days}天${pad(hours)}小时${pad(minutes)}分${pad(seconds)}秒`;
}

export function SmokingStreak({
  lastSmokingAtISO,
  initialNowMilliseconds,
}: {
  lastSmokingAtISO: string;
  initialNowMilliseconds: number;
}) {
  const [now, setNow] = useState(initialNowMilliseconds);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const value = formatDuration(Date.parse(lastSmokingAtISO), now);

  return (
    <dd className="health-smoking-streak-value" role="timer" aria-label={`当前连续戒烟 ${value}`}>
      {value}
    </dd>
  );
}
