import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { ChevronDown, Info, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tabs = ["라면", "소시지", "스낵과자", "즉석식품", "카레", "탄산음료"];
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

const aiTrendMap = {
  라면: {
    aiSales: [4.8, 4.6, 4.9, 3.8, 3.0, 4.6, 4.1],
    aiProfit: [3.6, 3.4, 3.6, 2.8, 2.0, 3.4, 4.0],
    manualSales: [4.0, 4.3, 3.9, 4.5, 3.9, 4.7, 4.0],
    manualProfit: [1.8, 2.1, 1.6, 2.4, 1.8, 0.5, 0.45],
  },
  소시지: {
    aiSales: [4.9, 4.7, 4.9, 3.9, 3.0, 4.7, 4.2],
    aiProfit: [3.6, 3.5, 3.7, 2.8, 2.0, 3.5, 4.1],
    manualSales: [4.0, 4.4, 4.0, 4.6, 4.0, 4.8, 4.1],
    manualProfit: [1.8, 2.1, 1.6, 2.4, 1.8, 0.5, 0.45],
  },
  스낵과자: {
    aiSales: [3.8, 3.7, 3.9, 3.1, 2.7, 3.8, 3.5],
    aiProfit: [2.9, 2.8, 3.0, 2.3, 1.8, 2.9, 2.7],
    manualSales: [3.2, 3.4, 3.1, 3.6, 3.2, 3.7, 3.0],
    manualProfit: [1.4, 1.7, 1.3, 1.9, 1.5, 0.7, 0.6],
  },
  즉석식품: {
    aiSales: [4.3, 4.2, 4.4, 3.5, 2.9, 4.1, 3.8],
    aiProfit: [3.1, 3.0, 3.2, 2.5, 1.9, 3.0, 2.8],
    manualSales: [3.7, 3.9, 3.6, 4.1, 3.6, 4.0, 3.5],
    manualProfit: [1.5, 1.8, 1.4, 2.0, 1.6, 0.8, 0.7],
  },
  카레: {
    aiSales: [2.9, 2.8, 3.0, 2.4, 2.0, 2.9, 2.7],
    aiProfit: [2.1, 2.0, 2.2, 1.7, 1.3, 2.1, 2.0],
    manualSales: [2.4, 2.6, 2.3, 2.7, 2.4, 2.8, 2.5],
    manualProfit: [1.0, 1.2, 0.9, 1.3, 1.0, 0.5, 0.4],
  },
  탄산음료: {
    aiSales: [4.5, 4.4, 4.6, 4.1, 3.8, 4.7, 4.2],
    aiProfit: [3.4, 3.3, 3.5, 3.0, 2.6, 3.4, 3.0],
    manualSales: [3.9, 4.1, 3.8, 4.2, 3.9, 4.3, 3.8],
    manualProfit: [1.6, 1.8, 1.5, 1.9, 1.6, 0.9, 0.7],
  },
};

const competitorTrend = {
  my: [4.7, 4.5, 4.7, 3.8, 3.0, 2.0, 4.2],
  rival: [4.0, 4.3, 3.9, 4.5, 4.0, 4.5, 3.6],
};

const lowestProfitTrend = {
  lowest: [5.2, 5.6, 6.8, 6.7, 5.5, 4.9, 1.8, 5.7, 4.7],
  myPrice: [5.3, 4.8, 5.4, 6.2, 6.2, 5.6, 1.4, 5.0, 4.2],
  sales: [1.2, 1.6, 1.5, 1.3, 1.3, 1.2, 1.5, 1.7, 1.3],
  profit: [0.6, 0.7, 0.8, 0.9, 0.9, 0.7, 0.6, 0.25, 0.7],
};

const shareMap = {
  라면: {
    orange: [0.4, 0.7, 0.3, 0.4, 0.5, 0.5, 0.6],
    pink: [1.0, 1.8, 0.8, 1.7, 1.4, 1.4, 1.3],
    blue: [0.9, 0.7, 0.6, 2.4, 2.1, 2.1, 2.1],
  },
  소시지: {
    orange: [0.5, 0.8, 0.4, 0.5, 0.8, 0.7, 0.7],
    pink: [1.1, 1.9, 0.9, 1.6, 1.2, 1.2, 1.2],
    blue: [0.8, 0.5, 0.5, 2.5, 2.2, 2.2, 2.2],
  },
  스낵과자: {
    orange: [0.3, 0.6, 0.3, 0.4, 0.5, 0.4, 0.5],
    pink: [0.9, 1.6, 0.7, 1.3, 1.1, 1.0, 1.0],
    blue: [0.7, 0.5, 0.5, 2.0, 1.9, 1.8, 1.8],
  },
  즉석식품: {
    orange: [0.4, 0.7, 0.3, 0.5, 0.6, 0.5, 0.5],
    pink: [1.0, 1.7, 0.8, 1.5, 1.2, 1.2, 1.2],
    blue: [0.9, 0.6, 0.6, 2.1, 2.0, 2.0, 2.0],
  },
  카레: {
    orange: [0.3, 0.5, 0.2, 0.4, 0.4, 0.4, 0.4],
    pink: [0.8, 1.2, 0.6, 1.0, 0.9, 0.9, 0.9],
    blue: [0.6, 0.4, 0.4, 1.8, 1.7, 1.7, 1.7],
  },
  탄산음료: {
    orange: [0.5, 0.8, 0.4, 0.6, 0.7, 0.7, 0.7],
    pink: [1.1, 1.8, 0.9, 1.6, 1.3, 1.3, 1.3],
    blue: [0.9, 0.6, 0.6, 2.2, 2.1, 2.1, 2.1],
  },
};

const lowStrategyRows = Array.from({ length: 5 }).map((_, index) => ({
  rank: index + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  reason: index % 2 === 0 ? "최저가 제한" : "최대 조정가 제한",
}));

const notLowestRows = Array.from({ length: 5 }).map(() => ({
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  salePrice: "800원",
  lowestPrice: "700원",
  gap: "100원",
  rate: "+14.2%",
}));

const lowMarginRows = Array.from({ length: 5 }).map((_, index) => ({
  rank: index + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  avgProfit: "800원",
  profitRate: "28.5%",
}));

const rankingRows = Array.from({ length: 5 }).map((_, index) => ({
  rank: index + 1,
  productCode: "9744302255",
  productName: "농심 신라면건면 114g, 1개",
  salesQty: "1,864개",
}));

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

function buildBars(
  values,
  width,
  height,
  padding = 28,
  offset = 0,
  barWidth = 10,
) {
  const max = Math.max(...values, 1);
  const groupWidth = (width - padding * 2) / values.length;

  return values.map((value, index) => {
    const barHeight = (value / max) * (height - padding * 2);
    return {
      x: padding + index * groupWidth + offset,
      y: height - padding - barHeight,
      width: barWidth,
      height: barHeight,
    };
  });
}

function buildStackedBars(dataset, width, height, padding = 28) {
  const totals = dataset.orange.map(
    (_, index) =>
      dataset.orange[index] + dataset.pink[index] + dataset.blue[index],
  );
  const max = Math.max(...totals, 1);
  const groupWidth = (width - padding * 2) / totals.length;
  const barWidth = Math.min(26, groupWidth * 0.45);

  return totals.map((_, index) => {
    const x = padding + index * groupWidth + (groupWidth - barWidth) / 2;
    const baseY = height - padding;

    const orangeHeight = (dataset.orange[index] / max) * (height - padding * 2);
    const pinkHeight = (dataset.pink[index] / max) * (height - padding * 2);
    const blueHeight = (dataset.blue[index] / max) * (height - padding * 2);

    return {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeAiTab, setActiveAiTab] = useState("소시지");
  const [activeShareTab, setActiveShareTab] = useState("소시지");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const activeAiData = useMemo(
    () => aiTrendMap[activeAiTab] || aiTrendMap["소시지"],
    [activeAiTab],
  );

  const activeShareBars = useMemo(
    () =>
      buildStackedBars(
        shareMap[activeShareTab] || shareMap["소시지"],
        520,
        250,
        28,
      ),
    [activeShareTab],
  );

  const lowestSalesBars = useMemo(
    () => buildBars(lowestProfitTrend.sales, 760, 260, 28, 10, 10),
    [],
  );

  const lowestProfitBars = useMemo(
    () => buildBars(lowestProfitTrend.profit, 760, 260, 28, 24, 10),
    [],
  );

  return (
    <PageWrap>
      <PageTitle>대시보드</PageTitle>
      <DateText>2026.04.06 ｜ 11 : 36 am</DateText>

      <TopMetricGrid>
        <TopMetricCard>
          <MetricHeader>
            <MetricTitle>금일 매출액(GMV)</MetricTitle>
            <Info size={14} />
          </MetricHeader>

          <MetricRow>
            <Dot $color="#22c55e" />
            <MetricLabel>전체 매출</MetricLabel>
            <MetricValue>12,345,678 원</MetricValue>
          </MetricRow>
          <MetricRow>
            <Dot $color="#2563eb" />
            <MetricLabel>AI 매출</MetricLabel>
            <MetricSubValue>8,345,678 원</MetricSubValue>
          </MetricRow>
          <MetricRow>
            <Dot $color="#ef5a67" />
            <MetricLabel>일반 매출</MetricLabel>
            <MetricSubValue>4,000,000 원</MetricSubValue>
          </MetricRow>
        </TopMetricCard>

        <TopMetricCard>
          <MetricHeader>
            <MetricTitle>금일 공헌이익</MetricTitle>
            <Info size={14} />
          </MetricHeader>

          <MetricRow>
            <Dot $color="#22c55e" />
            <MetricLabel>전체 이익</MetricLabel>
            <MetricValue>12,345,678 원</MetricValue>
          </MetricRow>
          <MetricRow>
            <Dot $color="#2563eb" />
            <MetricLabel>AI 이익</MetricLabel>
            <MetricSubValue>8,345,678 원</MetricSubValue>
          </MetricRow>
          <MetricRow>
            <Dot $color="#ef5a67" />
            <MetricLabel>일반 이익</MetricLabel>
            <MetricSubValue>4,000,000 원</MetricSubValue>
          </MetricRow>
        </TopMetricCard>

        <TopMetricCard>
          <MetricHeader>
            <MetricTitle>AI 성과</MetricTitle>
            <Info size={14} />
          </MetricHeader>

          <MetricRow>
            <Dot $color="#22c55e" />
            <MetricLabel>수익성 개선</MetricLabel>
            <MetricValue>2,345,678 원</MetricValue>
          </MetricRow>
          <MetricRow>
            <Dot $color="#2563eb" />
            <MetricLabel>AI 가격변경 횟수</MetricLabel>
            <MetricSubValue>48 회</MetricSubValue>
          </MetricRow>
          <MetricRow>
            <Dot $color="#ef5a67" />
            <MetricLabel>악성재고 판매</MetricLabel>
            <MetricSubValue>4 sku / 68 개</MetricSubValue>
          </MetricRow>
        </TopMetricCard>
      </TopMetricGrid>

      <SectionLabel>
        <Dot $color="#2563eb" />
        AI 전략 및 최저가
      </SectionLabel>

      <ContentGrid>
        <Card>
          <CardTopRow>
            <SectionTitle>AI 가격변경 성과</SectionTitle>

            <ToggleWrap>
              <ToggleLabel>AI</ToggleLabel>
              <ToggleButton
                type="button"
                $active={aiEnabled}
                onClick={() => setAiEnabled((prev) => !prev)}
              >
                <ToggleThumb $active={aiEnabled} />
              </ToggleButton>
            </ToggleWrap>
          </CardTopRow>

          <TabsRow>
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                type="button"
                $active={activeAiTab === tab}
                onClick={() => setActiveAiTab(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </TabsRow>

          <DualAxisChartWrap>
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
                  points={buildLinePoints(activeAiData.aiSales, 520, 250, 22)}
                />
                <polyline
                  fill="none"
                  stroke="#7aa2ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(activeAiData.aiProfit, 520, 250, 22)}
                />
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(
                    activeAiData.manualSales,
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
                    activeAiData.manualProfit,
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

            <AxisRight>
              <span>5백</span>
              <span>4백</span>
              <span>3백</span>
              <span>2백</span>
              <span>1백</span>
              <span>0</span>
            </AxisRight>
          </DualAxisChartWrap>

          <LegendRow>
            <LegendItem>
              <Dot $color="#2563eb" />
              AI 매출
            </LegendItem>
            <LegendItem>
              <Dot $color="#7aa2ff" />
              AI 이익
            </LegendItem>
            <LegendItem>
              <Dot $color="#ef4444" />
              수동 매출(예측)
            </LegendItem>
            <LegendItem>
              <Dot $color="#f3a6a6" />
              수동 이익(예측)
            </LegendItem>
          </LegendRow>
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle>전략 수정 필요한 상품</SectionTitle>
            <Info size={14} />
          </CardHeader>

          <MiniTable>
            <thead>
              <tr>
                <th>순위</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {lowStrategyRows.map((row) => (
                <tr key={`strategy-${row.rank}`}>
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
                  <td>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </Card>

        <Card>
          <SmallHeader>
            <SectionTitle>🚨 현재 최저가가 아닌 상품</SectionTitle>
            <HeaderLink>{"< 전략 수정 추천 >"}</HeaderLink>
          </SmallHeader>

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
              {notLowestRows.map((row, index) => (
                <tr key={`not-lowest-${index}`}>
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
                    <RateBadge $negative>{row.rate}</RateBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </Card>

        <Card>
          <CardTopRow>
            <SectionTitle>경쟁사 최저가 추이</SectionTitle>

            <SearchWrap>
              <SearchInput
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="상품명, 상품코드로 검색"
              />
              <SearchIconWrap>
                <Search size={15} />
              </SearchIconWrap>
            </SearchWrap>
          </CardTopRow>

          <InfoText>
            선택된상품 : 9744302255　농심 신라면건면 114g, 1개
          </InfoText>

          <LegendRow>
            <LegendItem>
              <Dot $color="#2563eb" />내 상품
            </LegendItem>
            <LegendItem>
              <Dot $color="#ef4444" />
              경쟁사 상품
            </LegendItem>
          </LegendRow>

          <DualAxisChartWrap>
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
                  points={buildLinePoints(competitorTrend.my, 520, 250, 22)}
                />
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildLinePoints(competitorTrend.rival, 520, 250, 22)}
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
          </DualAxisChartWrap>
        </Card>
      </ContentGrid>

      <SectionLabel>
        <Dot $color="#eab308" />
        공헌이익
      </SectionLabel>

      <ContentGrid>
        <Card>
          <SectionTitle>최저가 변동 및 공헌이익</SectionTitle>
          <InfoText>상품코드 : 9744302255</InfoText>

          <LegendRow>
            <LegendItem>
              <Dot $color="#ef4444" />
              최저가
            </LegendItem>
            <LegendItem>
              <Dot $color="#22c55e" />
              나의 판매가
            </LegendItem>
            <LegendItem>
              <Dot $color="#2563eb" />
              판매량
            </LegendItem>
            <LegendItem>
              <Dot $color="#eab308" />
              공헌이익
            </LegendItem>
          </LegendRow>

          <BarChartWrap>
            <BarAxisLeft>
              <span>1.5천개</span>
              <span>1.3천개</span>
              <span>1천개</span>
              <span>0.5천개</span>
              <span>0.3천개</span>
              <span>0</span>
            </BarAxisLeft>

            <ChartCanvas>
              <BarSvg viewBox="0 0 760 260" preserveAspectRatio="none">
                {lowestSalesBars.map((bar, index) => (
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
                {lowestProfitBars.map((bar, index) => (
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
                  points={buildLinePoints(
                    lowestProfitTrend.lowest,
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
                    lowestProfitTrend.myPrice,
                    760,
                    260,
                    28,
                  )}
                />
              </BarSvg>

              <XAxisNine>
                {hourLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </XAxisNine>
            </ChartCanvas>

            <BarAxisRight>
              <span>8천원</span>
              <span>6천원</span>
              <span>4천원</span>
              <span>2천원</span>
              <span>1천원</span>
              <span>0</span>
            </BarAxisRight>
          </BarChartWrap>
        </Card>

        <Card>
          <SmallHeader>
            <SectionTitle>🚨 공헌이익률 낮은 상품</SectionTitle>
            <HeaderLink>{"< 전략 수정 추천 >"}</HeaderLink>
          </SmallHeader>

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
                <tr key={`margin-${row.rank}`}>
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
        </Card>
      </ContentGrid>

      <SectionLabel>
        <Dot $color="#22c55e" />
        판매랭킹 및 비중
      </SectionLabel>

      <BottomGrid>
        <Card>
          <SmallHeader>
            <SectionTitle>판매랭킹 TOP 5</SectionTitle>
            <HeaderLink>{"< 금일 판매량 >"}</HeaderLink>
          </SmallHeader>

          <MiniTable>
            <thead>
              <tr>
                <th>순위</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>판매량</th>
              </tr>
            </thead>
            <tbody>
              {rankingRows.map((row) => (
                <tr key={`rank-${row.rank}`}>
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
                  <td>{row.salesQty}</td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </Card>

        <Card>
          <SectionTitle>상품별 판매 비중</SectionTitle>

          <TabsRow>
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                type="button"
                $active={activeShareTab === tab}
                onClick={() => setActiveShareTab(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </TabsRow>

          <ChartCanvasOnly>
            <ChartSvg viewBox="0 0 520 250" preserveAspectRatio="none">
              {activeShareBars.map((bar, index) => (
                <g key={`share-${index}`}>
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
      </BottomGrid>
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

const DateText = styled.div`
  margin-top: 10px;
  margin-bottom: 18px;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
`;

const TopMetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const TopMetricCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #9ca3af;
`;

const MetricTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const MetricRow = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 10px 1fr auto;
  align-items: center;
  column-gap: 10px;
`;

const MetricLabel = styled.div`
  color: #111827;
  font-size: 13px;
  font-weight: 600;
`;

const MetricValue = styled.div`
  color: #111827;
  font-size: 18px;
  font-weight: 800;
`;

const MetricSubValue = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  display: inline-block;
  flex-shrink: 0;
`;

const SectionLabel = styled.div`
  margin: 10px 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const BottomGrid = styled(ContentGrid)``;

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

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const CardHeader = styled(CardTopRow)``;

const SmallHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const HeaderLink = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const ToggleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleLabel = styled.div`
  color: #111827;
  font-size: 13px;
  font-weight: 700;
`;

const ToggleButton = styled.button`
  width: 38px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#2563eb" : "#d1d5db")};
  padding: 0;
  position: relative;
  cursor: pointer;
`;

const ToggleThumb = styled.span`
  position: absolute;
  top: 50%;
  left: ${({ $active }) => ($active ? "18px" : "2px")};
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffffff;
  transition: left 0.15s ease;
`;

const TabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

const TabButton = styled.button`
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
  margin-top: 8px;
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

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
`;

const MiniTable = styled.table`
  width: 100%;
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

const NegativeText = styled.span`
  color: #ef4444;
  font-weight: 700;
`;

const RateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  background: ${({ $negative }) => ($negative ? "#fee2e2" : "#dcfce7")};
  color: ${({ $negative }) => ($negative ? "#ef4444" : "#16a34a")};
  font-size: 12px;
  font-weight: 700;
`;

const SearchWrap = styled.div`
  position: relative;
  min-width: 230px;
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

const InfoText = styled.div`
  margin-bottom: 10px;
  color: #4b5563;
  font-size: 12px;
  font-weight: 600;
`;

const BarChartWrap = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  gap: 8px;
  align-items: stretch;
`;

const BarAxisLeft = styled.div`
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
`;

const BarAxisRight = styled(BarAxisLeft)`
  text-align: left;
`;

const BarSvg = styled.svg`
  width: 100%;
  height: 260px;
  display: block;
`;
