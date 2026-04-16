import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const categoryTrendMap = {
  라면: {
    sales: [4.5, 4.3, 4.5, 3.9, 3.5, 2.0, 4.2],
    profit: [3.8, 4.1, 3.7, 4.3, 3.9, 4.4, 3.6],
  },
  소시지: {
    sales: [3.2, 3.6, 3.4, 3.9, 4.1, 3.8, 4.0],
    profit: [2.8, 3.0, 3.5, 3.8, 4.2, 4.4, 4.1],
  },
  스낵과자: {
    sales: [2.8, 3.0, 2.7, 3.2, 3.6, 3.1, 3.4],
    profit: [2.2, 2.5, 2.8, 3.1, 3.0, 3.3, 3.5],
  },
  즉석식품: {
    sales: [3.6, 3.8, 4.1, 3.7, 3.3, 3.0, 3.9],
    profit: [3.1, 3.4, 3.8, 3.5, 3.2, 2.9, 3.6],
  },
  카레: {
    sales: [2.5, 2.7, 2.9, 3.2, 3.5, 3.3, 3.1],
    profit: [2.0, 2.4, 2.7, 3.0, 3.2, 3.0, 2.8],
  },
  탄산음료: {
    sales: [4.0, 4.3, 4.1, 4.5, 4.8, 4.6, 4.4],
    profit: [3.2, 3.4, 3.7, 3.9, 4.1, 4.0, 3.8],
  },
};

const donutData = [
  { label: "라면", value: 28, color: "#2563eb" },
  { label: "소시지", value: 6, color: "#38bdf8" },
  { label: "스낵과자", value: 8, color: "#eab308" },
  { label: "즉석식품", value: 20, color: "#22c55e" },
  { label: "카레", value: 18, color: "#a855f7" },
  { label: "탄산음료", value: 20, color: "#ef4444" },
];

const highMarginRows = Array.from({ length: 10 }).map((_, idx) => ({
  rank: idx + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  avgProfit: "800원",
  profitRate: "28.5%",
}));

const lowMarginRows = Array.from({ length: 10 }).map((_, idx) => ({
  rank: idx + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  avgProfit: "800원",
  profitRate: "28.5%",
}));

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

const revenueTopRows = Array.from({ length: 5 }).map((_, idx) => ({
  rank: idx + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  category: "가공 / 간편식품 > 라면",
  revenue: "82,345,123원",
  dailyAvgRevenue: "2,744,837원",
  compareRate: "+9%",
  avgSalePrice: "1,250원",
  avgProfit: "400원",
  profitRate: "28%",
}));

function buildLinePoints(values, width, height, padding = 16) {
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

function getDonutSegments(data, radius = 68, strokeWidth = 16) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return data.map((item) => {
    const valueLength = (item.value / total) * circumference;
    const segment = {
      ...item,
      radius,
      strokeWidth,
      circumference,
      dashArray: `${valueLength} ${circumference - valueLength}`,
      dashOffset: -offset,
    };
    offset += valueLength;
    return segment;
  });
}

export default function SalesStat() {
  const nav = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periodType, setPeriodType] = useState("주간");
  const [activeCategory, setActiveCategory] = useState("라면");
  const [salesTopCategory, setSalesTopCategory] = useState("카테고리");
  const [salesTopPeriod, setSalesTopPeriod] = useState("주간");
  const [revenueTopCategory, setRevenueTopCategory] = useState("카테고리");
  const [revenueTopPeriod, setRevenueTopPeriod] = useState("월간");

  const activeTrend = useMemo(
    () => categoryTrendMap[activeCategory] || categoryTrendMap["라면"],
    [activeCategory],
  );

  const donutSegments = useMemo(() => getDonutSegments(donutData), []);

  const summaryCards = [
    {
      title: "기간 총 매출액(GMV)",
      value: "12,345,678 원",
      change: "↑ 6%",
      sub: "vs last 7 days",
      positive: true,
    },
    {
      title: "기간 총 판매량",
      value: "1,420 개",
      change: "↑ 6%",
      sub: "vs last 7 days",
      positive: true,
    },
    {
      title: "기간 총 공헌이익",
      value: "4,345,678 원",
      change: "↑ 6%",
      sub: "vs Yesterday",
      positive: true,
    },
    {
      title: "평균 공헌이익률",
      value: "35.2%",
      change: "↑ 6%",
      sub: "vs last 7 days",
      positive: true,
    },
  ];

  return (
    <PageWrap>
      <PageTitle>판매 분석</PageTitle>

      <FilterRow>
        <DateInput
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <DateDivider>~</DateDivider>
        <DateInput
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <PeriodSelect
          value={periodType}
          onChange={(e) => setPeriodType(e.target.value)}
        >
          <option value="월간">월간</option>
          <option value="주간">주간</option>
          <option value="일간">일간</option>
        </PeriodSelect>
      </FilterRow>

      <SummaryGrid>
        {summaryCards.map((card) => (
          <MetricCard key={card.title}>
            <MetricTitle>{card.title}</MetricTitle>
            <MetricValue>{card.value}</MetricValue>
            <MetricMeta $positive={card.positive}>
              {card.change}
              <span>{card.sub}</span>
            </MetricMeta>
          </MetricCard>
        ))}
      </SummaryGrid>

      <ChartGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>카테고리 별 판매 추이</ChartTitle>
            <LegendGroup>
              <LegendItem>
                <LegendDot $color="#22c55e" />
                매출
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#c026d3" />
                공헌이익
              </LegendItem>
            </LegendGroup>
          </ChartHeader>

          <CategoryTabs>
            {Object.keys(categoryTrendMap).map((category) => (
              <CategoryTab
                key={category}
                type="button"
                $active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </CategoryTab>
            ))}
          </CategoryTabs>

          <LineChartWrap>
            <YAxisLeft>
              <span>5천</span>
              <span>4천</span>
              <span>3천</span>
              <span>2천</span>
              <span>1천</span>
              <span>0</span>
            </YAxisLeft>

            <ChartSvgArea>
              <LineSvg viewBox="0 0 520 240" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(activeTrend.sales, 520, 240, 22)}
                />
                <polyline
                  fill="none"
                  stroke="#c026d3"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(activeTrend.profit, 520, 240, 22)}
                />
              </LineSvg>

              <XAxis>
                {weekLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </XAxis>
            </ChartSvgArea>

            <YAxisRight>
              <span>6천</span>
              <span>5천</span>
              <span>4천</span>
              <span>3천</span>
              <span>2천</span>
              <span>0</span>
            </YAxisRight>
          </LineChartWrap>
        </ChartCard>

        <ChartCard>
          <ChartTitle>카테고리 별 판매 비중</ChartTitle>

          <DonutWrap>
            <DonutSvg viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="68"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="16"
              />
              {donutSegments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="100"
                  cy="100"
                  r={segment.radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={segment.strokeWidth}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 100 100)"
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
        </ChartCard>
      </ChartGrid>

      <DualTableGrid>
        <SmallRankCard>
          <SmallCardHeader>
            <SmallCardTitle>🏆 공헌이익률 높은 상품</SmallCardTitle>
          </SmallCardHeader>

          <MiniTableWrap>
            <MiniTable>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>상품코드</th>
                  <th>상품명</th>
                  <th>평균이익</th>
                  <th>이익률</th>
                </tr>
              </thead>
              <tbody>
                {highMarginRows.map((row) => (
                  <tr key={`high-${row.rank}`}>
                    <td>{row.rank}</td>
                    <td>
                      <CodeButton
                        type="button"
                        onClick={() =>
                          nav(`/admin/product-update/${row.productCode}`)
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
                      <ProfitText $positive>{row.profitRate}</ProfitText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </MiniTable>
          </MiniTableWrap>
        </SmallRankCard>

        <SmallRankCard>
          <SmallCardHeader>
            <SmallCardTitle>🧰 공헌이익률 낮은 상품</SmallCardTitle>
            <SmallCardLink>{"< 전략 수정 추천 >"}</SmallCardLink>
          </SmallCardHeader>

          <MiniTableWrap>
            <MiniTable>
              <thead>
                <tr>
                  <th>순위</th>
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
                          nav(`/admin/product-update/${row.productCode}`)
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
                      <ProfitText $positive={false}>
                        {row.profitRate}
                      </ProfitText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </MiniTable>
          </MiniTableWrap>
        </SmallRankCard>
      </DualTableGrid>

      <LargeTableCard>
        <LargeCardHeader>
          <LargeCardTitle>판매량 TOP 5</LargeCardTitle>

          <RightFilters>
            <TopSelect
              value={salesTopCategory}
              onChange={(e) => setSalesTopCategory(e.target.value)}
            >
              <option>카테고리</option>
              <option>라면</option>
              <option>즉석식품</option>
              <option>스낵과자</option>
            </TopSelect>
            <TopSelect
              value={salesTopPeriod}
              onChange={(e) => setSalesTopPeriod(e.target.value)}
            >
              <option>주간</option>
              <option>월간</option>
            </TopSelect>
          </RightFilters>
        </LargeCardHeader>

        <LargeTableScroll>
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
                <tr key={`sales-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton
                      type="button"
                      onClick={() =>
                        nav(`/admin/product-update/${row.productCode}`)
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
                    <CompareBadge $positive={false}>
                      {row.compareRate}
                    </CompareBadge>
                  </td>
                  <td>{row.avgSalePrice}</td>
                  <td>{row.avgProfit}</td>
                  <td>{row.profitRate}</td>
                </tr>
              ))}
            </tbody>
          </LargeTable>
        </LargeTableScroll>
      </LargeTableCard>

      <LargeTableCard>
        <LargeCardHeader>
          <LargeCardTitle>매출 TOP 5</LargeCardTitle>

          <RightFilters>
            <TopSelect
              value={revenueTopCategory}
              onChange={(e) => setRevenueTopCategory(e.target.value)}
            >
              <option>카테고리</option>
              <option>라면</option>
              <option>즉석식품</option>
              <option>스낵과자</option>
            </TopSelect>
            <TopSelect
              value={revenueTopPeriod}
              onChange={(e) => setRevenueTopPeriod(e.target.value)}
            >
              <option>월간</option>
              <option>주간</option>
              <option>일간</option>
            </TopSelect>
          </RightFilters>
        </LargeCardHeader>

        <LargeTableScroll>
          <LargeTable>
            <thead>
              <tr>
                <th>순위</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>매출</th>
                <th>일평균매출</th>
                <th>전 월 대비</th>
                <th>평균판매가</th>
                <th>평균이익</th>
                <th>평균이익률</th>
              </tr>
            </thead>
            <tbody>
              {revenueTopRows.map((row) => (
                <tr key={`revenue-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton
                      type="button"
                      onClick={() =>
                        nav(`/admin/product-update/${row.productCode}`)
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
                  <td>{row.revenue}</td>
                  <td>{row.dailyAvgRevenue}</td>
                  <td>
                    <CompareBadge $positive>{row.compareRate}</CompareBadge>
                  </td>
                  <td>{row.avgSalePrice}</td>
                  <td>{row.avgProfit}</td>
                  <td>{row.profitRate}</td>
                </tr>
              ))}
            </tbody>
          </LargeTable>
        </LargeTableScroll>
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
  margin: 0 0 18px;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const DateInput = styled.input`
  height: 38px;
  min-width: 132px;
  padding: 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const PeriodSelect = styled.select`
  height: 38px;
  min-width: 96px;
  padding: 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #6b7280;
  font-size: 13px;
  outline: none;
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

const MetricValue = styled.div`
  margin-top: 12px;
  color: #111827;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
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

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ChartTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
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

const CategoryTabs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 16px;
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

const LineChartWrap = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 34px 1fr 34px;
  gap: 8px;
  align-items: stretch;
`;

const YAxisLeft = styled.div`
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
`;

const YAxisRight = styled(YAxisLeft)`
  text-align: left;
`;

const ChartSvgArea = styled.div`
  min-width: 0;
`;

const LineSvg = styled.svg`
  width: 100%;
  height: 240px;
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

const DonutWrap = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DonutSvg = styled.svg`
  width: 260px;
  height: 260px;
  display: block;
`;

const DonutLegend = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px 18px;
`;

const DualTableGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const SmallRankCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const SmallCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const SmallCardTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const SmallCardLink = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const MiniTableWrap = styled.div`
  overflow-x: auto;
`;

const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;

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
    padding: 10px 8px;
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

const ProfitText = styled.span`
  color: ${({ $positive }) => ($positive ? "#22c55e" : "#ef4444")};
  font-weight: 700;
`;

const LargeTableCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
  margin-bottom: 18px;
`;

const LargeCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const LargeCardTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const RightFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TopSelect = styled.select`
  height: 36px;
  min-width: 92px;
  padding: 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #6b7280;
  font-size: 13px;
  outline: none;
`;

const LargeTableScroll = styled.div`
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

const CompareBadge = styled.span`
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

const DateDivider = styled.span`
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
`;
