'use client';

import { useEffect, useState } from 'react';
import { formatCalendarDuration } from './calendar-duration';

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

  const value = formatCalendarDuration(Date.parse(lastSmokingAtISO), now, { omitZeroYears: true });

  return (
    <dd className="health-smoking-streak-value" role="timer" aria-label={`当前连续戒烟 ${value}`}>
      {value}
    </dd>
  );
}
