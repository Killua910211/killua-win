'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import type { HealthLifeProgressSnapshot } from '@/app/lib/health';

const DAY_MS = 86_400_000;
const REFERENCE_YEARS = 80;
const REFERENCE_YEAR_DAYS = 365.2425;

function getReadout(snapshot: HealthLifeProgressSnapshot, nowMilliseconds: number) {
  const elapsedMilliseconds = snapshot.elapsedMilliseconds + Math.max(0, nowMilliseconds - snapshot.asOfMilliseconds);
  const percent = Math.min(
    100,
    (elapsedMilliseconds / (REFERENCE_YEARS * REFERENCE_YEAR_DAYS * DAY_MS)) * 100,
  );

  return { elapsedMilliseconds, percent };
}

function formatLifeDuration(elapsedMilliseconds: number) {
  const totalMinutes = Math.max(0, Math.floor(elapsedMilliseconds / 60_000));
  const minutesPerYear = REFERENCE_YEAR_DAYS * 24 * 60;
  const years = Math.floor(totalMinutes / minutesPerYear);
  const remainderAfterYears = totalMinutes - Math.floor(years * minutesPerYear);
  const days = Math.floor(remainderAfterYears / (24 * 60));
  const hours = Math.floor((remainderAfterYears % (24 * 60)) / 60);
  const minutes = remainderAfterYears % 60;
  const pad = (value: number) => value.toString().padStart(2, '0');

  return `${years}年${days}天${pad(hours)}小时${pad(minutes)}分`;
}

export function LifeProgress({ snapshot }: { snapshot: HealthLifeProgressSnapshot }) {
  const [nowMilliseconds, setNowMilliseconds] = useState(snapshot.asOfMilliseconds);

  useEffect(() => {
    const update = () => setNowMilliseconds(Date.now());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const readout = getReadout(snapshot, nowMilliseconds);
  const durationLabel = formatLifeDuration(readout.elapsedMilliseconds);
  const percentLabel = `${readout.percent.toFixed(1)}%`;
  const progressStyle = { '--life-progress': `${readout.percent}%` } as CSSProperties;

  return (
    <div className="health-life-progress">
      <div className="health-life-readout">
        <div>
          <span className="health-life-value-label">已存活</span>
          <strong>{durationLabel}</strong>
        </div>
        <span className="health-life-percent">{percentLabel}</span>
      </div>
      <div
        className="health-life-track"
        role="progressbar"
        aria-label={`已存活 ${durationLabel}，以 80 年作为参考刻度，当前 ${percentLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(readout.percent.toFixed(1))}
        style={progressStyle}
      >
        <span aria-hidden="true" />
      </div>
    </div>
  );
}
