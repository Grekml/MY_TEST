import Link from "next/link";
import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import {
  HomeSectionLabel,
} from "@/components/home/primitives";
import { HomeReveal } from "@/components/home/reveal";
import { MiniChart } from "@/components/home/MiniChart";
import { SkillTrackCard } from "@/components/home/SkillTrackCard";
import { QA_PROMOTION_CONTENT } from "@/lib/qa-promotion-content";
import "./qa-promo.css";

const bodyFont = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const displayFont = localFont({
  src: "../public/fonts/rubik-one-cyrillic.woff2",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QA-промо: витрина качества релизов",
  description: "Промо-витрина QA-вклада: цифры, доказательства и проекты",
};

export default function Home() {
  const {
    heroStats,
    trendSeries,
    projectProof,
    skillTracks,
    closingSummary,
  } = QA_PROMOTION_CONTENT;

  const monthIndexByName: Record<string, number> = {
    январь: 0,
    февраль: 1,
    март: 2,
    апрель: 3,
    май: 4,
    июнь: 5,
    июль: 6,
    август: 7,
    сентябрь: 8,
    октябрь: 9,
    ноябрь: 10,
    декабрь: 11,
  };

  const parsePeriod = (period: string): { year: number; monthIndex: number } | null => {
    const [monthName, yearText] = period.toLowerCase().split(" ");
    const monthIndex = monthIndexByName[monthName];
    const year = Number(yearText);

    if (monthIndex === undefined || !Number.isFinite(year)) {
      return null;
    }

    return { year, monthIndex };
  };

  const trendStartIndex = trendSeries.findIndex((point) => point.period === "июнь 2025");
  const trendFromJoinDate =
    trendStartIndex >= 0 ? trendSeries.slice(trendStartIndex) : trendSeries;

  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();

  const chartSeries = trendFromJoinDate.filter((point) => {
    const parsed = parsePeriod(point.period);
    if (!parsed) {
      return false;
    }

    if (parsed.year < currentYear) {
      return true;
    }

    if (parsed.year > currentYear) {
      return false;
    }

    return parsed.monthIndex <= currentMonthIndex;
  });

  const plotXMin = 4;
  const plotXMax = 96;
  const plotYMin = 8;
  const plotYMax = 92;
  const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

  const trendPoints = chartSeries.map((point, index) => {
    const ratio = chartSeries.length === 1 ? 0.5 : index / (chartSeries.length - 1);
    const x = plotXMin + ratio * (plotXMax - plotXMin);
    return {
      ...point,
      x,
    };
  });

  const smoothedMonthlyTasks = trendPoints.map((point, index) => {
    const previous = trendPoints[index - 1]?.tasksStarted ?? point.tasksStarted;
    const next = trendPoints[index + 1]?.tasksStarted ?? point.tasksStarted;

    return (previous + point.tasksStarted * 2 + next) / 4;
  });

  const monthlyChartMax = Math.max(
    ...smoothedMonthlyTasks,
    1,
  );

  const growthPoints = trendPoints.map((point, index) => {
    const smoothedValue = smoothedMonthlyTasks[index];
    const scaledY =
      plotYMax - (smoothedValue / monthlyChartMax) * (plotYMax - plotYMin);

    return {
      ...point,
      y: clamp(scaledY, plotYMin, plotYMax),
    };
  });

  const salaryLineY = 56;
  const salaryPoints = trendPoints.map((point) => ({
    ...point,
    y: salaryLineY,
  }));

  const buildSmoothPath = (points: Array<{ x: number; y: number }>): string => {
    if (!points.length) {
      return "";
    }

    if (points.length === 1) {
      return `M ${points[0].x},${points[0].y}`;
    }

    let path = `M ${points[0].x},${points[0].y}`;

    for (let index = 0; index < points.length - 1; index += 1) {
      const p0 = points[index - 1] ?? points[index];
      const p1 = points[index];
      const p2 = points[index + 1];
      const p3 = points[index + 2] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return path;
  };

  const tasksLinePath = buildSmoothPath(growthPoints);
  const salaryLinePath =
    salaryPoints.length > 1
      ? `M ${salaryPoints[0].x},${salaryLineY} L ${salaryPoints[salaryPoints.length - 1].x},${salaryLineY}`
      : salaryPoints.length === 1
        ? `M ${salaryPoints[0].x},${salaryLineY}`
        : "";
  const tasksArea =
    tasksLinePath && growthPoints.length
      ? `${tasksLinePath} L ${growthPoints[growthPoints.length - 1].x},${plotYMax} L ${growthPoints[0].x},${plotYMax} Z`
      : "";
  const startPeriod = growthPoints[0]?.period ?? "—";
  const currentPeriod = growthPoints[growthPoints.length - 1]?.period ?? "—";

  const projectsStat = heroStats.find((stat) => stat.id === "projects-covered") ?? heroStats[0];
  const openedTasksStat = heroStats.find((stat) => stat.id === "tasks-opened") ?? heroStats[1];
  const testedTasksStat = heroStats.find((stat) => stat.id === "tasks-tested") ?? heroStats[2];

  return (
    <main
      className={`${bodyFont.variable} ${displayFont.variable} qa-home relative min-h-screen overflow-hidden overflow-x-hidden`}
      data-homepage="qa-promo"
    >
      <div className="qa-grid-overlay absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-16 px-6 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <section id="hero" className="qa-panel qa-hero-panel space-y-8 rounded-[28px] p-6 sm:p-10">
          <HomeReveal>
            <div className="qa-hero-copy">
              <HomeSectionLabel text="Иван Гриценко / QA" />
              <h1 className="qa-display qa-hero-title mt-5 max-w-5xl">
                <span className="block">QA, который</span>
                <span className="block">подкреплен</span>
                <span className="block">цифрами и релизами.</span>
              </h1>
              <p className="qa-muted qa-hero-lead mt-5 max-w-3xl leading-relaxed">
                От багов защищено <span className="qa-hero-emphasis">{projectsStat.valueText} проектов</span>:
                найдено <span className="qa-hero-emphasis">{openedTasksStat.valueText} багов</span> и минимум <span className="qa-hero-emphasis">{testedTasksStat.valueText} протестированных задач</span> — только подтвержденные числа из витрины и проекты, которые можно открыть и проверить руками.
              </p>
            </div>
            <div className="qa-hero-actions mt-7 flex flex-wrap gap-3">
              <Link href="#charts" className="qa-btn-primary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition">
                Перейти к трендам
              </Link>
              <Link href="#projects" className="qa-btn-secondary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition">
                Смотреть проекты
              </Link>
            </div>
          </HomeReveal>

          <div className="qa-hero-metrics grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat, index) => (
              <HomeReveal key={stat.id} delay={80 + index * 90}>
                <article className="qa-hero-kpi h-full rounded-[22px] p-5">
                  <p className="qa-display qa-hero-kpi-value">{stat.valueText}</p>
                  <p className="qa-hero-kpi-label mt-3">{stat.label}</p>
                </article>
              </HomeReveal>
            ))}
          </div>
        </section>

        <section id="skills" className="space-y-5">
          <HomeSectionLabel text="Скилы: рост и критичные баги" subtle />
          <div className="grid gap-4 lg:grid-cols-3">
            {skillTracks.map((track) => (
              <SkillTrackCard
                key={track.id}
                title={track.title}
                items={track.items}
                disableHighlight={track.id === "critical-bugs"}
              />
            ))}
          </div>
        </section>

        <section id="charts" className="space-y-5">
          <HomeSectionLabel text="Тренды" subtle />
          <div className="grid gap-4 lg:grid-cols-2">
            <MiniChart
              growthPoints={growthPoints}
              salaryPoints={salaryPoints}
              tasksLinePath={tasksLinePath}
              tasksArea={tasksArea}
              salaryLinePath={salaryLinePath}
              salaryLineY={salaryLineY}
              plotXMin={plotXMin}
              plotXMax={plotXMax}
              plotYMin={plotYMin}
              plotYMax={plotYMax}
              startPeriod={startPeriod}
              currentPeriod={currentPeriod}
              title="Динамика задач (июнь 2025 - сейчас)"
              type="tasks"
            />

            <MiniChart
              growthPoints={growthPoints}
              salaryPoints={salaryPoints}
              tasksLinePath={tasksLinePath}
              tasksArea={tasksArea}
              salaryLinePath={salaryLinePath}
              salaryLineY={salaryLineY}
              plotXMin={plotXMin}
              plotXMax={plotXMax}
              plotYMin={plotYMin}
              plotYMax={plotYMax}
              startPeriod={startPeriod}
              currentPeriod={currentPeriod}
              title="Динамика зарплаты (июнь 2025 - сейчас)"
              type="salary"
            />
          </div>
        </section>

        <section id="projects" className="space-y-5">
          <HomeSectionLabel text="Проекты: эффект, риск, масштаб" subtle />
          <div className="grid gap-4 md:grid-cols-2" data-testid="project-proof-grid">
            {projectProof.map((project) => (
              <article key={project.slug} data-testid={`project-card-${project.slug}`} className="qa-panel-soft flex h-full min-h-[34rem] flex-col rounded-2xl p-5 lg:min-h-[36rem]">
                <h2 className="qa-display text-2xl">{project.title}</h2>
                <p className="qa-chip mt-3 rounded-xl px-3 py-2 text-sm leading-relaxed">
                  <span className="font-semibold">Эффект:</span> {project.impact}
                </p>
                <p className="qa-muted mt-2 text-sm leading-relaxed">
                  <span className="font-semibold">Снятый риск:</span>{" "}
                  {project.riskReduction}
                </p>
                <p className="qa-muted mt-1 text-sm leading-relaxed">
                  <span className="font-semibold">Сигнал масштаба:</span>{" "}
                  {project.scaleSignal}
                </p>
                <ul className="qa-muted mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                  {project.proofPoints.map((proof) => (
                    <li key={proof}>{proof}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link href={`/projects/${project.slug}`} className="qa-btn-primary inline-flex items-center self-start rounded-full px-4 py-2 text-sm font-semibold transition">
                    Открыть проект
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="closing" className="qa-panel rounded-[24px] p-6 sm:p-8">
          <HomeSectionLabel text="Финальный акцент" subtle />
          <h2 className="qa-display mt-4 text-3xl leading-tight sm:text-4xl">{closingSummary.headline}</h2>
          <p className="qa-muted mt-4 max-w-3xl text-base leading-relaxed">{closingSummary.body}</p>
          <p className="qa-soft mt-3 text-xs">{closingSummary.evidenceLabel}. {closingSummary.evidenceNote}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#charts" className="qa-btn-primary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition">
              {closingSummary.ctaLabel}
            </Link>
            <Link href="#projects" className="qa-btn-secondary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition">
              Открыть блок проектов
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
