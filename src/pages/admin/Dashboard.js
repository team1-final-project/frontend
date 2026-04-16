import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const hourLabels = [
  "0시",
  "3시",
  "6시",
  "9시",
  "12시",
  "15시",
  "18시",
  "21시",
  "24시",
];
const weekLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const categoryTabs = [
  "라면",
  "소시지",
  "스낵과자",
  "즉석식품",
  "카레",
  "탄산음료",
];

const topCards = [
  {
    title: "금일 매출액(GMV)",
    value: "12,345,678 원",
    meta: "↑ 6%",
    sub: "vs Yesterday",
    positive: true,
  },
  {
    title: "금일 판매량",
    value: "1,420 개",
    meta: "↑ 6%",
    sub: "vs Yesterday",
    positive: true,
  },
  {
    title: "금일 공헌이익",
    value: "35.2%",
    subValue: "/ 4,345,678원",
    meta: "↑ 6%",
    sub: "vs Yesterday",
    positive: true,
  },
  {
    title: "금일 최저가 유지",
    value: "90.9%",
    subValue: "/ 60 / 66 SKU",
    meta: "↑ 6%",
    sub: "vs Yesterday",
    positive: true,
  },
];

const aiCards = [
  {
    title: "AI 창출 매출액",
    value: "12,345,678 원",
    meta: "↑ 6%",
    sub: "vs last 7 days",
    positive: true,
  },
  {
    title: "AI 창출 공헌이익",
    value: "35.2%",
    subValue: "/ 4,345,678원",
    meta: "↑ 6%",
    sub: "vs last 7 days",
    positive: true,
  },
  {
    title: "AI 수익성 개선",
    value: "2,345,678 원",
    meta: "↑ 6%",
    sub: "vs Yesterday",
    positive: true,
  },
  {
    title: "AI 가격변경 횟수",
    value: "1,420 회",
    meta: "↑ 6%",
    sub: "vs Yesterday",
    positive: true,
  },
];

const hourlyRevenueProfit = {
  sales: [8.0, 7.7, 8.0, 6.4, 4.9, 2.0, 6.8],
  profit: [29, 32, 28, 34, 29, 34, 27],
};

const lowMarginRows = Array.from({ length: 5 }).map((_, idx) => ({
  rank: idx + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  avgProfit: "800원",
  profitRate: "28.5%",
}));

const notLowestRows = Array.from({ length: 5 }).map((_, idx) => ({
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  salePrice: "800원",
  lowestPrice: "700원",
  gap: "100원",
  rate: "+14.2%",
}));

const aiEffectTrendMap = {
  라면: {
    aiSales: [4.6, 4.4, 4.6, 3.6, 5.0, 4.3, 3.9],
    manualSales: [4.0, 4.3, 3.9, 4.5, 3.9, 4.8, 4.4],
    aiMargin: [3.4, 3.3, 3.5, 2.6, 1.9, 3.3, 4.0],
    manualMargin: [1.7, 2.0, 1.6, 2.3, 1.8, 0.5, 0.45],
  },
  소시지: {
    aiSales: [4.9, 4.7, 4.9, 3.8, 5.2, 4.5, 4.0],
    manualSales: [4.0, 4.4, 4.0, 4.7, 4.1, 4.9, 4.4],
    aiMargin: [3.5, 3.4, 3.6, 2.8, 2.0, 3.6, 4.2],
    manualMargin: [1.8, 2.1, 1.7, 2.5, 1.9, 0.6, 0.55],
  },
  스낵과자: {
    aiSales: [3.6, 3.8, 3.7, 3.4, 4.2, 3.9, 3.5],
    manualSales: [3.1, 3.3, 3.1, 3.6, 3.4, 3.8, 3.3],
    aiMargin: [2.8, 2.7, 2.9, 2.2, 1.8, 2.9, 3.1],
    manualMargin: [1.4, 1.7, 1.4, 1.9, 1.6, 0.8, 0.7],
  },
  즉석식품: {
    aiSales: [4.1, 4.0, 4.2, 3.5, 4.6, 4.0, 3.7],
    manualSales: [3.6, 3.8, 3.6, 4.0, 3.8, 4.1, 3.5],
    aiMargin: [3.0, 2.9, 3.1, 2.4, 1.9, 3.0, 3.2],
    manualMargin: [1.5, 1.7, 1.5, 2.1, 1.7, 0.9, 0.8],
  },
  카레: {
    aiSales: [2.8, 2.9, 3.0, 2.7, 3.4, 3.0, 2.8],
    manualSales: [2.3, 2.5, 2.4, 2.8, 2.7, 2.9, 2.5],
    aiMargin: [2.1, 2.0, 2.2, 1.8, 1.4, 2.3, 2.4],
    manualMargin: [1.0, 1.1, 1.0, 1.3, 1.1, 0.6, 0.5],
  },
  탄산음료: {
    aiSales: [4.4, 4.5, 4.6, 4.2, 4.8, 4.7, 4.3],
    manualSales: [3.8, 4.0, 3.9, 4.2, 4.0, 4.1, 3.7],
    aiMargin: [3.3, 3.4, 3.5, 3.0, 2.6, 3.4, 3.5],
    manualMargin: [1.5, 1.7, 1.6, 1.9, 1.6, 0.9, 0.8],
  },
};

const stackedShareMap = {
  라면: {
    blue: [1.2, 1.6, 1.0, 2.6, 2.4, 2.3, 2.2],
    pink: [0.8, 1.3, 0.7, 1.2, 1.0, 1.0, 1.0],
    orange: [0.5, 0.6, 0.4, 0.5, 0.7, 0.6, 0.8],
  },
  소시지: {
    blue: [1.4, 1.7, 1.1, 2.7, 2.5, 2.4, 2.3],
    pink: [0.9, 1.4, 0.8, 1.3, 1.1, 1.1, 1.1],
    orange: [0.5, 0.6, 0.4, 0.5, 0.8, 0.7, 0.8],
  },
  스낵과자: {
    blue: [1.1, 1.5, 0.9, 2.3, 2.1, 2.1, 2.0],
    pink: [0.7, 1.2, 0.6, 1.1, 0.9, 0.9, 0.9],
    orange: [0.4, 0.5, 0.3, 0.5, 0.6, 0.5, 0.6],
  },
  즉석식품: {
    blue: [1.3, 1.6, 1.0, 2.4, 2.2, 2.2, 2.2],
    pink: [0.8, 1.3, 0.7, 1.2, 1.0, 1.0, 1.0],
    orange: [0.4, 0.6, 0.4, 0.5, 0.6, 0.6, 0.7],
  },
  카레: {
    blue: [0.9, 1.2, 0.8, 2.0, 1.9, 1.9, 1.8],
    pink: [0.6, 0.9, 0.5, 0.9, 0.8, 0.8, 0.8],
    orange: [0.3, 0.4, 0.3, 0.4, 0.5, 0.5, 0.5],
  },
  탄산음료: {
    blue: [1.5, 1.8, 1.2, 2.9, 2.7, 2.7, 2.6],
    pink: [0.9, 1.4, 0.8, 1.4, 1.2, 1.2, 1.2],
    orange: [0.5, 0.6, 0.4, 0.6, 0.7, 0.7, 0.8],
  },
};

const weeklySalesMini = [1.25, 0.72, 0.65, 0.71, 0.88, 0.97, 0.54];
const weeklyProfitMini = [0.92, 0.42, 0.37, 0.45, 0.58, 0.61, 0.28];

const donutData = [
  { label: "라면", value: 28, color: "#2563eb" },
  { label: "소시지", value: 6, color: "#38bdf8" },
  { label: "스낵과자", value: 8, color: "#eab308" },
  { label: "즉석식품", value: 20, color: "#22c55e" },
  { label: "카레", value: 18, color: "#a855f7" },
  { label: "탄산음료", value: 20, color: "#ef4444" },
];

const salesTopRows = Array.from({ length: 5 }).map((_, idx) => ({
  rank: idx + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  category: "가공 / 간편식품 > 라면",
  salesQty: "1,470개",
  dailyAvgSales: "210개",
  compareRate: "-9%",
  avgSalePrice: "1,250원",
  avgProfit: "400원",
  profitRate: "28%",
}));

const lowestHourlyData = {
  lowest: [5.2, 5.3, 5.5, 6.8, 6.7, 5.9, 4.9, 1.8, 5.5],
  myPrice: [5.4, 4.8, 5.3, 6.2, 6.2, 5.7, 4.8, 1.3, 4.9],
  salesQty: [1.1, 1.6, 1.2, 1.1, 1.1, 1.0, 1.7, 0.6, 1.2],
  profit: [0.55, 0.5, 0.75, 0.75, 0.74, 0.62, 0.55, 0.25, 0.58],
};

function buildLinePoints(values, width, height, padding = 18) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y =
        height - padding - ((value - min) * (height - padding * 2)) / range;
      return `${x},${y}`;
    })
    .join(" ");
}

function getDonutSegments(data, radius = 72, strokeWidth = 18) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return data.map((item) => {
    const segmentLength = (item.value / total) * circumference;
    const segment = {
      ...item,
      radius,
      strokeWidth,
      dashArray: `${segmentLength} ${circumference - segmentLength}`,
      dashOffset: -offset,
    };
    offset += segmentLength;
    return segment;
  });
}

function buildStackedBars(data, width, height, padding = 28) {
  const totals = data.blue.map(
    (_, idx) => data.blue[idx] + data.pink[idx] + data.orange[idx],
  );
  const max = Math.max(...totals, 1);
  const groupWidth = (width - padding * 2) / totals.length;
  const barWidth = Math.min(22, groupWidth * 0.45);

  return totals.map((_, idx) => {
    const x = padding + idx * groupWidth + (groupWidth - barWidth) / 2;

    const orangeHeight = (data.orange[idx] / max) * (height - padding * 2);
    const pinkHeight = (data.pink[idx] / max) * (height - padding * 2);
    const blueHeight = (data.blue[idx] / max) * (height - padding * 2);

    const baseY = height - padding;

    return {
      x,
      orange: {
        x,
        y: baseY - orangeHeight,
        width: barWidth,
        height: orangeHeight,
      },
      pink: {
        x,
        y: baseY - orangeHeight - pinkHeight,
        width: barWidth,
        height: pinkHeight,
      },
      blue: {
        x,
        y: baseY - orangeHeight - pinkHeight - blueHeight,
        width: barWidth,
        height: blueHeight,
      },
    };
  });
}

function buildBarLayout(
  values,
  width,
  height,
  padding = 28,
  offset = 0,
  barWidth = 10,
) {
  const max = Math.max(...values, 1);
  const groupWidth = (width - padding * 2) / values.length;

  return values.map((value, idx) => {
    const barHeight = (value / max) * (height - padding * 2);
    const x = padding + idx * groupWidth + offset;
    const y = height - padding - barHeight;

    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
    };
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeAiTab, setActiveAiTab] = useState("소시지");
  const [activeShareTab, setActiveShareTab] = useState("소시지");
  const [hourlyCategory, setHourlyCategory] = useState("카테고리");
  const [hourlyPeriod, setHourlyPeriod] = useState("주간");
  const [dashboardCategory, setDashboardCategory] = useState("카테고리");
  const [lowestSearch, setLowestSearch] = useState("");

  const aiTrend = useMemo(
    () => aiEffectTrendMap[activeAiTab] || aiEffectTrendMap["소시지"],
    [activeAiTab],
  );

  const stackedBars = useMemo(
    () =>
      buildStackedBars(
        stackedShareMap[activeShareTab] || stackedShareMap["소시지"],
        520,
        250,
        28,
      ),
    [activeShareTab],
  );

  const donutSegments = useMemo(() => getDonutSegments(donutData), []);
  const salesBars = useMemo(
    () => buildBarLayout(lowestHourlyData.salesQty, 760, 260, 28, 10, 10),
    [],
  );
  const profitBars = useMemo(
    () => buildBarLayout(lowestHourlyData.profit, 760, 260, 28, 24, 10),
    [],
  );

  return (
    <PageWrap>
      <PageTitle>대시보드</PageTitle>

      <DateTimeText>2026.04.06 ｜ 11 : 36 am</DateTimeText>

      <SummaryGrid>
        {topCards.map((card) => (
          <MetricCard key={card.title}>
            <MetricTitle>{card.title}</MetricTitle>
            <MetricValueRow>
              <MetricValue>{card.value}</MetricValue>
              {card.subValue && (
                <MetricSubValue>{card.subValue}</MetricSubValue>
              )}
            </MetricValueRow>
            <MetricMeta $positive={card.positive}>
              {card.meta}
              <span>{card.sub}</span>
            </MetricMeta>
          </MetricCard>
        ))}
      </SummaryGrid>

      <TopContentGrid>
        <Card>
          <CardHeader>
            <SectionTitle>시간대별 매출/공헌이익 변동 추이</SectionTitle>

            <SelectWrap>
              <HeaderSelect
                value={dashboardCategory}
                onChange={(e) => setDashboardCategory(e.target.value)}
              >
                <option>카테고리</option>
                <option>라면</option>
                <option>소시지</option>
                <option>탄산음료</option>
              </HeaderSelect>
              <SelectIcon>
                <ChevronDown size={14} />
              </SelectIcon>
            </SelectWrap>
          </CardHeader>

          <LegendRow>
            <LegendItem>
              <LegendDot $color="#22c55e" />
              매출
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#c026d3" />
              공헌이익
            </LegendItem>
          </LegendRow>

          <ChartWrap>
            <AxisLeft>
              <span>8천</span>
              <span>6천</span>
              <span>4천</span>
              <span>2천</span>
              <span>1천</span>
              <span>0</span>
            </AxisLeft>

            <ChartCanvas>
              <ChartSvg viewBox="0 0 520 250" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    hourlyRevenueProfit.sales,
                    520,
                    250,
                    22,
                  )}
                />
                <polyline
                  fill="none"
                  stroke="#c026d3"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    hourlyRevenueProfit.profit,
                    520,
                    250,
                    22,
                  )}
                />
              </ChartSvg>

              <XAxis>
                {hourLabels.slice(0, 8).map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </XAxis>
            </ChartCanvas>

            <AxisRight>
              <span>40%</span>
              <span>30%</span>
              <span>20%</span>
              <span>10%</span>
              <span>5%</span>
              <span>0</span>
            </AxisRight>
          </ChartWrap>
        </Card>

        <Card>
          <SmallHeader>
            <SectionTitle>📌 공헌이익률 낮은 상품</SectionTitle>
            <HeaderLinkButton type="button">
              {"< 전략 수정 추천 >"}
            </HeaderLinkButton>
          </SmallHeader>

          <MiniTableWrap>
            <MiniTable>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>상품코드</th>
                  <th>상품명</th>
                  <th>평균이익</th>
                  <th>이익률</th>
                </tr>
              </thead>
              <tbody>
                {lowMarginRows.map((row) => (
                  <tr key={`low-${row.rank}`}>
                    <td>{row.rank}</td>
                    <td>
                      <CodeButton
                        type="button"
                        onClick={() =>
                          navigate(`/admin/product-update/${row.productCode}`)
                        }
                      >
                        {row.productCode}
                      </CodeButton>
                    </td>
                    <td>
                      <ProductAnchor
                        href={`/product-detail?productCode=${row.productCode}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row.productName}
                      </ProductAnchor>
                    </td>
                    <td>{row.avgProfit}</td>
                    <td>
                      <NegativeText>{row.profitRate}</NegativeText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </MiniTable>
          </MiniTableWrap>
        </Card>

        <Card>
          <SmallHeader>
            <SectionTitle>🧾 현재 최저가가 아닌 상품</SectionTitle>
            <HeaderLinkButton type="button">
              {"< 전략 수정 추천 >"}
            </HeaderLinkButton>
          </SmallHeader>

          <MiniTableWrap>
            <MiniTable>
              <thead>
                <tr>
                  <th>상품코드</th>
                  <th>상품명</th>
                  <th>판매가</th>
                  <th>최저가</th>
                  <th>차이</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {notLowestRows.map((row, idx) => (
                  <tr key={`not-lowest-${idx}`}>
                    <td>
                      <CodeButton
                        type="button"
                        onClick={() =>
                          navigate(`/admin/product-update/${row.productCode}`)
                        }
                      >
                        {row.productCode}
                      </CodeButton>
                    </td>
                    <td>
                      <ProductAnchor
                        href={`/product-detail?productCode=${row.productCode}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {row.productName}
                      </ProductAnchor>
                    </td>
                    <td>{row.salePrice}</td>
                    <td>{row.lowestPrice}</td>
                    <td>{row.gap}</td>
                    <td>
                      <RateBadge $positive={false}>{row.rate}</RateBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </MiniTable>
          </MiniTableWrap>
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle>시간대별 최저가 변동 추이</SectionTitle>

            <SearchInputWrap>
              <SearchInput
                value={lowestSearch}
                onChange={(e) => setLowestSearch(e.target.value)}
                placeholder="상품명, 상품코드로 검색"
              />
              <SearchIconWrap>
                <Search size={15} />
              </SearchIconWrap>
            </SearchInputWrap>
          </CardHeader>

          <SearchInfo>
            상품코드 : 9744302255 / 상품명 : 농심 신라면건면 114g, 1개
          </SearchInfo>

          <LegendRow>
            <LegendItem>
              <LegendDot $color="#ef4444" />
              최저가
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#22c55e" />
              나의 판매가
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#2563eb" />
              판매량
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#eab308" />
              공헌이익
            </LegendItem>
          </LegendRow>

          <BarLineChartWrap>
            <BarLeftAxis>
              <span>1.5천개</span>
              <span>1.3천개</span>
              <span>1천개</span>
              <span>0.5천개</span>
              <span>0.3천개</span>
              <span>0</span>
            </BarLeftAxis>

            <ChartCanvas>
              <BarLineSvg viewBox="0 0 760 260" preserveAspectRatio="none">
                {salesBars.map((bar, idx) => (
                  <rect
                    key={`sales-${idx}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    rx="2"
                    fill="#2563eb"
                  />
                ))}

                {profitBars.map((bar, idx) => (
                  <rect
                    key={`profit-${idx}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    rx="2"
                    fill="#eab308"
                  />
                ))}

                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    lowestHourlyData.lowest,
                    760,
                    260,
                    28,
                  )}
                />
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    lowestHourlyData.myPrice,
                    760,
                    260,
                    28,
                  )}
                />
              </BarLineSvg>

              <XAxisNine>
                {hourLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </XAxisNine>
            </ChartCanvas>

            <BarRightAxis>
              <span>8천원</span>
              <span>6천원</span>
              <span>4천원</span>
              <span>2천원</span>
              <span>1천원</span>
              <span>0</span>
            </BarRightAxis>
          </BarLineChartWrap>
        </Card>
      </TopContentGrid>

      <SummaryGrid>
        {aiCards.map((card) => (
          <MetricCard key={card.title}>
            <MetricTitle>{card.title}</MetricTitle>
            <MetricValueRow>
              <MetricValue>{card.value}</MetricValue>
              {card.subValue && (
                <MetricSubValue>{card.subValue}</MetricSubValue>
              )}
            </MetricValueRow>
            <MetricMeta $positive={card.positive}>
              {card.meta}
              <span>{card.sub}</span>
            </MetricMeta>
          </MetricCard>
        ))}
      </SummaryGrid>

      <MiddleGrid>
        <Card>
          <CardHeader>
            <SectionTitle>AI 가격변경 성과</SectionTitle>

            <LegendGroup>
              <LegendItem>
                <LegendDot $color="#2563eb" />
                AI 매출
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#ef4444" />
                수동 매출(예측)
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#7aa2ff" />
                AI 마진
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#f3a6a6" />
                수동 마진(예측)
              </LegendItem>
            </LegendGroup>
          </CardHeader>

          <CategoryTabsRow>
            {categoryTabs.map((tab) => (
              <CategoryTab
                key={tab}
                type="button"
                $active={activeAiTab === tab}
                onClick={() => setActiveAiTab(tab)}
              >
                {tab}
              </CategoryTab>
            ))}
          </CategoryTabsRow>

          <ChartWrap>
            <AxisLeft>
              <span>5천</span>
              <span>4천</span>
              <span>3천</span>
              <span>2천</span>
              <span>1천</span>
              <span>0</span>
            </AxisLeft>

            <ChartCanvas>
              <ChartSvg viewBox="0 0 520 250" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(aiTrend.aiSales, 520, 250, 22)}
                />
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(aiTrend.manualSales, 520, 250, 22)}
                />
                <polyline
                  fill="none"
                  stroke="#7aa2ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(aiTrend.aiMargin, 520, 250, 22)}
                />
                <polyline
                  fill="none"
                  stroke="#f3a6a6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(aiTrend.manualMargin, 520, 250, 22)}
                />
              </ChartSvg>

              <XAxis>
                {weekLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </XAxis>
            </ChartCanvas>

            <AxisRight>
              <span>5백</span>
              <span>4백</span>
              <span>3백</span>
              <span>2백</span>
              <span>1백</span>
              <span>0</span>
            </AxisRight>
          </ChartWrap>
        </Card>

        <Card>
          <SectionTitle>상품별 판매 비중</SectionTitle>

          <CategoryTabsRow>
            {categoryTabs.map((tab) => (
              <CategoryTab
                key={tab}
                type="button"
                $active={activeShareTab === tab}
                onClick={() => setActiveShareTab(tab)}
              >
                {tab}
              </CategoryTab>
            ))}
          </CategoryTabsRow>

          <ChartCanvasOnly>
            <ChartSvg viewBox="0 0 520 250" preserveAspectRatio="none">
              {stackedBars.map((bar, idx) => (
                <g key={`stack-${idx}`}>
                  <rect
                    x={bar.orange.x}
                    y={bar.orange.y}
                    width={bar.orange.width}
                    height={bar.orange.height}
                    rx="4"
                    fill="#f59e0b"
                  />
                  <rect
                    x={bar.pink.x}
                    y={bar.pink.y}
                    width={bar.pink.width}
                    height={bar.pink.height}
                    rx="4"
                    fill="#f8b4b4"
                  />
                  <rect
                    x={bar.blue.x}
                    y={bar.blue.y}
                    width={bar.blue.width}
                    height={bar.blue.height}
                    rx="4"
                    fill="#3b5bfd"
                  />
                </g>
              ))}
            </ChartSvg>

            <XAxis>
              {weekLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </XAxis>
          </ChartCanvasOnly>
        </Card>
      </MiddleGrid>

      <BottomMiddleGrid>
        <MiniStatCard>
          <MiniStatTitle>주간 매출</MiniStatTitle>
          <MiniStatSub>Last 7 days</MiniStatSub>
          <MiniStatRow>
            <MiniStatValue>1.2 억원</MiniStatValue>
          </MiniStatRow>
          <MiniMeta $positive>
            ↑ 3% <span>vs last 7 days</span>
          </MiniMeta>
          <MiniLineSvg viewBox="0 0 260 80" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={buildLinePoints(weeklySalesMini, 260, 80, 10)}
            />
          </MiniLineSvg>
          <MiniXAxis>
            {weekLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </MiniXAxis>
        </MiniStatCard>

        <MiniStatCard>
          <MiniStatTitle>주간 공헌이익</MiniStatTitle>
          <MiniStatSub>Last 7 days</MiniStatSub>
          <MiniStatRow>
            <MiniStatValue>0.8 억원</MiniStatValue>
          </MiniStatRow>
          <MiniMeta $positive={false}>
            ↓ 3% <span>vs last 7 days</span>
          </MiniMeta>
          <MiniLineSvg viewBox="0 0 260 80" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={buildLinePoints(weeklyProfitMini, 260, 80, 10)}
            />
          </MiniLineSvg>
          <MiniXAxis>
            {weekLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </MiniXAxis>
        </MiniStatCard>

        <Card>
          <SectionTitle>카테고리 별 판매 비중</SectionTitle>

          <DonutWrap>
            <DonutSvg viewBox="0 0 220 220">
              <circle
                cx="110"
                cy="110"
                r="72"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="18"
              />
              {donutSegments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="110"
                  cy="110"
                  r={segment.radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={segment.strokeWidth}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  transform="rotate(-90 110 110)"
                />
              ))}
            </DonutSvg>
          </DonutWrap>

          <DonutLegend>
            {donutData.map((item) => (
              <LegendItem key={item.label}>
                <LegendDot $color={item.color} />
                {item.label}
              </LegendItem>
            ))}
          </DonutLegend>
        </Card>
      </BottomMiddleGrid>

      <LargeTableCard>
        <LargeHeader>
          <SectionTitle>판매량 TOP 5</SectionTitle>

          <HeaderFilterGroup>
            <SelectWrap>
              <HeaderSelect
                value={hourlyCategory}
                onChange={(e) => setHourlyCategory(e.target.value)}
              >
                <option>카테고리</option>
                <option>라면</option>
                <option>즉석식품</option>
                <option>탄산음료</option>
              </HeaderSelect>
              <SelectIcon>
                <ChevronDown size={14} />
              </SelectIcon>
            </SelectWrap>

            <SelectWrap>
              <HeaderSelect
                value={hourlyPeriod}
                onChange={(e) => setHourlyPeriod(e.target.value)}
              >
                <option>주간</option>
                <option>월간</option>
              </HeaderSelect>
              <SelectIcon>
                <ChevronDown size={14} />
              </SelectIcon>
            </SelectWrap>
          </HeaderFilterGroup>
        </LargeHeader>

        <LargeTableWrap>
          <LargeTable>
            <thead>
              <tr>
                <th>순위</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>판매량</th>
                <th>일평균판매량</th>
                <th>전 주 대비</th>
                <th>평균판매가</th>
                <th>평균이익</th>
                <th>평균이익률</th>
              </tr>
            </thead>
            <tbody>
              {salesTopRows.map((row) => (
                <tr key={`sales-top-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton
                      type="button"
                      onClick={() =>
                        navigate(`/admin/product-update/${row.productCode}`)
                      }
                    >
                      {row.productCode}
                    </CodeButton>
                  </td>
                  <td>
                    <ProductAnchor
                      href={`/product-detail?productCode=${row.productCode}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.productName}
                    </ProductAnchor>
                  </td>
                  <td>{row.category}</td>
                  <td>{row.salesQty}</td>
                  <td>{row.dailyAvgSales}</td>
                  <td>
                    <RateBadge $positive={false}>{row.compareRate}</RateBadge>
                  </td>
                  <td>{row.avgSalePrice}</td>
                  <td>{row.avgProfit}</td>
                  <td>{row.profitRate}</td>
                </tr>
              ))}
            </tbody>
          </LargeTable>
        </LargeTableWrap>
      </LargeTableCard>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100%;
`;

const PageTitle = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
`;

const DateTimeText = styled.div`
  margin-top: 10px;
  margin-bottom: 18px;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const MetricTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const MetricValueRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

const MetricValue = styled.div`
  color: #111827;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
`;

const MetricSubValue = styled.div`
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 2px;
`;

const MetricMeta = styled.div`
  margin-top: 10px;
  color: ${({ $positive }) => ($positive ? "#22c55e" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    color: #9ca3af;
    font-weight: 500;
  }
`;

const TopContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const MiddleGrid = styled(TopContentGrid)``;

const BottomMiddleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const SectionTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const SmallHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const HeaderLinkButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
`;

const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const SelectWrap = styled.div`
  position: relative;
  min-width: 110px;
`;

const HeaderSelect = styled.select`
  width: 100%;
  height: 36px;
  padding: 0 30px 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #6b7280;
  font-size: 13px;
  outline: none;
  appearance: none;
`;

const SelectIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const ChartWrap = styled.div`
  display: grid;
  grid-template-columns: 34px 1fr 34px;
  gap: 8px;
  align-items: stretch;
`;

const AxisLeft = styled.div`
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
`;

const AxisRight = styled(AxisLeft)`
  text-align: left;
`;

const ChartCanvas = styled.div`
  min-width: 0;
`;

const ChartCanvasOnly = styled.div`
  margin-top: 14px;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 250px;
  display: block;
`;

const XAxis = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 4px;

  span {
    color: #9ca3af;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
  }
`;

const XAxisNine = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  margin-top: 4px;

  span {
    color: #9ca3af;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
  }
`;

const MiniTableWrap = styled.div`
  overflow-x: auto;
`;

const MiniTable = styled.table`
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;

  thead th {
    padding: 10px 8px;
    border-bottom: 1px solid #eef0f4;
    color: #9ca3af;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
  }

  tbody td {
    padding: 12px 8px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const NegativeText = styled.span`
  color: #ef4444;
  font-weight: 700;
`;

const RateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $positive }) => ($positive ? "#dcfce7" : "#fee2e2")};
  color: ${({ $positive }) => ($positive ? "#16a34a" : "#ef4444")};
`;

const SearchInputWrap = styled.div`
  position: relative;
  min-width: 240px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 36px 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIconWrap = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
`;

const SearchInfo = styled.div`
  margin-bottom: 12px;
  color: #4b5563;
  font-size: 12px;
  font-weight: 600;
`;

const BarLineChartWrap = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  gap: 8px;
  align-items: stretch;
`;

const BarLeftAxis = styled.div`
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
`;

const BarRightAxis = styled(BarLeftAxis)`
  text-align: left;
`;

const BarLineSvg = styled.svg`
  width: 100%;
  height: 260px;
  display: block;
`;

const CategoryTabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

const CategoryTab = styled.button`
  position: relative;
  border: none;
  background: transparent;
  padding: 0 0 10px;
  color: ${({ $active }) => ($active ? "#111827" : "#6b7280")};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: ${({ $active }) => ($active ? "100%" : "0")};
    height: 3px;
    border-radius: 999px;
    background: #2563eb;
    transition: width 0.18s ease;
  }
`;

const MiniStatCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const MiniStatTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const MiniStatSub = styled.div`
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
`;

const MiniStatRow = styled.div`
  margin-top: 16px;
`;

const MiniStatValue = styled.div`
  color: #111827;
  font-size: 18px;
  font-weight: 800;
`;

const MiniMeta = styled.div`
  margin-top: 10px;
  color: ${({ $positive }) => ($positive ? "#2563eb" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;

  span {
    color: #9ca3af;
    font-weight: 500;
  }
`;

const MiniLineSvg = styled.svg`
  width: 100%;
  height: 80px;
  display: block;
  margin-top: 10px;
`;

const MiniXAxis = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 2px;

  span {
    color: #9ca3af;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
  }
`;

const DonutWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const DonutSvg = styled.svg`
  width: 240px;
  height: 240px;
  display: block;
`;

const DonutLegend = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 16px;
`;

const LargeTableCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const LargeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const HeaderFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LargeTableWrap = styled.div`
  overflow-x: auto;
`;

const LargeTable = styled.table`
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;

  thead th {
    padding: 12px 10px;
    border-bottom: 1px solid #eef0f4;
    color: #9ca3af;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
  }

  tbody td {
    padding: 12px 10px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const CodeButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ProductAnchor = styled.a`
  color: #111827;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;
