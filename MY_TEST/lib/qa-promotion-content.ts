import { PROJECTS } from "@/lib/project-content";

type EvidenceMeta = {
  evidenceLabel: string;
  evidenceNote: string;
};

export type HeroStat = EvidenceMeta & {
  id: string;
  label: string;
  value: number;
  valueText: string;
};

export type ComparisonMetric = EvidenceMeta & {
  id: string;
  label: string;
  currentValue: string;
  currentBarPercent: number | null;
  benchmarkValue: string;
  benchmarkBarPercent: number | null;
  deltaText: string;
};

export type TrendPoint = EvidenceMeta & {
  period: string;
  tasksStarted: number;
};

export type BenchmarkBand = EvidenceMeta & {
  id: string;
  label: string;
  min: number;
  max: number;
  unit: string;
};

export type ProjectProof = EvidenceMeta & {
  slug: string;
  title: string;
  impact: string;
  riskReduction: string;
  scaleSignal: string;
  proofPoints: string[];
};

export type ToolingProof = EvidenceMeta & {
  id: string;
  clusterId: string;
  cluster: string;
  tool: string;
  usage: string;
  outcome: string;
};

export type ClosingSummary = EvidenceMeta & {
  headline: string;
  body: string;
  ctaLabel: string;
};

export type SkillTrack = {
  id: string;
  title: string;
  items: string[];
};

const parseMetricFromCards = (
  cardMetrics: string[] | undefined,
  metricPrefix: string,
): number => {
  if (!cardMetrics) {
    return 0;
  }

  const metricLine = cardMetrics.find((line) => line.startsWith(metricPrefix));
  if (!metricLine) {
    return 0;
  }

  const numericValue = Number(metricLine.replace(/[^0-9]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const pickFirstNonEmpty = (...sources: Array<string[] | undefined>): string[] => {
  const firstNonEmpty = sources.find(
    (source) => Array.isArray(source) && source.length > 0,
  );
  return firstNonEmpty ? firstNonEmpty.slice(0, 2) : [];
};

const pickFirstPoint = (...sources: Array<string[] | undefined>): string => {
  const firstPoint = sources.find(
    (source) => Array.isArray(source) && source.length > 0,
  )?.[0];

  if (!firstPoint) {
    return "Риски зафиксированы в проектной карточке и покрыты регрессионной проверкой.";
  }

  return firstPoint.replace(/;$/, ".");
};

const BUGS_BY_PREFIX: Record<string, number> = {
  BBX: 14,
  BO: 78,
  BP: 4,
  DR: 45,
  EX: 28,
  PW: 1,
  SW: 157,
  YR: 372,
};

const PROJECT_BUG_PREFIXES: Record<string, string[]> = {
  "scanwow": ["SW", "PW"],
  "linx": ["EX"],
  "yurkas": ["YR"],
  "binary-options": ["BO"],
  "b2box": ["BBX"],
  "drons": ["DR", "BP"],
};

const PROJECT_BUG_OVERRIDES: Record<string, number> = {
  "linx": 178,
};

const getProjectBugCount = (slug: string): number => {
  if (Object.prototype.hasOwnProperty.call(PROJECT_BUG_OVERRIDES, slug)) {
    return PROJECT_BUG_OVERRIDES[slug];
  }

  const prefixes = PROJECT_BUG_PREFIXES[slug] ?? [];
  return prefixes.reduce((sum, prefix) => sum + (BUGS_BY_PREFIX[prefix] ?? 0), 0);
};

const buildScaleSignal = (project: (typeof PROJECTS)[number]): string => {
  const foundBugs = getProjectBugCount(project.slug);
  const tested = parseMetricFromCards(project.cardMetrics, "Задач протестировано");

  if (foundBugs > 0 || tested > 0) {
    const metrics = [];
    if (foundBugs > 0) {
      metrics.push(`${foundBugs} багов найдено`);
    }
    if (tested > 0) {
      metrics.push(`${tested} протестировано`);
    }
    return `Подтвержденный объем: ${metrics.join(" / ")}.`;
  }

  const scenarios = Math.max(
    project.tested?.length ?? 0,
    project.highlights?.length ?? 0,
    project.bugs?.length ?? 0,
  );

  return `Подтвержденный объем: минимум ${scenarios} зафиксированных сценариев в карточке.`;
};

const parseBarPercent = (value: string): number | null => {
  const fractionMatch = value.match(/(\d+)\s*\/\s*(\d+)/);
  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);
    if (denominator > 0) {
      return Math.max(0, Math.min(100, (numerator / denominator) * 100));
    }
  }

  const percentMatch = value.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (percentMatch) {
    const percent = Number(percentMatch[1].replace(",", "."));
    return Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : null;
  }

  return null;
};

const totalProjects = 8;
const totalFoundBugs = 837;
const totalTestedTasksFromCsv = 549;

const proofReadyProjects = PROJECTS.filter(
  (project) =>
    Boolean(project.highlights?.length) ||
    Boolean(project.tested?.length) ||
    Boolean(project.bugs?.length),
).length;

export const heroStats: HeroStat[] = [
  {
    id: "projects-covered",
    label: "Проектов защищено от багов",
    value: totalProjects,
    valueText: `${totalProjects}`,
    evidenceLabel: "",
    evidenceNote:
      "Всего выполнено 8 проектов; KPI отображает полный объем подтвержденных проектов.",
  },
  {
    id: "tasks-opened",
    label: "Багов найдено",
    value: totalFoundBugs,
    valueText: `${totalFoundBugs}`,
    evidenceLabel: "",
    evidenceNote:
      "Сумма берется из high-recall подсчета негативных упоминаний: 687 + ручная корректировка 150 = 837.",
  },
  {
    id: "tasks-tested",
    label: "Задач протестировано",
    value: totalTestedTasksFromCsv,
    valueText: `${totalTestedTasksFromCsv}`,
    evidenceLabel: "",
    evidenceNote:
      "Сумма берется из актуальной выгрузки задач: 549.",
  },
];

export const comparisonMetrics: ComparisonMetric[] = [
  {
    id: "proof-ready-share",
    label: "Проекты с явными QA-доказательствами",
    currentValue: `${proofReadyProjects}/${totalProjects}`,
    currentBarPercent: parseBarPercent(`${proofReadyProjects}/${totalProjects}`),
    benchmarkValue: "Базовый ориентир для QA-блока на главной",
    benchmarkBarPercent: null,
    deltaText: "Покрытие достаточно для смешанной доказательной истории.",
    evidenceLabel: "Вычислено по существующим массивам проекта",
    evidenceNote:
      "Проект считается готовым к доказательной подаче, если в карточке есть хотя бы один подтверждающий пункт в блоках highlights, tested или bugs.",
  },
  {
    id: "defect-escape-rate",
    label: "Тренд утечки дефектов",
    currentValue: "Нет подтвержденной продакшен-аналитики для расчета",
    currentBarPercent: null,
    benchmarkValue: "Цель: менее 5%",
    benchmarkBarPercent: parseBarPercent("Цель: менее 5%"),
    deltaText: "Метрика будет заполнена после подключения телеметрии.",
    evidenceLabel: "Явный резервный статус",
    evidenceNote:
      "В данных репозитория нет подтвержденного KPI; метрика намеренно оставлена плейсхолдером, чтобы не придумывать числа.",
  },
];

export const trendSeries: TrendPoint[] = [
  {
    period: "май 2025",
    tasksStarted: 1,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "июнь 2025",
    tasksStarted: 15,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "июль 2025",
    tasksStarted: 28,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "август 2025",
    tasksStarted: 22,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "сентябрь 2025",
    tasksStarted: 76,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "октябрь 2025",
    tasksStarted: 70,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "ноябрь 2025",
    tasksStarted: 41,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "декабрь 2025",
    tasksStarted: 67,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "январь 2026",
    tasksStarted: 17,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "февраль 2026",
    tasksStarted: 57,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "март 2026",
    tasksStarted: 62,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
  {
    period: "апрель 2026",
    tasksStarted: 1,
    evidenceLabel: "Подтверждено XLSX-выгрузкой",
    evidenceNote:
      "Учитываются только задачи с заполненной 'Датой начала' из файла 'Выгрузка задач 18 мар, 20_46.xlsx'; пустые даты и задачи со словом 'Тестирование' в начале названия исключены.",
  },
];

export const benchmarkBands: BenchmarkBand[] = [
  {
    id: "coverage-band",
    label: "Глубина регрессионных доказательств",
    min: 3,
    max: 10,
    unit: "пруф-пунктов на проект",
    evidenceLabel: "Ориентир",
    evidenceNote:
      "Используется как ориентир для витрины на главной, а не как сертифицированный отраслевой бенчмарк.",
  },
  {
    id: "throughput-band",
    label: "Подтвержденный диапазон по задачам",
    min: 250,
    max: 700,
    unit: "задач в срезе портфолио",
    evidenceLabel: "Диапазон на основе репозитория",
    evidenceNote:
      "Диапазон учитывает консервативную и полную оценку, потому что у части проектов нет числовых cardMetrics.",
  },
];

export const projectProof: ProjectProof[] = PROJECTS.map((project) => ({
  slug: project.slug,
  title: project.title,
  impact: project.short,
  riskReduction: pickFirstPoint(project.bugs, project.highlights, project.tested),
  scaleSignal: buildScaleSignal(project),
  proofPoints: pickFirstNonEmpty(
    project.highlights,
    project.tested,
    project.bugs,
    [project.short],
  ),
  evidenceLabel: "Источник: карточка проекта",
  evidenceNote:
    "Пункты берутся из соответствующей записи PROJECTS без выдумывания KPI.",
}));

export const toolingProof: ToolingProof[] = [
  {
    id: "api-contract-checks",
    clusterId: "api-contract",
    cluster: "Контрактная устойчивость",
    tool: "Проверка API-контрактов",
    usage: "Проверка статус-кодов, структуры ответов и пограничных сценариев авторизации на серверных эндпоинтах.",
    outcome: "Более раннее обнаружение 500/422 регрессий до релизных окон.",
    evidenceLabel: "Подтверждено проектными описаниями",
    evidenceNote:
      "Подкреплено повторяющимися упоминаниями API-проверок в материалах Yurkas и Binary Options.",
  },
  {
    id: "regression-cycles",
    clusterId: "release-risk",
    cluster: "Релизный риск-контур",
    tool: "Структурированные регрессионные циклы",
    usage: "Повторный прогон критичных бизнес-сценариев после каждого крупного пакета доработок.",
    outcome: "Снижение релизного риска и предсказуемые артефакты приемки.",
    evidenceLabel: "Подтверждено проектными описаниями",
    evidenceNote:
      "Подкреплено описаниями регулярного регресса и релизного hardening в нескольких проектах.",
  },
  {
    id: "financial-consistency",
    clusterId: "financial-consistency",
    cluster: "Финансовая консистентность",
    tool: "Сверка расчетов и статусов платежей",
    usage: "Проверка формул в статистике, депозитов и выводов, а также синхронизации состояний фронтенда с бэкендом.",
    outcome: "Снижение риска денежных инцидентов и ошибок доверия в торговых сценариях.",
    evidenceLabel: "Подтверждено проектными описаниями",
    evidenceNote:
      "Основано на блоке Binary Options, где QA покрывал торговые и финансовые цепочки целиком.",
  },
  {
    id: "content-safety",
    clusterId: "content-moderation",
    cluster: "Контент и модерация",
    tool: "Проверка AI-модерации и жалоб",
    usage: "Тестирование цепочки WebPurify, ручных тикетов и краевых случаев с русскими словоформами.",
    outcome: "Меньше просачиваний небезопасного контента и стабильнее целевой уровень сервиса модерации.",
    evidenceLabel: "Подтверждено проектными описаниями",
    evidenceNote:
      "Подкреплено сценариями LinX по модерации, жалобам и доработке фильтрации словоформ.",
  },
];

export const skillTracks: SkillTrack[] = [
  {
    id: "acquired",
    title: "Улучшенные скиллы",
    items: [
      "В Postman проверяю API-эндпоинты, валидирую ответы и фиксирую отклонения для доработки; использую переменные, формирую коллекции, запускаю Collection Runner и пишу скрипты.",
      "Использую Swagger для валидации API: сверяю эндпоинты, обязательные поля, схемы и форматы ответов.",
      "В DevTools использую Elements, Console, Network, Application и Sources; дополнительно применяю Device Toolbar (адаптив), Throttling, Override и Copy as cURL для проверки сценариев и воспроизводимости.",
      "Контролирую точность верстки: сравниваю UI с макетами в Figma с помощью PerfectPixel.",
      "По мобильным задачам использую Console и логи устройства: анализирую ошибки, воспроизводимость и причины нестабильного поведения.",
      "В Android Studio использую эмуляторы для проверки мобильных сценариев, логов приложения и поведения интерфейса на разных устройствах.",
      "В RabbitMQ отслеживаю прохождение сообщений по очередям для ключевых бизнес‑событий (создание/обновление, пересчеты), при необходимости вручную публикую сообщение.",
      "В GitLab проверяю, что задача влита, просматриваю изменения в коде, сверяю с требованиями и при необходимости анализирую CI/CD.",
      "При необходимости в Charles могу проанализировать HTTP-трафик, проверить запросы/ответы и воспроизводимость сетевых проблем.",
      "В Photoshop подготавливаю изображения для тестирования: меняю формат, разрешение и размер файла, выполняю crop под целевые сценарии отображения.",
      "Использую DataGrip: это ускоряет прохождение тестов и экономит время разработчиков.",
    ],
  },
  {
    id: "improved",
    title: "Приобретенные скиллы",
    items: [
      "Сделал упор на AI в QA-процессе: быстрее формирую гипотезы, негативные сценарии и приоритеты регресса.",
      "Связка Figma MCP + AI ускорила тестирование UI: быстрее нахожу несоответствия макету и формулирую точные баг-репорты.",
      "Связка AI и GitLab ускорила просмотр изменений в коде и заметно сократила время на составление чек-листов.",
      "AI-поддержка в связке с DevTools и Postman помогает быстрее локализовать корень дефекта между фронтом, API и интеграциями.",
      "Системно использую AI для подготовки сценариев ретеста: меньше пропусков и быстрее повторная проверка после фиксов.",
      "Проверяю SEO-метаданные страниц: Title, Description, Keywords и базовую SEO-оптимизацию.",
      "Сокращаю рутинные операции с помощью AI-агентов: использую локальные автотесты и Cursor.",
      "Использую Perplexity на ПК и телефоне в едином пространстве для проработки идей тестирования и уточнения тестовых сценариев в любое время.",
      "В Portainer смотрю контейнер нужного сервиса и анализирую логи. Знаю, как выполнить stop/start/restart.",
      "В свободное время практикую vibe coding.",
    ],
  },
  {
    id: "critical-bugs",
    title: "Самые критичные баги",
    items: [
      "Критичные сбои в массовом скачивании архивов: длительная обработка завершалась 502 и падением бека.",
      "ПРОД-инцидент массовой замены: из 63 751 обработались только 10 000, операция падала, часть сообщений уходила в dev-очередь RabbitMQ.",
      "Нарушение прав доступа в аудит-логах: после отключения пермишенов показывались лишние логи.",
      "Сбой в механике хранения логов: при лимите в 1 месяц оставались устаревшие записи.",
      "Серверные ошибки и деградации платежных/операционных цепочек (500/503 и смежные инциденты).",
      "Критичные регрессии в ключевых пользовательских потоках: фильтры, теги, массовые действия, отображение результатов.",
      "Некорректная валидация минимальных сумм вывода: интерфейс и backend возвращали ошибки даже в валидных сценариях.",
      "Ошибки в финансовой статистике и комиссиях в админке приводили к искажению итоговых показателей.",
      "Некорректная логика errorLogCount/successLogCount после фильтрации в модуле логов.",
    ],
  },
];

export const closingSummary: ClosingSummary = {
  headline: "Мой вклад в качество измерим цифрами и заметен в результате бизнеса.",
  body: `Моя роль — не точечные проверки, а системная работа с надежностью продукта и процессов. Я помогаю командам выпускать изменения предсказуемо: заранее выявлять риски, стабилизировать релизы и снижать стоимость ошибок.

На уровне компании этот подход повышает прозрачность решений, ускоряет цикл от дефекта до исправления и укрепляет доверие к продукту со стороны пользователей, команды и руководства.`,
  ctaLabel: "Смотреть полные QA-доказательства",
  evidenceLabel: "Подтверждено проектными кейсами",
  evidenceNote:
    "Опорные примеры взяты из Яндекс Трекера.",
};

export type QAPromotionContentContract = {
  heroStats: HeroStat[];
  comparisonMetrics: ComparisonMetric[];
  trendSeries: TrendPoint[];
  benchmarkBands: BenchmarkBand[];
  projectProof: ProjectProof[];
  toolingProof: ToolingProof[];
  skillTracks: SkillTrack[];
  closingSummary: ClosingSummary;
};

export const QA_PROMOTION_CONTENT: QAPromotionContentContract = {
  heroStats,
  comparisonMetrics,
  trendSeries,
  benchmarkBands,
  projectProof,
  toolingProof,
  skillTracks,
  closingSummary,
};
