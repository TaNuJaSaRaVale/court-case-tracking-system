"use client";

import { useLanguage } from "@/context/LanguageContext";
import { GlassCard } from "@/components/GlassCard";
import { adminStats } from "@/data/demoData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FileText,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

// Chart colors - using computed colors, not CSS variables
const COLORS = {
  amber: "#8b6f47",
  amberLight: "#c4a574",
  amberLighter: "#d4c4a8",
  emerald: "#059669",
  blue: "#3b82f6",
  purple: "#8b5cf6",
};

const pieColors = [COLORS.amber, COLORS.emerald, COLORS.blue, COLORS.amberLight];

export default function AdminPage() {
  const { t, language } = useLanguage();

  const statsCards = [
    {
      label: t("admin.totalCases"),
      value: adminStats.totalCases,
      icon: FileText,
      color: "from-[#8b6f47] to-[#c4a574]",
      change: "+12%",
    },
    {
      label: t("admin.pendingCases"),
      value: adminStats.pendingCases,
      icon: Clock,
      color: "from-amber-500 to-amber-400",
      change: "-3%",
    },
    {
      label: t("admin.resolvedCases"),
      value: adminStats.resolvedCases,
      icon: CheckCircle2,
      color: "from-emerald-600 to-emerald-500",
      change: "+8%",
    },
    {
      label: t("admin.lawyerRequests"),
      value: adminStats.lawyerRequests,
      icon: Users,
      color: "from-blue-600 to-blue-500",
      change: "+15%",
    },
  ];

  const casesByTypeData = adminStats.casesByType.map((item, index) => ({
    ...item,
    name: language === "en" ? item.type : 
      item.type === "Civil" ? "सिविल" :
      item.type === "Criminal" ? "आपराधिक" :
      item.type === "Family" ? "पारिवारिक" : "संपत्ति",
    fill: pieColors[index % pieColors.length],
  }));

  const monthlyUsageData = adminStats.monthlyUsage.map((item) => ({
    ...item,
    name: item.month,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--stone-warm)] to-[var(--beige-soft)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-dark)] text-white shadow-xl shadow-[var(--amber-primary)]/30">
              <BarChart3 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--amber-dark)]">
                {t("admin.title")}
              </h1>
              <p className="text-[var(--amber-primary)]">
                {language === "en"
                  ? "Platform analytics and insights"
                  : "प्लेटफ़ॉर्म विश्लेषण और अंतर्दृष्टि"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <GlassCard key={index} className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                >
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-[var(--amber-dark)]">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-[var(--amber-primary)]/70 mt-1">
                  {stat.label}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Usage Chart */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[var(--amber-primary)]" />
              {t("admin.systemUsage")}
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#8b6f47", fontSize: 12 }}
                    axisLine={{ stroke: "#d4c4a8" }}
                  />
                  <YAxis
                    tick={{ fill: "#8b6f47", fontSize: 12 }}
                    axisLine={{ stroke: "#d4c4a8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #d4c4a8",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={COLORS.amber}
                    strokeWidth={3}
                    dot={{ fill: COLORS.amber, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: COLORS.amber }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Cases by Type */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--amber-primary)]" />
              {language === "en" ? "Cases by Type" : "केस प्रकार के अनुसार"}
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={casesByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: "#8b6f47", strokeWidth: 1 }}
                  >
                    {casesByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #d4c4a8",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, language === "en" ? "Cases" : "केस"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Cases Bar Chart */}
        <GlassCard className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-[var(--amber-dark)] mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--amber-primary)]" />
            {language === "en" ? "Case Distribution" : "केस वितरण"}
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casesByTypeData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8b6f47", fontSize: 12 }}
                  axisLine={{ stroke: "#d4c4a8" }}
                />
                <YAxis
                  tick={{ fill: "#8b6f47", fontSize: 12 }}
                  axisLine={{ stroke: "#d4c4a8" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #d4c4a8",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [value, language === "en" ? "Cases" : "केस"]}
                />
                <Bar
                  dataKey="count"
                  radius={[8, 8, 0, 0]}
                >
                  {casesByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Demo Note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">{t("admin.demoNote")}</p>
        </div>
      </div>
    </div>
  );
}
