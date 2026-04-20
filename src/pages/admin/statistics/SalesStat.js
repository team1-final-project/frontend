import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, AlertTriangle, Search, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  BarChart,
  Bar,
} from "recharts";

const MODE_OPTIONS = [
  { key: "all", label: "전체" },
  { key: "ai", label: "AI 가격변경" },
  { key: "manual", label: "수동 가격변경" },
];

const PERIOD_OPTIONS = [
  { value: "daily", label: "일간" },
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
];

const RANKING_TYPE_OPTIONS = [
  { value: "sales", label: "판매량순" },
  { value: "revenue", label: "매출" },
  { value: "profit", label: "공헌이익" },
  { value: "drop", label: "하락폭순" },
];

const CATEGORY_KEYS = ["라면", "소시지", "스낵과자", "즉석식품", "카레", "탄산음료"];

const CATEGORY_COLORS = {
  라면: "#2563eb",
  소시지: "#38bdf8",
  스낵과자: "#fbbf24",
  즉석식품: "#22c55e",
  카레: "#a855f7",
  탄산음료: "#ef4444",
};

const SUMMARY_BASE = {
  all: {
    gmv: 12345678,
    volume: 1420,
    profit: 4345678,
    margin: 35.2,
    change: 6.0,
  },
  ai: {
    gmv: 7340000,
    volume: 890,
    profit: 2980000,
    margin: 40.6,
    change: 8.1,
  },
  manual: {
    gmv: 5005678,
    volume: 530,
    profit: 1365678,
    margin: 27.3,
    change: 3.4,
  },
};

const CATEGORY_TREND_BASE = {
  라면: {
    sales: [4.6, 4.4, 4.6, 3.9, 3.3, 2.0, 4.1],
    profit: [3.8, 4.2, 3.7, 4.4, 3.9, 4.5, 3.4],
  },
  소시지: {
    sales: [2.1, 2.3, 2.0, 2.6, 2.8, 2.5, 2.7],
    profit: [1.5, 1.7, 1.8, 1.9, 2.0, 1.7, 1.8],
  },
  스낵과자: {
    sales: [3.0, 3.2, 3.5, 3.9, 4.0, 4.3, 4.1],
    profit: [2.2, 2.4, 2.5, 2.9, 3.0, 3.2, 3.1],
  },
  즉석식품: {
    sales: [2.4, 2.6, 2.9, 3.0, 3.3, 3.5, 3.4],
    profit: [1.9, 2.0, 2.3, 2.4, 2.6, 2.8, 2.7],
  },
  카레: {
    sales: [1.9, 2.1, 2.3, 2.6, 2.8, 3.0, 2.7],
    profit: [1.4, 1.5, 1.7, 1.9, 2.1, 2.4, 2.1],
  },
  탄산음료: {
    sales: [3.7, 3.5, 3.4, 3.9, 4.2, 4.0, 4.3],
    profit: [2.6, 2.5, 2.4, 2.8, 3.0, 2.9, 3.1],
  },
};

const CATEGORY_SHARE_BASE = {
  all: { 라면: 28, 소시지: 8, 스낵과자: 11, 즉석식품: 20, 카레: 14, 탄산음료: 19 },
  ai: { 라면: 31, 소시지: 6, 스낵과자: 9, 즉석식품: 23, 카레: 16, 탄산음료: 15 },
  manual: { 라면: 23, 소시지: 10, 스낵과자: 13, 즉석식품: 16, 카레: 12, 탄산음료: 26 },
};

const PRODUCT_SHARE_BASE = {
  라면: [
    { label: "Mon", sales: 0.8, profit: 0.5, discount: 0.2 },
    { label: "Tue", sales: 2.0, profit: 2.1, discount: 0.8 },
    { label: "Wed", sales: 0.6, profit: 0.5, discount: 0.2 },
    { label: "Thu", sales: 2.8, profit: 1.6, discount: 0.6 },
    { label: "Fri", sales: 2.2, profit: 1.5, discount: 0.9 },
    { label: "Sat", sales: 2.0, profit: 1.8, discount: 0.8 },
    { label: "Sun", sales: 2.1, profit: 1.7, discount: 1.0 },
  ],
  소시지: [
    { label: "Mon", sales: 0.5, profit: 0.4, discount: 0.1 },
    { label: "Tue", sales: 0.7, profit: 0.6, discount: 0.2 },
    { label: "Wed", sales: 0.6, profit: 0.4, discount: 0.1 },
    { label: "Thu", sales: 0.8, profit: 0.7, discount: 0.2 },
    { label: "Fri", sales: 0.9, profit: 0.7, discount: 0.2 },
    { label: "Sat", sales: 1.0, profit: 0.8, discount: 0.3 },
    { label: "Sun", sales: 1.1, profit: 0.8, discount: 0.3 },
  ],
  스낵과자: [
    { label: "Mon", sales: 1.0, profit: 0.8, discount: 0.4 },
    { label: "Tue", sales: 1.2, profit: 0.9, discount: 0.4 },
    { label: "Wed", sales: 1.1, profit: 0.9, discount: 0.3 },
    { label: "Thu", sales: 1.4, profit: 1.0, discount: 0.5 },
    { label: "Fri", sales: 1.6, profit: 1.2, discount: 0.6 },
    { label: "Sat", sales: 1.7, profit: 1.3, discount: 0.6 },
    { label: "Sun", sales: 1.5, profit: 1.2, discount: 0.5 },
  ],
  즉석식품: [
    { label: "Mon", sales: 0.9, profit: 0.7, discount: 0.2 },
    { label: "Tue", sales: 1.1, profit: 0.8, discount: 0.3 },
    { label: "Wed", sales: 1.0, profit: 0.8, discount: 0.3 },
    { label: "Thu", sales: 1.5, profit: 1.0, discount: 0.4 },
    { label: "Fri", sales: 1.6, profit: 1.2, discount: 0.4 },
    { label: "Sat", sales: 1.4, profit: 1.1, discount: 0.4 },
    { label: "Sun", sales: 1.3, profit: 1.0, discount: 0.3 },
  ],
  카레: [
    { label: "Mon", sales: 0.6, profit: 0.5, discount: 0.1 },
    { label: "Tue", sales: 0.8, profit: 0.6, discount: 0.2 },
    { label: "Wed", sales: 0.7, profit: 0.5, discount: 0.2 },
    { label: "Thu", sales: 1.0, profit: 0.7, discount: 0.2 },
    { label: "Fri", sales: 1.2, profit: 0.8, discount: 0.2 },
    { label: "Sat", sales: 1.1, profit: 0.8, discount: 0.2 },
    { label: "Sun", sales: 1.0, profit: 0.7, discount: 0.2 },
  ],
  탄산음료: [
    { label: "Mon", sales: 1.4, profit: 0.9, discount: 0.5 },
    { label: "Tue", sales: 1.8, profit: 1.1, discount: 0.6 },
    { label: "Wed", sales: 1.2, profit: 0.8, discount: 0.4 },
    { label: "Thu", sales: 2.4, profit: 1.5, discount: 0.8 },
    { label: "Fri", sales: 2.1, profit: 1.4, discount: 0.7 },
    { label: "Sat", sales: 2.2, profit: 1.5, discount: 0.7 },
    { label: "Sun", sales: 2.0, profit: 1.3, discount: 0.7 },
  ],
};

const HOURLY_BASE = [
  { time: "0시", lowestPrice: 1210, myPrice: 1180, sales: 54000, profit: 21000 },
  { time: "3시", lowestPrice: 1180, myPrice: 1120, sales: 82000, profit: 18500 },
  { time: "6시", lowestPrice: 1230, myPrice: 1200, sales: 76000, profit: 26000 },
  { time: "9시", lowestPrice: 1450, myPrice: 1380, sales: 61000, profit: 29000 },
  { time: "12시", lowestPrice: 1430, myPrice: 1410, sales: 60000, profit: 30000 },
  { time: "15시", lowestPrice: 1360, myPrice: 1320, sales: 52000, profit: 25000 },
  { time: "18시", lowestPrice: 1280, myPrice: 1240, sales: 75000, profit: 21000 },
  { time: "21시", lowestPrice: 760, myPrice: 680, sales: 87000, profit: 18000 },
  { time: "24시", lowestPrice: 1290, myPrice: 1210, sales: 47000, profit: 23000 },
];

const INVENTORY_BASE = [
  {
    productCode: "9744302255",
    productName: "농심 신라면컵 114g, 1개",
    salePrice: 800,
    stockDays: 103,
    category: "라면",
    changeMode: "ai",
  },
  {
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    salePrice: 21400,
    stockDays: 92,
    category: "즉석식품",
    changeMode: "manual",
  },
  {
    productCode: "5909188198",
    productName: "코카콜라 클래식 1.5L, 12개",
    salePrice: 34080,
    stockDays: 88,
    category: "탄산음료",
    changeMode: "manual",
  },
  {
    productCode: "9744302256",
    productName: "오뚜기 진라면 매운맛 120g, 5개",
    salePrice: 4200,
    stockDays: 79,
    category: "라면",
    changeMode: "ai",
  },
  {
    productCode: "9744302257",
    productName: "롯데 의성마늘 소시지 270g",
    salePrice: 3980,
    stockDays: 74,
    category: "소시지",
    changeMode: "manual",
  },
  {
    productCode: "9744302258",
    productName: "오리온 초코파이 12입",
    salePrice: 4800,
    stockDays: 69,
    category: "스낵과자",
    changeMode: "ai",
  },
];

const RANKING_BASE = [
  {
    productCode: "9744302255",
    productName: "농심 신라면컵 114g, 1개",
    category: "라면",
    changeMode: "ai",
    avgPrice: 1250,
    avgProfit: 400,
    avgMargin: 28,
    sales: 1470,
    avgSales: 210,
    revenue: 1837500,
    avgRevenue: 262500,
    contributionProfit: 588000,
    avgContributionProfit: 84000,
    compareRate: -9.0,
    originalPrice: 1350,
    changedPrice: 1250,
    dropAmount: 100,
  },
  {
    productCode: "5909188198",
    productName: "코카콜라 클래식 1.5L, 12개",
    category: "탄산음료",
    changeMode: "manual",
    avgPrice: 2840,
    avgProfit: 620,
    avgMargin: 21,
    sales: 990,
    avgSales: 141,
    revenue: 2811600,
    avgRevenue: 401657,
    contributionProfit: 613800,
    avgContributionProfit: 87685,
    compareRate: 12.4,
    originalPrice: 2990,
    changedPrice: 2840,
    dropAmount: 150,
  },
  {
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    category: "즉석식품",
    changeMode: "manual",
    avgPrice: 21400,
    avgProfit: 3400,
    avgMargin: 16,
    sales: 320,
    avgSales: 46,
    revenue: 6848000,
    avgRevenue: 978286,
    contributionProfit: 1088000,
    avgContributionProfit: 155429,
    compareRate: -4.1,
    originalPrice: 22500,
    changedPrice: 21400,
    dropAmount: 1100,
  },
  {
    productCode: "9744302258",
    productName: "오리온 초코파이 12입",
    category: "스낵과자",
    changeMode: "ai",
    avgPrice: 4800,
    avgProfit: 1300,
    avgMargin: 27,
    sales: 810,
    avgSales: 116,
    revenue: 3888000,
    avgRevenue: 555429,
    contributionProfit: 1053000,
    avgContributionProfit: 150429,
    compareRate: 6.9,
    originalPrice: 5100,
    changedPrice: 4800,
    dropAmount: 300,
  },
  {
    productCode: "9744302257",
    productName: "롯데 의성마늘 소시지 270g",
    category: "소시지",
    changeMode: "manual",
    avgPrice: 3980,
    avgProfit: 900,
    avgMargin: 23,
    sales: 430,
    avgSales: 61,
    revenue: 1711400,
    avgRevenue: 244486,
    contributionProfit: 387000,
    avgContributionProfit: 55286,
    compareRate: -2.5,
    originalPrice: 4100,
    changedPrice: 3980,
    dropAmount: 120,
  },
  {
    productCode: "9744302256",
    productName: "오뚜기 진라면 매운맛 120g, 5개",
    category: "라면",
    changeMode: "ai",
    avgPrice: 4200,
    avgProfit: 950,
    avgMargin: 23,
    sales: 890,
    avgSales: 127,
    revenue: 3738000,
    avgRevenue: 534000,
    contributionProfit: 845500,
    avgContributionProfit: 120786,
    compareRate: 8.2,
    originalPrice: 4500,
    changedPrice: 4200,
    dropAmount: 300,
  },
  {
    productCode: "9744302260",
    productName: "오뚜기 3분 카레 순한맛",
    category: "카레",
    changeMode: "ai",
    avgPrice: 2300,
    avgProfit: 600,
    avgMargin: 26,
    sales: 760,
    avgSales: 109,
    revenue: 1748000,
    avgRevenue: 249714,
    contributionProfit: 456000,
    avgContributionProfit: 65143,
    compareRate: 4.8,
    originalPrice: 2450,
    changedPrice: 2300,
    dropAmount: 150,
  },
  {
    productCode: "9744302261",
    productName: "코카콜라 제로 1.5L, 12개",
    category: "탄산음료",
    changeMode: "ai",
    avgPrice: 2790,
    avgProfit: 580,
    avgMargin: 20,
    sales: 940,
    avgSales: 134,
    revenue: 2622600,
    avgRevenue: 374657,
    contributionProfit: 545200,
    avgContributionProfit: 77886,
    compareRate: 9.1,
    originalPrice: 2920,
    changedPrice: 2790,
    dropAmount: 130,
  },
  {
    productCode: "9744302262",
    productName: "팔도 비빔면 5입",
    category: "라면",
    changeMode: "manual",
    avgPrice: 4100,
    avgProfit: 1100,
    avgMargin: 26,
    sales: 680,
    avgSales: 97,
    revenue: 2788000,
    avgRevenue: 398286,
    contributionProfit: 748000,
    avgContributionProfit: 106857,
    compareRate: -6.2,
    originalPrice: 4350,
    changedPrice: 4100,
    dropAmount: 250,
  },
  {
    productCode: "9744302263",
    productName: "오뚜기 컵밥 제육덮밥",
    category: "즉석식품",
    changeMode: "manual",
    avgPrice: 3980,
    avgProfit: 720,
    avgMargin: 18,
    sales: 510,
    avgSales: 73,
    revenue: 2029800,
    avgRevenue: 289971,
    contributionProfit: 367200,
    avgContributionProfit: 52457,
    compareRate: 1.2,
    originalPrice: 4100,
    changedPrice: 3980,
    dropAmount: 120,
  },
];

const PERIOD_MULTIPLIER = {
  daily: 0.18,
  weekly: 1,
  monthly: 4.15,
};

const MODE_MULTIPLIER = {
  all: 1,
  ai: 1,
  manual: 1,
};

const PERIOD_COMPARE_LABEL = {
  daily: "전일 대비",
  weekly: "전주 대비",
  monthly: "전월 대비",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function formatCurrency(value) {
  return `${formatNumber(Math.round(value || 0))}원`;
}

function formatCount(value) {
  return `${formatNumber(Math.round(value || 0))}개`;
}

function formatPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function getPeriodLabel(period) {
  return PERIOD_COMPARE_LABEL[period] || "전주 대비";
}

function getRangeFactor(startDate, endDate, period) {
  if (!startDate && !endDate) return 1;

  const defaultDays = period === "daily" ? 1 : period === "weekly" ? 7 : 30;
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(end.getTime() - (defaultDays - 1) * 24 * 60 * 60 * 1000);

  const diff = Math.max(
    1,
    Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1
  );

  return clamp(diff / defaultDays, 0.45, 3.5);
}

function getTrendLabels(period) {
  if (period === "daily") return ["0시", "3시", "6시", "9시", "12시", "18시", "24시"];
  if (period === "monthly") return ["1주", "2주", "3주", "4주", "5주", "6주", "7주"];
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}

function getModeFilteredItems(items, mode) {
  if (mode === "all") return items;
  return items.filter((item) => item.changeMode === mode);
}

function StatCard({ title, value, suffix, change, compareLabel }) {
  const isUp = change >= 0;

  return (
    <StatCardWrap>
      <StatTitle>{title}</StatTitle>
      <StatValueRow>
        <StatValue>{value}</StatValue>
        {suffix ? <StatSuffix>{suffix}</StatSuffix> : null}
      </StatValueRow>
      <StatMeta $up={isUp}>
        <span>{isUp ? "↑" : "↓"}</span>
        <span>{Math.abs(change).toFixed(1)}%</span>
        <span>{compareLabel}</span>
      </StatMeta>
    </StatCardWrap>
  );
}

export default function SalesStat() {
  const nav = useNavigate();

  const [mode, setMode] = useState("all");
  const [period, setPeriod] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [trendCategory, setTrendCategory] = useState("라면");
  const [productMixCategory, setProductMixCategory] = useState("소시지");

  const [hourlyDate, setHourlyDate] = useState("");
  const [hourlyKeyword, setHourlyKeyword] = useState("");

  const [rankingType, setRankingType] = useState("sales");
  const [rankingCategory, setRankingCategory] = useState("전체");
  const [rankingPeriod, setRankingPeriod] = useState("weekly");

  const globalFactor = useMemo(() => {
    const rangeFactor = getRangeFactor(startDate, endDate, period);
    return PERIOD_MULTIPLIER[period] * MODE_MULTIPLIER[mode] * rangeFactor;
  }, [startDate, endDate, period, mode]);

  const summary = useMemo(() => {
    const base = SUMMARY_BASE[mode];
    const compareLabel = getPeriodLabel(period);

    const gmv = Math.round(base.gmv * globalFactor);
    const volume = Math.round(base.volume * globalFactor);
    const profit = Math.round(base.profit * globalFactor);

    const marginDelta =
      mode === "ai" ? 2.4 : mode === "manual" ? -1.3 : 0.8;
    const margin = clamp(
      base.margin + marginDelta + (period === "monthly" ? 1.2 : period === "daily" ? -0.8 : 0),
      8,
      62
    );

    return {
      compareLabel,
      cards: [
        {
          title: "기간 총 매출액(GMV)",
          value: formatNumber(gmv),
          suffix: "원",
          change: base.change,
        },
        {
          title: "기간 총 판매량",
          value: formatNumber(volume),
          suffix: "개",
          change: base.change - 0.4,
        },
        {
          title: "기간 총 공헌이익",
          value: formatNumber(profit),
          suffix: "원",
          change: base.change + 0.2,
        },
        {
          title: "평균 공헌이익률",
          value: margin.toFixed(1),
          suffix: "%",
          change: base.change,
        },
      ],
    };
  }, [mode, period, globalFactor]);

  const categoryTrendData = useMemo(() => {
    const labels = getTrendLabels(period);
    const base = CATEGORY_TREND_BASE[trendCategory];
    const modeAdjust =
      mode === "ai" ? { sales: 1.12, profit: 1.22 } : mode === "manual" ? { sales: 0.92, profit: 0.85 } : { sales: 1, profit: 1 };
    const scale = globalFactor;

    return labels.map((label, index) => ({
      name: label,
      sales: Number((base.sales[index] * scale * modeAdjust.sales).toFixed(1)),
      profit: Number((base.profit[index] * scale * modeAdjust.profit).toFixed(1)),
    }));
  }, [trendCategory, period, mode, globalFactor]);

  const categoryShareData = useMemo(() => {
    const source = CATEGORY_SHARE_BASE[mode];
    return CATEGORY_KEYS.map((key) => ({
      name: key,
      value: source[key],
      color: CATEGORY_COLORS[key],
    }));
  }, [mode]);

  const hourlySelectedProduct = useMemo(() => {
    const source = getModeFilteredItems(RANKING_BASE, mode);
    const keyword = hourlyKeyword.trim().toLowerCase();

    if (!keyword) return source[0] || RANKING_BASE[0];

    return (
      source.find(
        (item) =>
          item.productCode.toLowerCase().includes(keyword) ||
          item.productName.toLowerCase().includes(keyword)
      ) || source[0] || RANKING_BASE[0]
    );
  }, [hourlyKeyword, mode]);

  const hourlyChartData = useMemo(() => {
    const priceBase = hourlySelectedProduct?.avgPrice || 1200;
    const localFactor = PERIOD_MULTIPLIER[period];
    const dateFactor = hourlyDate ? 1.06 : 1;

    return HOURLY_BASE.map((item, index) => {
      const modeGap =
        mode === "ai" ? -18 : mode === "manual" ? 22 : 0;

      const scale = clamp(globalFactor * 0.9, 0.4, 4.5);

      return {
        time: item.time,
        lowestPrice: Math.round(item.lowestPrice + (priceBase - 1250) * 0.12),
        myPrice: Math.round(item.myPrice + modeGap + (priceBase - 1250) * 0.1),
        sales: Math.round(item.sales * scale * localFactor * dateFactor),
        profit: Math.round(item.profit * scale * localFactor * dateFactor),
      };
    });
  }, [hourlySelectedProduct, globalFactor, period, mode, hourlyDate]);

  const inventoryRows = useMemo(() => {
    return getModeFilteredItems(INVENTORY_BASE, mode)
      .sort((a, b) => b.stockDays - a.stockDays)
      .slice(0, 5);
  }, [mode]);

  const productMixData = useMemo(() => {
    const source = PRODUCT_SHARE_BASE[productMixCategory];
    const scale = clamp(globalFactor * (mode === "ai" ? 1.1 : mode === "manual" ? 0.92 : 1), 0.4, 4.2);

    return source.map((item) => ({
      label: item.label,
      sales: Number((item.sales * scale).toFixed(1)),
      profit: Number((item.profit * scale).toFixed(1)),
      discount: Number((item.discount * scale).toFixed(1)),
    }));
  }, [productMixCategory, mode, globalFactor]);

  const rankingRows = useMemo(() => {
    let rows = getModeFilteredItems(RANKING_BASE, mode);

    if (rankingCategory !== "전체") {
      rows = rows.filter((item) => item.category === rankingCategory);
    }

    const periodScale =
      rankingPeriod === "daily" ? 0.17 : rankingPeriod === "weekly" ? 1 : 4.1;
    const compareBase =
      rankingPeriod === "daily"
        ? 1
        : rankingPeriod === "weekly"
        ? 7
        : 30;

    const mapped = rows.map((item) => ({
      ...item,
      rankingValue:
        rankingType === "sales"
          ? item.sales * periodScale
          : rankingType === "revenue"
          ? item.revenue * periodScale
          : rankingType === "profit"
          ? item.contributionProfit * periodScale
          : item.dropAmount,
      sales: Math.round(item.sales * periodScale),
      avgSales:
        rankingPeriod === "daily"
          ? Math.round(item.avgSales)
          : Math.round((item.sales * periodScale) / compareBase),
      revenue: Math.round(item.revenue * periodScale),
      avgRevenue:
        rankingPeriod === "daily"
          ? Math.round(item.avgRevenue)
          : Math.round((item.revenue * periodScale) / compareBase),
      contributionProfit: Math.round(item.contributionProfit * periodScale),
      avgContributionProfit:
        rankingPeriod === "daily"
          ? Math.round(item.avgContributionProfit)
          : Math.round((item.contributionProfit * periodScale) / compareBase),
    }));

    return mapped
      .sort((a, b) => b.rankingValue - a.rankingValue)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [mode, rankingType, rankingCategory, rankingPeriod]);

  const rankingCompareLabel = getPeriodLabel(rankingPeriod);

  const rankingColumns = useMemo(() => {
    const common = [
      { key: "rank", label: "순위", width: "60px" },
      { key: "productCode", label: "상품코드", width: "120px", isLink: true },
      { key: "productName", label: "상품명", width: "230px" },
      { key: "category", label: "카테고리", width: "120px" },
    ];

    if (rankingType === "sales") {
      return [
        ...common,
        { key: "sales", label: "판매량", width: "100px", formatter: formatCount },
        { key: "avgSales", label: "일평균판매량", width: "120px", formatter: formatCount },
        { key: "compareRate", label: rankingCompareLabel, width: "110px", isDelta: true },
        { key: "avgPrice", label: "평균판매가", width: "110px", formatter: formatCurrency },
        { key: "avgProfit", label: "평균이익", width: "110px", formatter: formatCurrency },
        { key: "avgMargin", label: "평균이익률", width: "100px", formatter: (v) => `${v}%` },
      ];
    }

    if (rankingType === "revenue") {
      return [
        ...common,
        { key: "revenue", label: "매출", width: "110px", formatter: formatCurrency },
        { key: "avgRevenue", label: "일평균매출", width: "120px", formatter: formatCurrency },
        { key: "compareRate", label: rankingCompareLabel, width: "110px", isDelta: true },
        { key: "avgPrice", label: "평균판매가", width: "110px", formatter: formatCurrency },
        { key: "avgProfit", label: "평균이익", width: "110px", formatter: formatCurrency },
        { key: "avgMargin", label: "평균이익률", width: "100px", formatter: (v) => `${v}%` },
      ];
    }

    if (rankingType === "profit") {
      return [
        ...common,
        { key: "contributionProfit", label: "공헌이익", width: "110px", formatter: formatCurrency },
        { key: "avgContributionProfit", label: "일평균이익", width: "120px", formatter: formatCurrency },
        { key: "compareRate", label: rankingCompareLabel, width: "110px", isDelta: true },
        { key: "avgPrice", label: "평균판매가", width: "110px", formatter: formatCurrency },
        { key: "avgProfit", label: "평균이익", width: "110px", formatter: formatCurrency },
        { key: "avgMargin", label: "평균이익률", width: "100px", formatter: (v) => `${v}%` },
      ];
    }

    return [
      ...common,
      { key: "originalPrice", label: "기존판매가", width: "110px", formatter: formatCurrency },
      { key: "changedPrice", label: "변경판매가", width: "110px", formatter: formatCurrency },
      { key: "dropAmount", label: "하락폭", width: "90px", formatter: formatCurrency },
    ];
  }, [rankingType, rankingCompareLabel]);

  const handleProductCodeClick = (code) => {
    nav(`/admin/product-update/${code}`, {
      state: { focusSection: "ai-pricing" },
    });
  };

  return (
    <PageWrap>
      <TopRow>
        <Title>판매 현황</Title>
      </TopRow>

      <ModeTabs>
        {MODE_OPTIONS.map((item) => (
          <ModeTabButton
            key={item.key}
            type="button"
            $active={mode === item.key}
            onClick={() => setMode(item.key)}
          >
            {item.label}
          </ModeTabButton>
        ))}
      </ModeTabs>

      <GlobalFilterRow>
        <DateInputWrap>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DateIconWrap>
            <CalendarDays size={15} />
          </DateIconWrap>
        </DateInputWrap>

        <DateInputWrap>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <DateIconWrap>
            <CalendarDays size={15} />
          </DateIconWrap>
        </DateInputWrap>

        <SelectWrap>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            {PERIOD_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <ChevronIcon>
            <ChevronDown size={14} />
          </ChevronIcon>
        </SelectWrap>
      </GlobalFilterRow>

      <SummaryGrid>
        {summary.cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            suffix={card.suffix}
            change={card.change}
            compareLabel={summary.compareLabel}
          />
        ))}
      </SummaryGrid>

      <ChartTwoCol>
        <Panel>
          <PanelTitleRow>
            <PanelTitle>카테고리 별 판매 추이</PanelTitle>
            <MiniLegendRow>
              <LegendDot $color="#2563eb" /> 매출
              <LegendDot $color="#fbbf24" /> 공헌이익
            </MiniLegendRow>
          </PanelTitleRow>

          <InnerTabs>
            {CATEGORY_KEYS.map((key) => (
              <InnerTabButton
                key={key}
                type="button"
                $active={trendCategory === key}
                onClick={() => setTrendCategory(key)}
              >
                {key}
              </InnerTabButton>
            ))}
          </InnerTabs>

          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryTrendData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9aa3b2" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9aa3b2" }} />
                <Tooltip
                  formatter={(value) => [`${value}만`, ""]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>

        <Panel>
          <PanelTitle>카테고리 별 판매 비중</PanelTitle>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShareData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {categoryShareData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, color: "#6b7280" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
      </ChartTwoCol>

      <WidePanel>
        <PanelHeaderSplit>
          <PanelTitle>시간대별 최저가 변동 추이</PanelTitle>

          <PanelHeaderFilters>
            <DateInputWrap $small>
              <DateInput
                type="date"
                value={hourlyDate}
                onChange={(e) => setHourlyDate(e.target.value)}
              />
              <DateIconWrap>
                <CalendarDays size={15} />
              </DateIconWrap>
            </DateInputWrap>

            <SearchInputWrap>
              <SearchIconWrap>
                <Search size={15} />
              </SearchIconWrap>
              <SearchInput
                value={hourlyKeyword}
                onChange={(e) => setHourlyKeyword(e.target.value)}
                placeholder="상품명, 상품코드로 검색"
              />
            </SearchInputWrap>
          </PanelHeaderFilters>
        </PanelHeaderSplit>

        <SubInfoText>
          상품코드 : {hourlySelectedProduct.productCode} / 상품명 : {hourlySelectedProduct.productName}
        </SubInfoText>

        <ChartBox $tall>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={hourlyChartData}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#9aa3b2" }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: "#9aa3b2" }}
                tickFormatter={(value) => `${Math.round(value / 10000)}만`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "#9aa3b2" }}
                tickFormatter={(value) => `${Math.round(value)}원`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
                formatter={(value, name) => {
                  if (name === "최저가" || name === "나의 판매가") {
                    return [formatCurrency(value), name];
                  }
                  return [formatCurrency(value), name];
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
              />
              <Bar yAxisId="left" dataKey="sales" name="판매량" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar yAxisId="left" dataKey="profit" name="공헌이익" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={14} />
              <Line yAxisId="right" type="monotone" dataKey="lowestPrice" name="최저가" stroke="#ef4444" strokeWidth={3} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="myPrice" name="나의 판매가" stroke="#22c55e" strokeWidth={3} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartBox>
      </WidePanel>

      <ChartTwoCol>
        <Panel>
          <PanelTitleRow>
            <PanelTitle>악성 재고 상품</PanelTitle>
            <MiniActionText>&lt; 전략 수정 추천 &gt;</MiniActionText>
          </PanelTitleRow>

          <MiniTableWrap>
            <MiniTable>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>상품코드</th>
                  <th>상품명</th>
                  <th>판매가</th>
                  <th>재고일수</th>
                </tr>
              </thead>
              <tbody>
                {inventoryRows.map((row, index) => (
                  <tr key={row.productCode}>
                    <td>{index + 1}</td>
                    <td>
                      <CodeButton
                        type="button"
                        onClick={() => handleProductCodeClick(row.productCode)}
                      >
                        {row.productCode}
                      </CodeButton>
                    </td>
                    <td>{row.productName}</td>
                    <td>{formatCurrency(row.salePrice)}</td>
                    <td>{row.stockDays}일</td>
                  </tr>
                ))}
              </tbody>
            </MiniTable>
          </MiniTableWrap>
        </Panel>

        <Panel>
          <PanelTitle>상품별 판매 비중</PanelTitle>

          <InnerTabs>
            {CATEGORY_KEYS.map((key) => (
              <InnerTabButton
                key={key}
                type="button"
                $active={productMixCategory === key}
                onClick={() => setProductMixCategory(key)}
              >
                {key}
              </InnerTabButton>
            ))}
          </InnerTabs>

          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productMixData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9aa3b2" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9aa3b2" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="discount" stackId="a" name="가격인하" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" stackId="a" name="공헌이익" fill="#f8b4b4" />
                <Bar dataKey="sales" stackId="a" name="판매량" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
      </ChartTwoCol>

      <WidePanel>
        <PanelHeaderSplit>
          <PanelTitle>랭킹 TOP 5</PanelTitle>

          <PanelHeaderFilters>
            <SelectWrap>
              <Select value={rankingType} onChange={(e) => setRankingType(e.target.value)}>
                {RANKING_TYPE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <ChevronIcon>
                <ChevronDown size={14} />
              </ChevronIcon>
            </SelectWrap>

            <SelectWrap>
              <Select value={rankingCategory} onChange={(e) => setRankingCategory(e.target.value)}>
                <option value="전체">전체</option>
                {CATEGORY_KEYS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <ChevronIcon>
                <ChevronDown size={14} />
              </ChevronIcon>
            </SelectWrap>

            <SelectWrap>
              <Select value={rankingPeriod} onChange={(e) => setRankingPeriod(e.target.value)}>
                {PERIOD_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <ChevronIcon>
                <ChevronDown size={14} />
              </ChevronIcon>
            </SelectWrap>
          </PanelHeaderFilters>
        </PanelHeaderSplit>

        <RankingTableScroll>
          <RankingTable>
            <thead>
              <tr>
                {rankingColumns.map((column) => (
                  <th key={column.key} style={{ width: column.width }}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankingRows.length === 0 ? (
                <tr>
                  <td colSpan={rankingColumns.length}>
                    <EmptyCell>
                      <AlertTriangle size={18} />
                      조건에 맞는 데이터가 없습니다.
                    </EmptyCell>
                  </td>
                </tr>
              ) : (
                rankingRows.map((row) => (
                  <tr key={row.productCode}>
                    {rankingColumns.map((column) => {
                      const value = row[column.key];

                      if (column.isLink) {
                        return (
                          <td key={column.key}>
                            <CodeButton
                              type="button"
                              onClick={() => handleProductCodeClick(row.productCode)}
                            >
                              {value}
                            </CodeButton>
                          </td>
                        );
                      }

                      if (column.isDelta) {
                        const isNegative = value < 0;
                        return (
                          <td key={column.key}>
                            <DeltaBadge $negative={isNegative}>
                              {formatPercent(value)}
                            </DeltaBadge>
                          </td>
                        );
                      }

                      return (
                        <td key={column.key}>
                          {column.formatter ? column.formatter(value) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </RankingTable>
        </RankingTableScroll>
      </WidePanel>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  min-height: 100%;
  background: #f6f8fb;
  padding: 24px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 28px;
  font-weight: 800;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const BellWrap = styled.div`
  position: relative;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.span`
  position: absolute;
  top: -7px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #8b7cf6;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #22c55e;
    border: 2px solid #f6f8fb;
  }
`;

const ModeTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 18px;
  border-bottom: 1px solid #d9e0ea;
`;

const ModeTabButton = styled.button`
  min-width: 160px;
  height: 44px;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#2563eb" : "#1f2937")};
  font-size: 18px;
  font-weight: 800;
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 3px;
    background: ${({ $active }) => ($active ? "#2563eb" : "transparent")};
    border-radius: 999px;
  }
`;

const GlobalFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const sharedField = css`
  height: 40px;
  border: 1px solid #e7ebf1;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const DateInputWrap = styled.div`
  position: relative;
  width: ${({ $small }) => ($small ? "140px" : "150px")};
`;

const DateInput = styled.input`
  ${sharedField};
  width: 100%;
  padding: 0 36px 0 12px;

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }
`;

const DateIconWrap = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #9aa3b2;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectWrap = styled.div`
  position: relative;
  width: 120px;
`;

const Select = styled.select`
  ${sharedField};
  width: 100%;
  padding: 0 34px 0 12px;
  appearance: none;
`;

const ChevronIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #9aa3b2;
  pointer-events: none;
`;

const SearchInputWrap = styled.div`
  position: relative;
  width: 220px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #9aa3b2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  ${sharedField};
  width: 100%;
  padding: 0 12px 0 36px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const StatCardWrap = styled.div`
  padding: 18px 18px 16px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #edf1f6;
`;

const StatTitle = styled.div`
  color: #374151;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
`;

const StatValue = styled.div`
  color: #111827;
  font-size: 26px;
  font-weight: 900;
`;

const StatSuffix = styled.div`
  color: #4b5563;
  font-size: 18px;
  font-weight: 700;
`;

const StatMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $up }) => ($up ? "#22c55e" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;

  span:last-child {
    color: #9aa3b2;
    font-weight: 600;
  }
`;

const ChartTwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  padding: 16px;
  border: 1px solid #edf1f6;
  border-radius: 18px;
  background: #ffffff;
`;

const WidePanel = styled.section`
  padding: 16px;
  border: 1px solid #edf1f6;
  border-radius: 18px;
  background: #ffffff;
  margin-bottom: 18px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 800;
`;

const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const MiniLegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
`;

const LegendDot = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  margin-right: 4px;
`;

const InnerTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const InnerTabButton = styled.button`
  min-width: 62px;
  height: 32px;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "#2563eb" : "#4b5563")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const ChartBox = styled.div`
  width: 100%;
  height: ${({ $tall }) => ($tall ? "320px" : "260px")};
`;

const PanelHeaderSplit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const PanelHeaderFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SubInfoText = styled.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const MiniActionText = styled.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;

const MiniTableWrap = styled.div`
  overflow-x: auto;
`;

const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 10px;
    border-bottom: 1px solid #eef2f7;
    font-size: 13px;
    text-align: left;
    white-space: nowrap;
  }

  th {
    color: #9aa3b2;
    font-weight: 700;
  }

  td {
    color: #1f2937;
  }
`;

const RankingTableScroll = styled.div`
  overflow-x: auto;
`;

const RankingTable = styled.table`
  width: 100%;
  min-width: 1080px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid #eef2f7;
    text-align: center;
    white-space: nowrap;
    font-size: 13px;
  }

  th {
    color: #9aa3b2;
    font-weight: 700;
  }

  td {
    color: #1f2937;
    font-weight: 500;
  }
`;

const CodeButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const DeltaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
  background: ${({ $negative }) => ($negative ? "#ffe7e7" : "#dcf7e8")};
  color: ${({ $negative }) => ($negative ? "#ef5350" : "#18b663")};
`;

const EmptyCell = styled.div`
  min-height: 120px;
  color: #9aa3b2;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;