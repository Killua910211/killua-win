'use client';

import { useEffect, useState } from 'react';

function formatDuration(elapsedMilliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMilliseconds / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, '0');

  return `${days}天${pad(hours)}小时${pad(minutes)}分${pad(seconds)}秒`;
}

export function SmokingStreak({ lastSmokingAtISO }: { lastSmokingAtISO: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const elapsed = now === null ? 0 : now - Date.parse(lastSmokingAtISO);
  const value = now === null ? '计算中…' : formatDuration(elapsed);

  return (
    <dd className="health-smoking-streak-value" role="timer" aria-label={`当前连续戒烟 ${value}`}>
      {value}
    </dd>
  );
}
