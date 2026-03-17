export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date (YYYY-MM-DD)
  category: AchievementCategory;
  impactValue: number;
  unit: string;
  sourceLink?: string;
};

export type AchievementCategory =
  | 'Operational Efficiency'
  | 'Employee Experience'
  | 'Cost Savings'
  | 'People & Culture'
  | 'Automation'
  | 'Risk & Compliance';

export const ACHIEVEMENTS_SAMPLE: Achievement[] = [
  {
    id: "achv-0001",
    title: "Payroll automation rollout",
    description: "Automated payroll data ingestion and validation, reducing manual processing time.",
    date: "2025-04-12",
    category: "Operational Efficiency",
    impactValue: 28,
    unit: "percent",
    sourceLink: "https://internal.example/salary/achievements/2025-04-12-payroll-automation",
  },
  {
    id: "achv-0002",
    title: "Salary transparency portal launch",
    description: "Launched salary bands and career ladders to improve transparency.",
    date: "2025-06-20",
    category: "Employee Experience",
    impactValue: 4.5,
    unit: "rating",
    sourceLink: "https://internal.example/salary/achievements/2025-06-20-portal",
  },
  {
    id: "achv-0003",
    title: "Vendor cost renegotiation",
    description: "Renegotiated health benefits vendor terms, delivering annual savings.",
    date: "2025-11-18",
    category: "Cost Savings",
    impactValue: 32000,
    unit: "USD",
    sourceLink: "https://internal.example/salary/achievements/2025-11-18-vendor",
  },
  {
    id: "achv-0004",
    title: "Structured retention program",
    description: "Implemented retention program reducing voluntary turnover among salary staff.",
    date: "2025-09-01",
    category: "People & Culture",
    impactValue: 6,
    unit: "percent",
    sourceLink: "https://internal.example/salary/achievements/2025-09-01-retention",
  },
  {
    id: "achv-0005",
    title: "Automation coverage expansion",
    description: "Expanded automation coverage across payroll workflows.",
    date: "2025-07-30",
    category: "Automation",
    impactValue: 72,
    unit: "percent",
    sourceLink: "https://internal.example/salary/achievements/2025-07-30-automation",
  },
  {
    id: "achv-0006",
    title: "Compliance accuracy improvement",
    description: "Enhanced payroll compliance controls, reducing errors in tax filings.",
    date: "2025-12-05",
    category: "Risk & Compliance",
    impactValue: 0.97,
    unit: "percent",
    sourceLink: "https://internal.example/salary/achievements/2025-12-05-compliance",
  },
  {
    id: "achv-0007",
    title: "Payroll anomaly detection implementation",
    description: "Introduced anomaly detection to flag unusual payroll entries for review.",
    date: "2025-10-15",
    category: "Automation",
    impactValue: 14,
    unit: "percent",
    sourceLink: "https://internal.example/salary/achievements/2025-10-15-anomaly",
  },
];
