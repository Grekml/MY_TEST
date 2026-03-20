import React from "react";

export type HomeSectionLabelProps = { text: string; subtle?: boolean };
export const HomeSectionLabel: React.FC<HomeSectionLabelProps> = ({ text, subtle }) => {
  return (
    <span className={`qa-label-chip${subtle ? " qa-label-chip-subtle" : ""}`}>
      {text}
    </span>
  );
};

export type HomeMetricCardProps = {
  title: string;
  value: string;
  suffix?: string;
};
export const HomeMetricCard: React.FC<HomeMetricCardProps> = ({ title, value, suffix }) => {
  return (
    <div className="qa-metric-card">
      <div className="qa-metric-card-title">{title}</div>
      <div className="qa-metric-card-value">
        {value}
        {suffix ?? ""}
      </div>
    </div>
  );
};

export type HomeChartShellProps = {
  children?: React.ReactNode;
  tone?: "default" | "surface";
};
export const HomeChartShell: React.FC<HomeChartShellProps> = ({
  children,
  tone = "default",
}) => {
  const className =
    tone === "surface" ? "qa-chart-shell qa-chart-shell-surface" : "qa-chart-shell";
  return <div className={className}>{children}</div>;
};
