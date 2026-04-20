import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Search, ChevronDown, Info, TriangleAlert } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PERIOD_OPTIONS = [
  { value: "daily", label: "일간" },
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
];

const CATEGORY_OPTIONS = ["라면", "소시지", "스낵과자", "즉석식품", "카레", "탄산음료"];

const CATEGORY_COLORS = {
  라면: "#2563eb",
  소시지: "#60a5fa",
  스낵과자: "#f59e0b",
  즉석식품: "#ef4444",
  카레: "#a855f7",
  탄산음료: "#f59eae",
};

const PRODUCT_CATALOG = [
  {
    productCode: "9744302255",
    productName: "농심 신라면컵 114g, 1개",
    category: "라면",
    categoryPath: "가공 / 간편식품 > 라면",
    basePrice: 1250,
    costPrice: 850,
    initStock: 210,
    safetyStock: 60,
    minPriceLimit: 1150,
    maxPriceLimit: 1390,
    baseDailyQty: 27,
  },
  {
    productCode: "9744302256",
    productName: "오뚜기 진라면 매운맛 120g, 5개",
    category: "라면",
    categoryPath: "가공 / 간편식품 > 라면",
    basePrice: 4200,
    costPrice: 3100,
    initStock: 180,
    safetyStock: 55,
    minPriceLimit: 3900,
    maxPriceLimit: 4500,
    baseDailyQty: 17,
  },
  {
    productCode: "9744302257",
    productName: "롯데 의성마늘 소시지 270g",
    category: "소시지",
    categoryPath: "냉장 / 육가공 > 소시지",
    basePrice: 3980,
    costPrice: 2800,
    initStock: 120,
    safetyStock: 35,
    minPriceLimit: 3720,
    maxPriceLimit: 4320,
    baseDailyQty: 8,
  },
  {
    productCode: "9744302258",
    productName: "오리온 초코파이 12입",
    category: "스낵과자",
    categoryPath: "간식 / 음료 > 스낵과자",
    basePrice: 4800,
    costPrice: 3500,
    initStock: 155,
    safetyStock: 40,
    minPriceLimit: 4500,
    maxPriceLimit: 5200,
    baseDailyQty: 14,
  },
  {
    productCode: "9744302259",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    category: "즉석식품",
    categoryPath: "가공 / 간편식품 > 즉석식품",
    basePrice: 21400,
    costPrice: 17500,
    initStock: 90,
    safetyStock: 22,
    minPriceLimit: 19800,
    maxPriceLimit: 22900,
    baseDailyQty: 5,
  },
  {
    productCode: "9744302260",
    productName: "오뚜기 3분 카레 순한맛",
    category: "카레",
    categoryPath: "가공 / 간편식품 > 카레",
    basePrice: 2300,
    costPrice: 1500,
    initStock: 165,
    safetyStock: 38,
    minPriceLimit: 2150,
    maxPriceLimit: 2550,
    baseDailyQty: 13,
  },
  {
    productCode: "9744302261",
    productName: "코카콜라 제로 1.5L, 12개",
    category: "탄산음료",
    categoryPath: "간식 / 음료 > 탄산음료",
    basePrice: 2790,
    costPrice: 2100,
    initStock: 175,
    safetyStock: 42,
    minPriceLimit: 2610,
    maxPriceLimit: 2950,
    baseDailyQty: 19,
  },
  {
    productCode: "9744302262",
    productName: "코카콜라 클래식 1.5L, 12개",
    category: "탄산음료",
    categoryPath: "간식 / 음료 > 탄산음료",
    basePrice: 2840,
    costPrice: 2180,
    initStock: 168,
    safetyStock: 42,
    minPriceLimit: 2680,
    maxPriceLimit: 3020,
    baseDailyQty: 18,
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function startOfMonth(date) {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
}

function diffDays(start, end) {
  const ms = startOfDay(end).getTime() - startOfDay(start).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
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
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatDeltaPercent(value) {
  const numeric = Number(value || 0);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(1)}%`;
}

function formatShortDate(date) {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatMonth(date) {
  const d = new Date(date);
  return `${d.getMonth() + 1}월`;
}

function formatWeekLabel(date) {
  const base = startOfWeek(date);
  return `${base.getMonth() + 1}/${base.getDate()}주`;
}

function getCompareLabel(period) {
  if (period === "daily") return "vs last day";
  if (period === "monthly") return "vs last month";
  return "vs last 7 days";
}

function resolveRange(startDate, endDate, period) {
  const today = startOfDay(new Date());

  if (startDate && endDate) {
    return {
      start: startOfDay(new Date(startDate)),
      end: startOfDay(new Date(endDate)),
    };
  }

  if (period === "daily") {
    return { start: addDays(today, -6), end: today };
  }

  if (period === "monthly") {
    return { start: addDays(today, -179), end: today };
  }

  return { start: addDays(today, -41), end: today };
}

function getPreviousRange(start, end) {
  const days = diffDays(start, end) + 1;
  const prevEnd = addDays(start, -1);
  const prevStart = addDays(prevEnd, -(days - 1));
  return { start: prevStart, end: prevEnd };
}

function inRange(date, start, end) {
  const time = startOfDay(new Date(date)).getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function getBucketKey(date, period) {
  const d = new Date(date);

  if (period === "daily") {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  if (period === "monthly") {
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  }

  const weekStart = startOfWeek(d);
  return `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}-${weekStart.getDate()}`;
}

function getBucketLabel(date, period) {
  if (period === "daily") return formatShortDate(date);
  if (period === "monthly") return formatMonth(date);
  return formatWeekLabel(date);
}

function bucketSortValue(key, period) {
  if (period === "monthly") {
    const [year, month] = key.split("-").map(Number);
    return new Date(year, month - 1, 1).getTime();
  }
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function getReason({
  appliedPrice,
  previousPrice,
  stockQty,
  safetyStock,
  minPriceLimit,
  maxPriceLimit,
}) {
  if (appliedPrice <= minPriceLimit + 20) return "최저가 제한";
  if (appliedPrice >= maxPriceLimit - 20) return "희망조정가 제한";
  if (stockQty <= safetyStock * 1.1) {
    return appliedPrice >= previousPrice ? "품절임박 가격인상" : "품절임박 가격인하";
  }
  return appliedPrice < previousPrice ? "최저가변동 가격인하" : "최저가변동 가격인상";
}

function generateAiMockDataset() {
  const today = startOfDay(new Date());
  const startDate = addDays(today, -89);

  const records = [];
  const historyEvents = [];

  PRODUCT_CATALOG.forEach((product, productIndex) => {
    let stock = product.initStock;

    for (let dayIndex = 0; dayIndex < 90; dayIndex += 1) {
      const currentDate = addDays(startDate, dayIndex);
      const weekday = currentDate.getDay();
      const weekendBoost = weekday === 0 || weekday === 6 ? 1.08 : 1.0;
      const seasonality = 1 + Math.sin((dayIndex + productIndex) / 5) * 0.12;
      const trend = 1 + (dayIndex / 90) * 0.08;

      if (stock <= product.safetyStock && dayIndex % 9 === 0) {
        stock += 60 + ((productIndex + dayIndex) % 3) * 25;
      }

      const previousPrice =
        product.basePrice +
        Math.round(Math.sin((dayIndex + productIndex) / 4) * 90);

      const rawApplied =
        product.basePrice +
        Math.round(Math.sin((dayIndex + productIndex) / 6) * 120) +
        ((dayIndex + productIndex) % 5 - 2) * 15;

      const appliedPrice = clamp(
        rawApplied,
        product.minPriceLimit,
        product.maxPriceLimit
      );

      const aiQty = Math.max(
        1,
        Math.round(product.baseDailyQty * weekendBoost * seasonality * trend)
      );

      const actualQty = Math.min(aiQty, stock);

      const manualPredQty = Math.max(
        1,
        Math.round(actualQty * (0.88 + ((dayIndex + productIndex) % 5) * 0.04))
      );

      const manualPredPrice =
        product.basePrice +
        Math.round(Math.cos((dayIndex + productIndex) / 7) * 80);

      const aiRevenue = actualQty * appliedPrice;
      const aiProfit = actualQty * (appliedPrice - product.costPrice);

      const manualRevenue = manualPredQty * manualPredPrice;
      const manualProfit = manualPredQty * (manualPredPrice - product.costPrice);

      const lowestShare = clamp(
        28 +
          Math.sin((dayIndex + productIndex) / 4) * 10 +
          (appliedPrice <= manualPredPrice ? 6 : -4),
        8,
        78
      );

      const priceChangeCount =
        (dayIndex + productIndex) % 6 === 0
          ? 2
          : (dayIndex + productIndex) % 4 === 0
          ? 1
          : 0;

      stock = Math.max(0, stock - actualQty);

      const reason = getReason({
        appliedPrice,
        previousPrice,
        stockQty: stock,
        safetyStock: product.safetyStock,
        minPriceLimit: product.minPriceLimit,
        maxPriceLimit: product.maxPriceLimit,
      });

      const record = {
        date: currentDate,
        productCode: product.productCode,
        productName: product.productName,
        category: product.category,
        categoryPath: product.categoryPath,
        aiEnabled: true,
        aiRevenue,
        aiProfit,
        manualRevenue,
        manualProfit,
        salesQty: actualQty,
        avgMargin: aiRevenue > 0 ? (aiProfit / aiRevenue) * 100 : 0,
        lowestShare,
        priceChangeCount,
        avgPrice: appliedPrice,
        previousPrice,
        manualPredPrice,
        stockQty: stock,
        costPrice: product.costPrice,
        minPriceLimit: product.minPriceLimit,
        maxPriceLimit: product.maxPriceLimit,
        safetyStock: product.safetyStock,
        reason,
      };

      records.push(record);

      if (priceChangeCount > 0) {
        historyEvents.push({
          occurredAt: new Date(currentDate.getTime() + 1000 * 60 * 60 * 9),
          productCode: product.productCode,
          productName: product.productName,
          category: product.category,
          reason,
          direction:
            appliedPrice < previousPrice
              ? "down"
              : appliedPrice > previousPrice
              ? "up"
              : "flat",
        });
      }
    }
  });

  return { records, historyEvents };
}

function aggregateSummary(records, previousRecords) {
  const revenue = records.reduce((acc, item) => acc + item.aiRevenue, 0);
  const profit = records.reduce((acc, item) => acc + item.aiProfit, 0);
  const averageLowestShare =
    records.length > 0
      ? records.reduce((acc, item) => acc + item.lowestShare, 0) / records.length
      : 0;
  const changeCount = records.reduce((acc, item) => acc + item.priceChangeCount, 0);

  const previousRevenue = previousRecords.reduce((acc, item) => acc + item.aiRevenue, 0);
  const previousProfit = previousRecords.reduce((acc, item) => acc + item.aiProfit, 0);
  const previousLowestShare =
    previousRecords.length > 0
      ? previousRecords.reduce((acc, item) => acc + item.lowestShare, 0) /
        previousRecords.length
      : 0;
  const previousChangeCount = previousRecords.reduce(
    (acc, item) => acc + item.priceChangeCount,
    0
  );

  const revenueChange =
    previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0;
  const profitChange =
    previousProfit > 0 ? ((profit - previousProfit) / previousProfit) * 100 : 0;
  const lowestShareChange =
    previousLowestShare > 0
      ? ((averageLowestShare - previousLowestShare) / previousLowestShare) * 100
      : 0;
  const changeCountRate =
    previousChangeCount > 0
      ? ((changeCount - previousChangeCount) / previousChangeCount) * 100
      : 0;

  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    revenue,
    profit,
    averageLowestShare,
    changeCount,
    margin,
    revenueChange,
    profitChange,
    lowestShareChange,
    changeCountRate,
  };
}

function aggregateSeriesByPeriod(records, period, mapper) {
  const grouped = new Map();

  records.forEach((item) => {
    const key = getBucketKey(item.date, period);
    const label = getBucketLabel(item.date, period);

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        label,
        aiRevenue: 0,
        aiProfit: 0,
        manualRevenue: 0,
        manualProfit: 0,
      });
    }

    const target = grouped.get(key);
    target.aiRevenue += mapper(item).aiRevenue;
    target.aiProfit += mapper(item).aiProfit;
    target.manualRevenue += mapper(item).manualRevenue;
    target.manualProfit += mapper(item).manualProfit;
  });

  return [...grouped.values()]
    .sort((a, b) => bucketSortValue(a.key, period) - bucketSortValue(b.key, period))
    .map((item) => ({
      label: item.label,
      aiRevenue: Math.round(item.aiRevenue),
      aiProfit: Math.round(item.aiProfit),
      manualRevenue: Math.round(item.manualRevenue),
      manualProfit: Math.round(item.manualProfit),
    }));
}

function aggregateCategoryComparison(currentRecords, previousRecords) {
  return CATEGORY_OPTIONS.map((category) => {
    const currentRows = currentRecords.filter((item) => item.category === category);
    const previousRows = previousRecords.filter((item) => item.category === category);

    const currentRevenue = currentRows.reduce((acc, item) => acc + item.aiRevenue, 0);
    const currentProfit = currentRows.reduce((acc, item) => acc + item.aiProfit, 0);
    const currentSales = currentRows.reduce((acc, item) => acc + item.salesQty, 0);
    const currentMargin =
      currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;

    const previousRevenue = previousRows.reduce((acc, item) => acc + item.aiRevenue, 0);
    const previousProfit = previousRows.reduce((acc, item) => acc + item.aiProfit, 0);
    const previousSales = previousRows.reduce((acc, item) => acc + item.salesQty, 0);
    const previousMargin =
      previousRevenue > 0 ? (previousProfit / previousRevenue) * 100 : 0;

    const aiRevenue = currentRevenue;
    const aiProfit = currentProfit;
    const aiSales = currentSales;
    const aiMargin = currentMargin;

    const manualRevenue = currentRows.reduce((acc, item) => acc + item.manualRevenue, 0);
    const manualProfit = currentRows.reduce((acc, item) => acc + item.manualProfit, 0);
    const manualSales = currentRows.reduce(
      (acc, item) =>
        acc + Math.round(item.manualRevenue / Math.max(item.manualPredPrice || 1, 1)),
      0
    );
    const manualMargin =
      manualRevenue > 0 ? (manualProfit / manualRevenue) * 100 : 0;

    return {
      category,
      performance: {
        revenue: currentRevenue,
        profit: currentProfit,
        sales: currentSales,
        margin: currentMargin,
        revenueChange:
          previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : 0,
        profitChange:
          previousProfit > 0
            ? ((currentProfit - previousProfit) / previousProfit) * 100
            : 0,
        salesChange:
          previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0,
        marginChange: currentMargin - previousMargin,
      },
      ai: {
        revenue: aiRevenue,
        profit: aiProfit,
        sales: aiSales,
        margin: aiMargin,
      },
      manual: {
        revenue: manualRevenue,
        profit: manualProfit,
        sales: manualSales,
        margin: manualMargin,
      },
    };
  });
}

function buildHistoryRows(events, start, end) {
  return events
    .filter((event) => inRange(event.occurredAt, start, end))
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
}

function buildStrategyRows(currentRecords, previousRecords) {
  const previousMap = new Map();

  previousRecords.forEach((item) => {
    if (!previousMap.has(item.productCode)) {
      previousMap.set(item.productCode, []);
    }
    previousMap.get(item.productCode).push(item);
  });

  const grouped = new Map();

  currentRecords.forEach((item) => {
    if (!grouped.has(item.productCode)) {
      grouped.set(item.productCode, {
        productCode: item.productCode,
        productName: item.productName,
        category: item.categoryPath,
        revenue: 0,
        profit: 0,
        salesQty: 0,
        latestStock: item.stockQty,
        avgPriceTotal: 0,
        avgPriceCount: 0,
        latestReason: item.reason,
        limitReason: item.reason,
      });
    }

    const target = grouped.get(item.productCode);
    target.revenue += item.aiRevenue;
    target.profit += item.aiProfit;
    target.salesQty += item.salesQty;
    target.latestStock = item.stockQty;
    target.avgPriceTotal += item.avgPrice;
    target.avgPriceCount += 1;
    target.latestReason = item.reason;
    target.limitReason = item.reason;
  });

  const rows = [...grouped.values()].map((item) => {
    const previousItems = previousMap.get(item.productCode) || [];
    const previousRevenue = previousItems.reduce((acc, row) => acc + row.aiRevenue, 0);
    const compareRate =
      previousRevenue > 0 ? ((item.revenue - previousRevenue) / previousRevenue) * 100 : 0;

    const avgPrice =
      item.avgPriceCount > 0 ? item.avgPriceTotal / item.avgPriceCount : 0;
    const margin = item.revenue > 0 ? (item.profit / item.revenue) * 100 : 0;

    return {
      productCode: item.productCode,
      productName: item.productName,
      reason: item.limitReason,
      salesQty: item.salesQty,
      stock: item.latestStock,
      compareRate,
      salePrice: avgPrice,
      profit: item.profit / Math.max(item.salesQty, 1),
      margin,
      category: item.category,
    };
  });

  return rows
    .sort((a, b) => a.compareRate - b.compareRate || a.stock - b.stock)
    .slice(0, 5)
    .map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
}

function getChangeMeta(value) {
  const numeric = Number(value || 0);
  return {
    isPositive: numeric >= 0,
    text: formatDeltaPercent(numeric),
  };
}

function SummaryCard({
  title,
  mainValue,
  mainSuffix,
  subValue,
  change,
  compareLabel,
}) {
  const { isPositive, text } = getChangeMeta(change);

  return (
    <SummaryCardWrap>
      <SummaryCardTitle>{title}</SummaryCardTitle>

      <SummaryCardValueRow>
        <SummaryCardMainValue>{mainValue}</SummaryCardMainValue>
        {mainSuffix ? <SummaryCardMainSuffix>{mainSuffix}</SummaryCardMainSuffix> : null}
        {subValue ? <SummaryCardSubValue>{subValue}</SummaryCardSubValue> : null}
      </SummaryCardValueRow>

      <SummaryCardMeta $positive={isPositive}>
        <span>{isPositive ? "↑" : "↓"}</span>
        <span>{text.replace("+", "")}</span>
        <span>{compareLabel}</span>
      </SummaryCardMeta>
    </SummaryCardWrap>
  );
}

export default function AIPriceStat() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [period, setPeriod] = useState("weekly");

  const [simulationKeyword, setSimulationKeyword] = useState("");
  const [simulationCategory, setSimulationCategory] = useState("전체");
  const [simulationPeriod, setSimulationPeriod] = useState("weekly");

  const [comparePeriod, setComparePeriod] = useState("weekly");
  const [performanceCategory, setPerformanceCategory] = useState("소시지");

  const { records, historyEvents } = useMemo(() => generateAiMockDataset(), []);

  const currentRange = useMemo(
    () => resolveRange(startDate, endDate, period),
    [startDate, endDate, period]
  );

  const previousRange = useMemo(
    () => getPreviousRange(currentRange.start, currentRange.end),
    [currentRange]
  );

  const currentRecords = useMemo(
    () =>
      records.filter((item) => inRange(item.date, currentRange.start, currentRange.end)),
    [records, currentRange]
  );

  const previousRecords = useMemo(
    () =>
      records.filter((item) => inRange(item.date, previousRange.start, previousRange.end)),
    [records, previousRange]
  );

  const summary = useMemo(
    () => aggregateSummary(currentRecords, previousRecords),
    [currentRecords, previousRecords]
  );

  const compareLabel = useMemo(() => getCompareLabel(period), [period]);

  const simulationRange = useMemo(
    () => resolveRange(startDate, endDate, simulationPeriod),
    [startDate, endDate, simulationPeriod]
  );

  const simulationFilteredRecords = useMemo(() => {
    const keyword = simulationKeyword.trim().toLowerCase();

    return records.filter((item) => {
      const inDate = inRange(item.date, simulationRange.start, simulationRange.end);
      const inCategory =
        simulationCategory === "전체" ? true : item.category === simulationCategory;
      const inKeyword =
        !keyword ||
        item.productCode.toLowerCase().includes(keyword) ||
        item.productName.toLowerCase().includes(keyword);

      return inDate && inCategory && inKeyword;
    });
  }, [records, simulationRange, simulationCategory, simulationKeyword]);

  const simulationChartData = useMemo(() => {
    return aggregateSeriesByPeriod(simulationFilteredRecords, simulationPeriod, (item) => ({
      aiRevenue: item.aiRevenue,
      aiProfit: item.aiProfit,
      manualRevenue: item.manualRevenue,
      manualProfit: item.manualProfit,
    }));
  }, [simulationFilteredRecords, simulationPeriod]);

  const compareRange = useMemo(
    () => resolveRange(startDate, endDate, comparePeriod),
    [startDate, endDate, comparePeriod]
  );

  const comparePrevRange = useMemo(
    () => getPreviousRange(compareRange.start, compareRange.end),
    [compareRange]
  );

  const compareCurrentRecords = useMemo(
    () => records.filter((item) => inRange(item.date, compareRange.start, compareRange.end)),
    [records, compareRange]
  );

  const comparePreviousRecords = useMemo(
    () => records.filter((item) => inRange(item.date, comparePrevRange.start, comparePrevRange.end)),
    [records, comparePrevRange]
  );

  const categoryComparisonRows = useMemo(
    () => aggregateCategoryComparison(compareCurrentRecords, comparePreviousRecords),
    [compareCurrentRecords, comparePreviousRecords]
  );

  const performanceChartData = useMemo(() => {
    const targetRows = currentRecords.filter(
      (item) => item.category === performanceCategory
    );

    return aggregateSeriesByPeriod(targetRows, period, (item) => ({
      aiRevenue: item.aiRevenue,
      aiProfit: item.aiProfit,
      manualRevenue: item.manualRevenue,
      manualProfit: item.manualProfit,
    }));
  }, [currentRecords, performanceCategory, period]);

  const historyRows = useMemo(
    () => buildHistoryRows(historyEvents, currentRange.start, currentRange.end),
    [historyEvents, currentRange]
  );

  const strategyRows = useMemo(
    () => buildStrategyRows(currentRecords, previousRecords),
    [currentRecords, previousRecords]
  );

  const handleProductClick = (productCode) => {
    navigate(`/admin/product-update/${productCode}`, {
      state: { focusSection: "ai-pricing" },
    });
  };

  return (
    <PageWrap>
      <Title>AI 가격변경 분석</Title>

      <TopFilterRow>
        <DateFieldWrap>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DateIconWrap>
            <CalendarDays size={15} />
          </DateIconWrap>
        </DateFieldWrap>

        <DateFieldWrap>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <DateIconWrap>
            <CalendarDays size={15} />
          </DateIconWrap>
        </DateFieldWrap>

        <SelectWrap>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <SelectIconWrap>
            <ChevronDown size={14} />
          </SelectIconWrap>
        </SelectWrap>
      </TopFilterRow>

      <SummaryGrid>
        <SummaryCard
          title="AI 창출 매출액"
          mainValue={formatNumber(summary.revenue)}
          mainSuffix="원"
          change={summary.revenueChange}
          compareLabel={compareLabel}
        />
        <SummaryCard
          title="AI 창출 공헌이익"
          mainValue={formatPercent(summary.margin)}
          subValue={`/ ${formatCurrency(summary.profit)}`}
          change={summary.profitChange}
          compareLabel={compareLabel}
        />
        <SummaryCard
          title="최저가 점유율"
          mainValue={formatPercent(summary.averageLowestShare)}
          change={summary.lowestShareChange}
          compareLabel={compareLabel}
        />
        <SummaryCard
          title="AI 가격변경 횟수"
          mainValue={formatNumber(summary.changeCount)}
          mainSuffix="회"
          change={summary.changeCountRate}
          compareLabel={compareLabel}
        />
      </SummaryGrid>

      <LargePanel>
        <PanelHeaderRow>
          <PanelTitle>AI 가격변경 / 수동 가격변경 시뮬레이션</PanelTitle>

          <PanelControls>
            <SearchInputWrap>
              <SearchIconWrap>
                <Search size={15} />
              </SearchIconWrap>
              <SearchInput
                value={simulationKeyword}
                onChange={(e) => setSimulationKeyword(e.target.value)}
                placeholder="상품명, 상품코드로 검색"
              />
            </SearchInputWrap>

            <SelectWrap $small>
              <Select
                value={simulationCategory}
                onChange={(e) => setSimulationCategory(e.target.value)}
              >
                <option value="전체">카테고리</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <SelectIconWrap>
                <ChevronDown size={14} />
              </SelectIconWrap>
            </SelectWrap>

            <SelectWrap $small>
              <Select
                value={simulationPeriod}
                onChange={(e) => setSimulationPeriod(e.target.value)}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <SelectIconWrap>
                <ChevronDown size={14} />
              </SelectIconWrap>
            </SelectWrap>
          </PanelControls>
        </PanelHeaderRow>

        <ChartWrap $tall>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationChartData}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9aa3b2" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#9aa3b2" }}
                tickFormatter={(value) => `${Math.round(value / 10000)}만`}
              />
              <Tooltip
                formatter={(value, name) => [formatCurrency(value), name]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="aiRevenue"
                name="AI 매출"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="aiProfit"
                name="AI 이익"
                stroke="#7aa2ff"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manualRevenue"
                name="수동 매출(예측)"
                stroke="#ef5350"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manualProfit"
                name="수동 이익(예측)"
                stroke="#f3a5a5"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrap>
      </LargePanel>

      <LargePanel>
        <PanelHeaderRow>
          <PanelTitle>카테고리별 AI 성과 비교</PanelTitle>

          <SelectWrap $small>
            <Select
              value={comparePeriod}
              onChange={(e) => setComparePeriod(e.target.value)}
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <SelectIconWrap>
              <ChevronDown size={14} />
            </SelectIconWrap>
          </SelectWrap>
        </PanelHeaderRow>

        <WideTableScroll>
          <CompareTable>
            <thead>
              <tr>
                <th rowSpan="2">카테고리</th>
                <th colSpan="4">성과</th>
                <th colSpan="4">AI 가격변경</th>
                <th colSpan="4">수동 가격변경</th>
              </tr>
              <tr>
                <th>매출액</th>
                <th>공헌이익</th>
                <th>판매량</th>
                <th>이익률</th>
                <th>매출액</th>
                <th>공헌이익</th>
                <th>판매량</th>
                <th>이익률</th>
                <th>매출액</th>
                <th>공헌이익</th>
                <th>판매량</th>
                <th>이익률</th>
              </tr>
            </thead>
            <tbody>
              {categoryComparisonRows.map((row) => (
                <tr key={row.category}>
                  <td>{row.category}</td>

                  <td>
                    <MetricCell
                      primary={formatCurrency(row.performance.revenue)}
                      change={row.performance.revenueChange}
                    />
                  </td>
                  <td>
                    <MetricCell
                      primary={formatCurrency(row.performance.profit)}
                      change={row.performance.profitChange}
                    />
                  </td>
                  <td>
                    <MetricCell
                      primary={formatCount(row.performance.sales)}
                      change={row.performance.salesChange}
                    />
                  </td>
                  <td>
                    <MetricCell
                      primary={formatPercent(row.performance.margin)}
                      change={row.performance.marginChange}
                    />
                  </td>

                  <td>{formatCurrency(row.ai.revenue)}</td>
                  <td>{formatCurrency(row.ai.profit)}</td>
                  <td>{formatCount(row.ai.sales)}</td>
                  <td>{formatPercent(row.ai.margin)}</td>

                  <td>{formatCurrency(row.manual.revenue)}</td>
                  <td>{formatCurrency(row.manual.profit)}</td>
                  <td>{formatCount(row.manual.sales)}</td>
                  <td>{formatPercent(row.manual.margin)}</td>
                </tr>
              ))}
            </tbody>
          </CompareTable>
        </WideTableScroll>
      </LargePanel>

      <TwoColumnGrid>
        <MediumPanel>
          <PanelTitle>AI 가격변경 성과</PanelTitle>

          <LegendGuide>
            <LegendGuideItem>
              <LegendDot $color="#2563eb" />
              AI 매출
            </LegendGuideItem>
            <LegendGuideItem>
              <LegendDot $color="#7aa2ff" />
              AI 이익
            </LegendGuideItem>
            <LegendGuideItem>
              <LegendDot $color="#ef5350" />
              수동 매출(예측)
            </LegendGuideItem>
            <LegendGuideItem>
              <LegendDot $color="#f3a5a5" />
              수동 이익(예측)
            </LegendGuideItem>
          </LegendGuide>

          <CategoryTabRow>
            {CATEGORY_OPTIONS.map((category) => (
              <CategoryTabButton
                key={category}
                type="button"
                $active={performanceCategory === category}
                onClick={() => setPerformanceCategory(category)}
              >
                {category}
              </CategoryTabButton>
            ))}
          </CategoryTabRow>

          <ChartWrap>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceChartData}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9aa3b2" }} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9aa3b2" }}
                  tickFormatter={(value) => `${Math.round(value / 10000)}만`}
                />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="aiRevenue"
                  name="AI 매출"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="aiProfit"
                  name="AI 이익"
                  stroke="#7aa2ff"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="manualRevenue"
                  name="수동 매출(예측)"
                  stroke="#ef5350"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="manualProfit"
                  name="수동 이익(예측)"
                  stroke="#f3a5a5"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrap>
        </MediumPanel>

        <MediumPanel>
          <PanelHeaderRow>
            <PanelTitle>AI 가격변경 이력</PanelTitle>
            <TinyHint>&lt; 전략 수정 추천 &gt;</TinyHint>
          </PanelHeaderRow>

          <HistoryTable>
            <thead>
              <tr>
                <th>순서</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr key={`${row.productCode}-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton type="button" onClick={() => handleProductClick(row.productCode)}>
                      {row.productCode}
                    </CodeButton>
                  </td>
                  <td>{row.productName}</td>
                  <td>
                    <ReasonText $type={row.direction === "up" ? "up" : "down"}>
                      {row.direction === "up" ? "▲" : "▼"} {row.reason}
                    </ReasonText>
                  </td>
                </tr>
              ))}
            </tbody>
          </HistoryTable>
        </MediumPanel>
      </TwoColumnGrid>

      <LargePanel>
        <PanelHeaderRow>
          <PanelTitle>전략 수정 필요한 상품</PanelTitle>
          <InfoIconWrap>
            <Info size={15} />
          </InfoIconWrap>
        </PanelHeaderRow>

        <WideTableScroll>
          <StrategyTable>
            <thead>
              <tr>
                <th>순위</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>사유</th>
                <th>판매량</th>
                <th>재고</th>
                <th>전일대비</th>
                <th>판매가</th>
                <th>이익</th>
                <th>이익률</th>
                <th>카테고리</th>
              </tr>
            </thead>
            <tbody>
              {strategyRows.map((row) => (
                <tr key={`${row.productCode}-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton type="button" onClick={() => handleProductClick(row.productCode)}>
                      {row.productCode}
                    </CodeButton>
                  </td>
                  <td>{row.productName}</td>
                  <td>
                    <StrategyReason>{row.reason}</StrategyReason>
                  </td>
                  <td>{formatCount(row.salesQty)}</td>
                  <td>{formatCount(row.stock)}</td>
                  <td>
                    <DeltaBadge $negative={row.compareRate < 0}>
                      {formatDeltaPercent(row.compareRate)}
                    </DeltaBadge>
                  </td>
                  <td>{formatCurrency(row.salePrice)}</td>
                  <td>{formatCurrency(row.profit)}</td>
                  <td>{formatPercent(row.margin)}</td>
                  <td>{row.category}</td>
                </tr>
              ))}
            </tbody>
          </StrategyTable>
        </WideTableScroll>
      </LargePanel>
    </PageWrap>
  );
}

function MetricCell({ primary, change }) {
  const { isPositive, text } = getChangeMeta(change);

  return (
    <MetricWrap>
      <MetricPrimary>{primary}</MetricPrimary>
      <MetricChange $positive={isPositive}>
        {isPositive ? "↑" : "↓"} {text.replace("+", "")}
      </MetricChange>
    </MetricWrap>
  );
}

const PageWrap = styled.div`
  min-height: 100%;
  padding: 24px;
  background: #f6f8fb;
`;

const Title = styled.h2`
  margin: 0 0 22px;
  color: #111827;
  font-size: 28px;
  font-weight: 800;
`;

const TopFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  flex-wrap: wrap;
`;

const sharedField = css`
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const DateFieldWrap = styled.div`
  position: relative;
  width: 150px;
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
  right: 11px;
  transform: translateY(-50%);
  color: #9aa3b2;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SelectWrap = styled.div`
  position: relative;
  width: ${({ $small }) => ($small ? "110px" : "120px")};
`;

const Select = styled.select`
  ${sharedField};
  width: 100%;
  padding: 0 34px 0 12px;
  appearance: none;
`;

const SelectIconWrap = styled.div`
  position: absolute;
  top: 50%;
  right: 11px;
  transform: translateY(-50%);
  color: #9aa3b2;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 22px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCardWrap = styled.div`
  padding: 18px 18px 16px;
  border-radius: 18px;
  border: 1px solid #edf1f6;
  background: #ffffff;
`;

const SummaryCardTitle = styled.div`
  color: #374151;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const SummaryCardValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const SummaryCardMainValue = styled.div`
  color: #111827;
  font-size: 26px;
  font-weight: 900;
`;

const SummaryCardMainSuffix = styled.div`
  color: #374151;
  font-size: 18px;
  font-weight: 700;
`;

const SummaryCardSubValue = styled.div`
  color: #374151;
  font-size: 15px;
  font-weight: 700;
`;

const SummaryCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $positive }) => ($positive ? "#22c55e" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;

  span:last-child {
    color: #9aa3b2;
    font-weight: 600;
  }
`;

const LargePanel = styled.section`
  padding: 16px;
  border: 1px solid #edf1f6;
  border-radius: 18px;
  background: #ffffff;
  margin-bottom: 22px;
`;

const MediumPanel = styled.section`
  padding: 16px;
  border: 1px solid #edf1f6;
  border-radius: 18px;
  background: #ffffff;
`;

const PanelHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const PanelTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 800;
`;

const PanelControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SearchInputWrap = styled.div`
  position: relative;
  width: 220px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 11px;
  transform: translateY(-50%);
  color: #9aa3b2;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  ${sharedField};
  width: 100%;
  padding: 0 12px 0 36px;
`;

const ChartWrap = styled.div`
  width: 100%;
  height: ${({ $tall }) => ($tall ? "320px" : "250px")};
`;

const WideTableScroll = styled.div`
  overflow-x: auto;
`;

const CompareTable = styled.table`
  width: 100%;
  min-width: 1180px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid #eef2f7;
    text-align: center;
    white-space: nowrap;
    font-size: 13px;
  }

  thead th {
    color: #9aa3b2;
    font-weight: 700;
    background: #ffffff;
  }

  tbody td {
    color: #1f2937;
  }
`;

const MetricWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const MetricPrimary = styled.span`
  color: #111827;
  font-weight: 700;
`;

const MetricChange = styled.span`
  color: ${({ $positive }) => ($positive ? "#22c55e" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
  margin-bottom: 22px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LegendGuide = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
`;

const LegendGuideItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  display: inline-block;
`;

const CategoryTabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const CategoryTabButton = styled.button`
  min-width: 60px;
  height: 32px;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "#2563eb" : "#4b5563")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const TinyHint = styled.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;

const HistoryTable = styled.table`
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

const ReasonText = styled.span`
  color: ${({ $type }) => ($type === "up" ? "#ef5350" : "#22c55e")};
  font-size: 12px;
  font-weight: 700;
`;

const StrategyTable = styled.table`
  width: 100%;
  min-width: 1180px;
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
  }
`;

const StrategyReason = styled.span`
  color: #22c55e;
  font-size: 12px;
  font-weight: 700;
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

const InfoIconWrap = styled.div`
  color: #9aa3b2;
  display: flex;
  align-items: center;
`;