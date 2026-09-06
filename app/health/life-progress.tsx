'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { HEALTH_BIRTH_AT_ISO, type HealthLifeProgressSnapshot } from '@/app/lib/health';
import { formatCalendarDuration } from './calendar-duration';

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

export function LifeProgress({ snapshot }: { snapshot: HealthLifeProgressSnapshot }) {
  const [nowMilliseconds, setNowMilliseconds] = useState(snapshot.asOfMilliseconds);

  useEffect(() => {
    const update = () => setNowMilliseconds(Date.now());
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const readout = getReadout(snapshot, nowMilliseconds);
  const durationLabel = formatCalendarDuration(Date.parse(HEALTH_BIRTH_AT_ISO), nowMilliseconds);
  const percentLabel = `${readout.percent.toFixed(1)}%`;
  const progressStyle = { '--life-progress': `${readout.percent}%` } as CSSProperties;

  return (
    <div className="health-life-progress">
      <div className="health-life-readout">
        <div>
          <span className="health-life-value-label">已存活</span>
          <strong>{durationLabel}</strong>
        </div>
        <span className="health-life-percent">
          <span className="health-life-percent-value">{percentLabel}</span>
          <span className="health-life-percent-note">/ 80 年展示刻度</span>
        </span>
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
