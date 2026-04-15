import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Calendar, Search } from "lucide-react";

const categoryTabs = [
  "라면",
  "소시지",
  "스낵과자",
  "즉석식품",
  "카레",
  "탄산음료",
];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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

const aiEffectTrendMap = {
  라면: {
    aiSales: [4.8, 4.6, 4.8, 3.8, 3.0, 4.6, 4.1],
    aiMargin: [3.5, 3.3, 3.5, 2.7, 1.9, 3.0, 3.5],
    manualSales: [4.0, 4.2, 3.9, 4.4, 3.9, 4.2, 3.7],
    manualMargin: [1.8, 2.1, 1.6, 2.3, 1.8, 0.6, 0.5],
  },
  소시지: {
    aiSales: [3.8, 4.1, 4.0, 4.3, 3.9, 4.2, 4.1],
    aiMargin: [2.9, 3.1, 3.0, 3.3, 2.8, 3.2, 3.0],
    manualSales: [3.2, 3.4, 3.1, 3.6, 3.3, 3.4, 3.0],
    manualMargin: [1.4, 1.8, 1.5, 2.0, 1.7, 1.3, 1.1],
  },
  스낵과자: {
    aiSales: [3.1, 3.2, 3.4, 3.8, 3.5, 3.7, 3.6],
    aiMargin: [2.2, 2.4, 2.3, 2.8, 2.6, 2.7, 2.5],
    manualSales: [2.8, 3.0, 2.9, 3.2, 3.1, 3.0, 2.8],
    manualMargin: [1.1, 1.3, 1.2, 1.5, 1.4, 1.0, 0.9],
  },
  즉석식품: {
    aiSales: [4.2, 4.0, 4.3, 4.1, 3.6, 4.0, 3.9],
    aiMargin: [3.1, 2.9, 3.2, 3.0, 2.5, 2.8, 2.9],
    manualSales: [3.6, 3.7, 3.5, 3.8, 3.3, 3.4, 3.2],
    manualMargin: [1.6, 1.8, 1.7, 1.9, 1.5, 1.3, 1.2],
  },
  카레: {
    aiSales: [2.8, 2.9, 3.1, 3.0, 2.7, 3.2, 3.0],
    aiMargin: [2.0, 2.1, 2.3, 2.2, 2.0, 2.4, 2.2],
    manualSales: [2.4, 2.5, 2.6, 2.7, 2.4, 2.5, 2.3],
    manualMargin: [0.9, 1.0, 1.1, 1.2, 1.0, 0.8, 0.7],
  },
  탄산음료: {
    aiSales: [4.5, 4.7, 4.6, 4.8, 4.4, 4.9, 4.7],
    aiMargin: [3.4, 3.6, 3.5, 3.7, 3.2, 3.8, 3.6],
    manualSales: [3.7, 3.9, 3.8, 4.0, 3.7, 3.8, 3.6],
    manualMargin: [1.5, 1.7, 1.6, 1.8, 1.5, 1.2, 1.0],
  },
};

const revenueProfitTrend = {
  sales: [8.2, 7.9, 8.2, 6.3, 4.8, 2.1, 6.7],
  profit: [28, 31, 27, 33, 28, 33, 27],
};

const compareRows = [
  {
    category: "라면",
    aiDiffSales: "+10,000,000원",
    aiDiffProfit: "+2,056,366원",
    aiDiffQty: "+11,348개",
    aiDiffMargin: "-24%",
    aiSales: "22,345,678원",
    aiProfit: "6,545,704원",
    aiQty: "22,571개",
    aiMargin: "29.3%",
    manualSales: "12,345,678원",
    manualProfit: "4,489,337원",
    manualQty: "11,223개",
    manualMargin: "36.4%",
  },
  {
    category: "소시지",
    aiDiffSales: "+8,090,100원",
    aiDiffProfit: "+2,438,164원",
    aiDiffQty: "+1,256개",
    aiDiffMargin: "+1%",
    aiSales: "34,654,644원",
    aiProfit: "11,551,548원",
    aiQty: "5,134개",
    aiMargin: "33.3%",
    manualSales: "26,564,544원",
    manualProfit: "9,113,384원",
    manualQty: "3,878개",
    manualMargin: "34.3%",
  },
  {
    category: "스낵과자",
    aiDiffSales: "+8,090,100원",
    aiDiffProfit: "+3,473,756원",
    aiDiffQty: "+1,399개",
    aiDiffMargin: "-0.9%",
    aiSales: "34,654,644원",
    aiProfit: "15,876,265원",
    aiQty: "5,690개",
    aiMargin: "45.8%",
    manualSales: "26,564,544원",
    manualProfit: "12,402,509원",
    manualQty: "4,292개",
    manualMargin: "46.7%",
  },
  {
    category: "즉석식품",
    aiDiffSales: "-1,996,650원",
    aiDiffProfit: "+1,748,658원",
    aiDiffQty: "-208개",
    aiDiffMargin: "+7.6%",
    aiSales: "24,567,894원",
    aiProfit: "3,408,942원",
    aiQty: "1,175개",
    aiMargin: "13.9%",
    manualSales: "26,564,544원",
    manualProfit: "1,660,284원",
    manualQty: "1,384개",
    manualMargin: "6.3%",
  },
  {
    category: "카레",
    aiDiffSales: "+10,000,000원",
    aiDiffProfit: "+2,056,366원",
    aiDiffQty: "+11,348개",
    aiDiffMargin: "-24%",
    aiSales: "22,345,678원",
    aiProfit: "6,545,704원",
    aiQty: "22,571개",
    aiMargin: "29.29%",
    manualSales: "12,345,678원",
    manualProfit: "4,489,337원",
    manualQty: "11,223개",
    manualMargin: "36.4%",
  },
  {
    category: "탄산음료",
    aiDiffSales: "+900,900원",
    aiDiffProfit: "+3,525,271원",
    aiDiffQty: "-87개",
    aiDiffMargin: "+5.3%",
    aiSales: "65,465,465원",
    aiProfit: "8,964,776원",
    aiQty: "1,883개",
    aiMargin: "13.7%",
    manualSales: "64,564,565원",
    manualProfit: "5,439,505원",
    manualQty: "1,971개",
    manualMargin: "8.4%",
  },
];

const hourlyChartData = {
  lowest: [5.1, 5.3, 5.6, 6.8, 6.7, 5.8, 5.0, 1.8, 5.2],
  myPrice: [5.4, 4.8, 5.3, 6.2, 6.2, 5.6, 4.9, 1.2, 4.8],
  salesQty: [1.2, 1.6, 1.5, 1.1, 1.1, 1.0, 1.5, 1.7, 1.3],
  profit: [0.6, 0.55, 0.72, 0.78, 0.79, 0.68, 0.61, 0.35, 0.64],
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

function getBarLayout(
  values,
  width,
  height,
  padding = 24,
  groupOffset = 0,
  barWidth = 10,
) {
  const max = Math.max(...values, 1);

  return values.map((value, index) => {
    const groupWidth = (width - padding * 2) / values.length;
    const x = padding + index * groupWidth + groupOffset;
    const barHeight = (value / max) * (height - padding * 2);
    const y = height - padding - barHeight;

    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
      value,
    };
  });
}

export default function AIPriceStat() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periodType, setPeriodType] = useState("주간");
  const [activeCategory, setActiveCategory] = useState("소시지");
  const [trendKeyword, setTrendKeyword] = useState("");
  const [comparePeriod, setComparePeriod] = useState("주간");
  const [hourlyDate, setHourlyDate] = useState("");
  const [hourlyKeyword, setHourlyKeyword] = useState("");

  const activeEffectTrend = useMemo(
    () => aiEffectTrendMap[activeCategory] || aiEffectTrendMap["소시지"],
    [activeCategory],
  );

  const salesBars = useMemo(
    () => getBarLayout(hourlyChartData.salesQty, 820, 260, 28, 8, 10),
    [],
  );

  const profitBars = useMemo(
    () => getBarLayout(hourlyChartData.profit, 820, 260, 28, 22, 10),
    [],
  );

  const summaryCards = [
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
      title: "최저가 점유율",
      value: "35.2%",
      meta: "↑ 6%",
      sub: "vs last 7 days",
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

  return (
    <PageWrap>
      <PageTitle>AI 가격변경 성과</PageTitle>

      <TopFilterRow>
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
          <option value="일간">일간</option>
          <option value="주간">주간</option>
          <option value="월간">월간</option>
        </PeriodSelect>
      </TopFilterRow>

      <SummaryGrid>
        {summaryCards.map((card) => (
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

      <TopChartGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>AI 가격변경 성과</ChartTitle>
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
          </ChartHeader>

          <CategoryTabs>
            {categoryTabs.map((category) => (
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

          <DualAxisChartWrap>
            <LeftAxis>
              <span>5천</span>
              <span>4천</span>
              <span>3천</span>
              <span>2천</span>
              <span>1천</span>
              <span>0</span>
            </LeftAxis>

            <ChartCanvas>
              <ChartSvg viewBox="0 0 520 250" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    activeEffectTrend.aiSales,
                    520,
                    250,
                    22,
                  )}
                />
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    activeEffectTrend.manualSales,
                    520,
                    250,
                    22,
                  )}
                />
                <polyline
                  fill="none"
                  stroke="#7aa2ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    activeEffectTrend.aiMargin,
                    520,
                    250,
                    22,
                  )}
                />
                <polyline
                  fill="none"
                  stroke="#f3a6a6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    activeEffectTrend.manualMargin,
                    520,
                    250,
                    22,
                  )}
                />
              </ChartSvg>

              <XAxis>
                {weekLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </XAxis>
            </ChartCanvas>

            <RightAxis>
              <span>5백</span>
              <span>4백</span>
              <span>3백</span>
              <span>2백</span>
              <span>1백</span>
              <span>0</span>
            </RightAxis>
          </DualAxisChartWrap>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>매출/공헌이익 변동 추이</ChartTitle>

            <SearchInputWrap>
              <SearchInput
                value={trendKeyword}
                onChange={(e) => setTrendKeyword(e.target.value)}
                placeholder="상품명, 상품코드로 검색"
              />
              <SearchIconWrap>
                <Search size={15} />
              </SearchIconWrap>
            </SearchInputWrap>
          </ChartHeader>

          <SearchInfo>
            상품코드: 9744302255 / 상품명 : 농심 신라면건면 114g, 1개
          </SearchInfo>

          <SubLegend>
            <LegendItem>
              <LegendDot $color="#22c55e" />
              매출
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#c026d3" />
              공헌이익
            </LegendItem>
          </SubLegend>

          <MixedChartWrap>
            <ChartLeftAxis>
              <span>8천</span>
              <span>6천</span>
              <span>4천</span>
              <span>2천</span>
              <span>1천</span>
              <span>0</span>
            </ChartLeftAxis>

            <ChartCanvas>
              <ChartSvg viewBox="0 0 520 250" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    revenueProfitTrend.sales,
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
                    revenueProfitTrend.profit,
                    520,
                    250,
                    22,
                  )}
                />
              </ChartSvg>

              <XAxis>
                {weekLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </XAxis>
            </ChartCanvas>

            <ChartRightAxis>
              <span>40%</span>
              <span>30%</span>
              <span>20%</span>
              <span>10%</span>
              <span>5%</span>
              <span>0</span>
            </ChartRightAxis>
          </MixedChartWrap>
        </ChartCard>
      </TopChartGrid>

      <SectionCard>
        <SectionHeader>
          <SectionTitle>카테고리별 AI 성과 비교</SectionTitle>

          <RightTopFilter>
            <TopSelect
              value={comparePeriod}
              onChange={(e) => setComparePeriod(e.target.value)}
            >
              <option value="주간">주간</option>
              <option value="월간">월간</option>
            </TopSelect>
          </RightTopFilter>
        </SectionHeader>

        <WideTableWrap>
          <WideCompareTable>
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
              {compareRows.map((row) => (
                <tr key={row.category}>
                  <CategoryCell>{row.category}</CategoryCell>

                  <td>
                    <ChangeText $positive={!row.aiDiffSales.startsWith("-")}>
                      {row.aiDiffSales.startsWith("-") ? "↓" : "↑"}{" "}
                      {row.aiDiffSales.replace("-", "")}
                    </ChangeText>
                  </td>
                  <td>
                    <ChangeText $positive={!row.aiDiffProfit.startsWith("-")}>
                      {row.aiDiffProfit.startsWith("-") ? "↓" : "↑"}{" "}
                      {row.aiDiffProfit.replace("-", "")}
                    </ChangeText>
                  </td>
                  <td>
                    <ChangeText $positive={!row.aiDiffQty.startsWith("-")}>
                      {row.aiDiffQty.startsWith("-") ? "↓" : "↑"}{" "}
                      {row.aiDiffQty.replace("-", "")}
                    </ChangeText>
                  </td>
                  <td>
                    <ChangeText $positive={!row.aiDiffMargin.startsWith("-")}>
                      {row.aiDiffMargin.startsWith("-") ? "↓" : "↑"}{" "}
                      {row.aiDiffMargin.replace("-", "")}
                    </ChangeText>
                  </td>

                  <td>{row.aiSales}</td>
                  <td>{row.aiProfit}</td>
                  <td>{row.aiQty}</td>
                  <td>{row.aiMargin}</td>

                  <td>{row.manualSales}</td>
                  <td>{row.manualProfit}</td>
                  <td>{row.manualQty}</td>
                  <td>{row.manualMargin}</td>
                </tr>
              ))}
            </tbody>
          </WideCompareTable>
        </WideTableWrap>
      </SectionCard>

      <BottomChartCard>
        <SectionHeader>
          <SectionTitle>시간대별 최저가 변동 추이</SectionTitle>

          <RightFilters>
            <DateInput
              type="date"
              value={hourlyDate}
              onChange={(e) => setHourlyDate(e.target.value)}
            />
            <SearchInputWrap $small>
              <SearchInput
                value={hourlyKeyword}
                onChange={(e) => setHourlyKeyword(e.target.value)}
                placeholder="상품명, 상품코드로 검색"
              />
              <SearchIconWrap>
                <Search size={15} />
              </SearchIconWrap>
            </SearchInputWrap>
          </RightFilters>
        </SectionHeader>

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
            <BarLineSvg viewBox="0 0 820 260" preserveAspectRatio="none">
              {salesBars.map((bar, index) => (
                <rect
                  key={`sales-bar-${index}`}
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  rx="2"
                  fill="#2563eb"
                />
              ))}

              {profitBars.map((bar, index) => (
                <rect
                  key={`profit-bar-${index}`}
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
                points={buildLinePoints(hourlyChartData.lowest, 820, 260, 28)}
              />
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildLinePoints(hourlyChartData.myPrice, 820, 260, 28)}
              />
            </BarLineSvg>

            <XAxis>
              {hourLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </XAxis>
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
      </BottomChartCard>
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

const TopFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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
  font-size: 14px;
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

const TopChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1180px) {
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
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
  flex-wrap: wrap;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
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
  gap: 18px;
  flex-wrap: wrap;
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

const DualAxisChartWrap = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 34px 1fr 34px;
  gap: 8px;
  align-items: stretch;
`;

const MixedChartWrap = styled(DualAxisChartWrap)`
  margin-top: 16px;
`;

const LeftAxis = styled.div`
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
`;

const RightAxis = styled(LeftAxis)`
  text-align: left;
`;

const ChartLeftAxis = styled(LeftAxis)``;
const ChartRightAxis = styled(RightAxis)``;

const ChartCanvas = styled.div`
  min-width: 0;
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

const SearchInputWrap = styled.div`
  position: relative;
  min-width: ${({ $small }) => ($small ? "240px" : "260px")};
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
  margin-top: 14px;
  color: #4b5563;
  font-size: 12px;
  font-weight: 600;
`;

const SubLegend = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
`;

const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
  margin-bottom: 18px;
`;

const BottomChartCard = styled(SectionCard)``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const RightTopFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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

const WideTableWrap = styled.div`
  overflow-x: auto;
`;

const WideCompareTable = styled.table`
  width: 100%;
  min-width: 1280px;
  border-collapse: collapse;

  thead th {
    padding: 10px 8px;
    border: 1px solid #eef0f4;
    color: #9ca3af;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    background: #fafbfc;
  }

  tbody td {
    padding: 12px 8px;
    border: 1px solid #f3f4f6;
    color: #374151;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }
`;

const CategoryCell = styled.td`
  font-weight: 700 !important;
  color: #111827 !important;
`;

const ChangeText = styled.span`
  color: ${({ $positive }) => ($positive ? "#22c55e" : "#ef4444")};
  font-weight: 700;
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

const DateDivider = styled.span`
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
`;
