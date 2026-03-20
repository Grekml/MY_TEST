"use client";
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useState } from "react";
import { HomeChartShell } from "@/components/home/primitives";

type TrendPoint = {
  x: number;
  y: number;
  period: string;
  tasksStarted?: number;
};

type MiniChartProps = {
  growthPoints: TrendPoint[];
  salaryPoints: TrendPoint[];
  tasksLinePath: string;
  tasksArea: string;
  salaryLinePath: string;
  salaryLineY: number;
  plotXMin: number;
  plotXMax: number;
  plotYMin: number;
  plotYMax: number;
  startPeriod: string;
  currentPeriod: string;
  title: string;
  type: "tasks" | "salary";
};

export function MiniChart({
  growthPoints,
  salaryPoints,
  tasksLinePath,
  tasksArea,
  salaryLinePath,
  salaryLineY,
  plotXMin,
  plotXMax,
  plotYMin,
  plotYMax,
  startPeriod,
  currentPeriod,
  title,
  type,
}: MiniChartProps) {
  const [tooltip, setTooltip] = useState<{
    period: string;
    x: number;
    y: number;
  } | null>(null);

  const viewBox = "0 0 100 100";
  const isTasks = type === "tasks";
  const linePath = isTasks ? tasksLinePath : salaryLinePath;
  const points = isTasks ? growthPoints : salaryPoints;
  const areaPath = isTasks ? tasksArea : "";

  return (
    <HomeChartShell tone="surface">
      <h2 className="qa-display text-base">{title}</h2>
      <div className="relative mt-3 space-y-2" data-testid={isTasks ? "chart-trend" : "chart-salary"}>
        <div className="relative">
          <svg
            viewBox={viewBox}
            className="qa-trend-svg qa-mini-chart w-full"
            role="img"
            aria-label={isTasks ? "Компактный график роста задач по месяцам" : "Компактный график зарплаты по месяцам"}
          >
            <defs>
              <linearGradient id="qaTrendArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--qa-brand-soft)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--qa-brand-soft)" stopOpacity="0.08" />
              </linearGradient>
              <clipPath id="qaChartClip" clipPathUnits="userSpaceOnUse">
                <rect x="0" y="0" width="100" height="100" />
              </clipPath>
            </defs>

            <line x1="0" y1="100" x2="100" y2="100" className="qa-axis" />
            <line x1="0" y1="0" x2="0" y2="100" className="qa-axis" />

            <g clipPath="url(#qaChartClip)">
              {areaPath && <path d={areaPath} fill="url(#qaTrendArea)" />}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--qa-brand)"
                  strokeWidth={isTasks ? "2" : "1.8"}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}

              {points.map((point) => {
                const cx = point.x;
                const cy = isTasks ? point.y : salaryLineY;
                const isActive = tooltip?.period === point.period;

                return (
                  <circle
                    key={`${point.period}-marker`}
                    cx={cx}
                    cy={cy}
                    r="2.8"
                    fill="var(--qa-brand)"
                    className={`qa-trend-marker${isActive ? " qa-trend-marker-active" : ""}`}
                    onMouseEnter={() =>
                      setTooltip({ period: point.period, x: cx, y: cy })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </g>
          </svg>

          {tooltip && (
            <div
              className="qa-tooltip"
              style={{
                left: `${tooltip.x}%`,
                top: `${tooltip.y}%`,
              }}
            >
              {tooltip.period}
            </div>
          )}
        </div>

        <div className="qa-muted flex items-center justify-between text-xs">
          <span>Старт: {startPeriod}</span>
          <span>Текущий период: {currentPeriod}</span>
        </div>
      </div>
    </HomeChartShell>
  );
}
