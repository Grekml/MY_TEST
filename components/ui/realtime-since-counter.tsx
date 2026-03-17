import React, { useEffect, useState } from 'react';

type Props = {
  targetDate?: string;
};

 
const RealtimeSinceCounter: React.FC<Props> = ({ targetDate = '2025-06-18T15:25:00' }) => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Interpret the targetDate as local time components to respect client TZ
  let targetDateObj = new Date(targetDate);
  try {
    if (typeof targetDate === 'string' && targetDate.includes('T')) {
      const [datePart, timePart] = targetDate.split('T');
      const [year, month, day] = datePart.split('-').map((n) => parseInt(n, 10));
      const [hour, minute, second] = (timePart || '00:00:00').split(':').map((n) => parseInt(n, 10));
      targetDateObj = new Date(year, month - 1, day, hour, minute, second);
    }
  } catch {
    // Fallback to original parsing if any issue occurs
    targetDateObj = new Date(targetDate);
  }
  const target = targetDateObj.getTime();
  const diff = Math.max(0, target - now);

  const msInSec = 1000;
  const msInMin = msInSec * 60;
  const msInHour = msInMin * 60;
  const msInDay = msInHour * 24;

  const days = Math.floor(diff / msInDay);
  const hours = Math.floor((diff % msInDay) / msInHour);
  const minutes = Math.floor((diff % msInHour) / msInMin);
  const seconds = Math.floor((diff % msInMin) / msInSec);

  const pad = (n: number) => String(n).padStart(2, '0');

  
  const container: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(0,0,0,0.25)',
    color: '#ffd34d',
    fontWeight: 700,
    fontFamily: 'ui-sans-serif, system-ui, -apple-system',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
  };
  const label: React.CSSProperties = { fontSize: 12, opacity: 0.95, letterSpacing: 0.4 };
  const value: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' as any, fontSize: 14 };

  const display = `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div style={container} aria-label="Elapsed time since target date" role="timer">
      <span style={label}>Elapsed since 18 June 2025 15:25</span>
      <span style={value}>{display}</span>
    </div>
  );
};

export default RealtimeSinceCounter;
