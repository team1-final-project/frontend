import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Info, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../api/adminDashboard";
import InfoTooltip from "../../components/InfoTooltip";

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

const numberFormat = (value) => `${Number(value || 0).toLocaleString()}원`;
const qtyFormat = (value) => `${Number(value || 0).toLocaleString()}개`;
const percentText = (value) => `${Number(value || 0).toFixed(1)}%`;

function buildLinePoints(values, width, height, padding = 18) {
  const safeValues = Array.isArray(values) && values.length ? values : [0];
  const max = Math.max(...safeValues, 1);
  const min = Math.min(...safeValues, 0);
  const range = max - min || 1;

  return safeValues
    .map((value, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(safeValues.length - 1, 1);
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
  const safeValues = Array.isArray(values) && values.length ? values : [0];
  const max = Math.max(...safeValues, 1);
  const groupWidth = (width - padding * 2) / safeValues.length;

  return safeValues.map((value, index) => {
    const barHeight = (value / max) * (height - padding * 2);
    return {
      x: padding + index * groupWidth + offset,
      y: height - padding - barHeight,
      width: barWidth,
      height: barHeight,
    };
  });
}

function buildStackedBars(points, width, height, padding = 28) {
  const safePoints =
    Array.isArray(points) && points.length
      ? points
      : weekLabels.map((label) => ({ label, segments: [0, 0, 0] }));

  const totals = safePoints.map((point) =>
    (point.segments || []).reduce((sum, value) => sum + Number(value || 0), 0),
  );
  const max = Math.max(...totals, 1);
  const groupWidth = (width - padding * 2) / safePoints.length;
  const barWidth = Math.min(26, groupWidth * 0.45);

  return safePoints.map((point, index) => {
    const [orange = 0, pink = 0, blue = 0] = point.segments || [];
    const x = padding + index * groupWidth + (groupWidth - barWidth) / 2;
    const baseY = height - padding;
    const orangeHeight = (orange / max) * (height - padding * 2);
    const pinkHeight = (pink / max) * (height - padding * 2);
    const blueHeight = (blue / max) * (height - padding * 2);

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

function formatDateTime(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 || 12;
  return `${year}.${month}.${day} ｜ ${displayHours} : ${minutes} ${ampm}`;
}

const gmvTooltipLines = [
  "매출(GMV) : 카드수수료 등을 제외하지 않은 실제 판매된 매출",
  "전체 매출 : AI 매출 + 일반 매출",
  "AI 매출 : AI 가격변경이 ON인 상태에서 발생한 매출",
  "일반 매출 : AI 가격변경이 OFF인 상태에서 발생한 매출",
];

const contributionTooltipLines = ["공헌이익 : 매출-(매출원가+변동비)"];

const aiPerformanceTooltipLines = [
  "수익성 개선 : 수동 가격변경 대비 AI 가격변경으로 인한 공헌이익 개선 금액",
  "AI 가격변경 횟수 : AI 가격변경된 횟수",
  "악성재고 판매 : AI 가격변경을 통한 악성재고의 판매량",
  "악성재고(재고 보유일수 90일 초과)의 감가상각 및 폐기비용으로 인한 손실을 줄이기 위해 AI가 판매가를 인하하여 판매를 촉진함",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeAiTab, setActiveAiTab] = useState("");
  const [activeShareTab, setActiveShareTab] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchDashboard = async (options = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminDashboard(options);
      setDashboard(data);

      if (!activeAiTab && data.categories?.length) {
        setActiveAiTab(data.categories[0]);
      }

      if (!activeShareTab && data.categories?.length) {
        setActiveShareTab(data.categories[0]);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail || "대시보드 데이터를 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSearch = () => {
    fetchDashboard({
      category: activeAiTab || undefined,
      share_category: activeShareTab || undefined,
      contribution_keyword: searchKeyword || undefined,
    });
  };

  const handleAiTabClick = (tab) => {
    setActiveAiTab(tab);
    fetchDashboard({
      category: tab,
      share_category: activeShareTab || tab,
      contribution_keyword: searchKeyword || undefined,
    });
  };

  const handleShareTabClick = (tab) => {
    setActiveShareTab(tab);
    fetchDashboard({
      category: activeAiTab || tab,
      share_category: tab,
      contribution_keyword: searchKeyword || undefined,
    });
  };

  const aiTrend = dashboard?.ai_strategy_trend || [];
  const contributionTrend = dashboard?.contribution_trend || [];

  const shareBars = useMemo(
    () => buildStackedBars(dashboard?.share_points || [], 520, 250, 28),
    [dashboard?.share_points],
  );

  const salesBars = useMemo(
    () =>
      buildBars(
        contributionTrend.map((item) => Number(item.sales_qty || 0)),
        760,
        260,
        28,
        10,
        10,
      ),
    [contributionTrend],
  );

  const profitBars = useMemo(
    () =>
      buildBars(
        contributionTrend.map((item) => Number(item.contribution_profit || 0)),
        760,
        260,
        28,
        24,
        10,
      ),
    [contributionTrend],
  );

  if (loading && !dashboard) {
    return <PageState>대시보드 데이터를 불러오는 중입니다.</PageState>;
  }

  if (error && !dashboard) {
    return <PageState>{error}</PageState>;
  }

  const categories = dashboard?.categories?.length
    ? dashboard.categories
    : ["전체"];
  const gmvCard = dashboard?.gmv_card;
  const contributionCard = dashboard?.contribution_card;
  const aiPerformance = dashboard?.ai_performance;

  return (
    <PageWrap>
      <PageTitle>대시보드</PageTitle>
      <DateText>{formatDateTime(dashboard?.current_time)}</DateText>
      {error ? <ErrorText>{error}</ErrorText> : null}

      <SectionLabel>
        <Dot $color="#6b7280" />
        KPI
      </SectionLabel>
      <SectionSubText>
        오늘 운영 성과와 주요 지표를 빠르게 확인하세요.
      </SectionSubText>

      <TopMetricGrid>
        <TopMetricCard>
          <MetricHeader>
            <MetricTitle>{gmvCard?.title || "금일 매출액(GMV)"}</MetricTitle>
            <InfoTooltip title="금일 매출액(GMV)" lines={gmvTooltipLines} />
          </MetricHeader>

          <MetricRow>
            <Dot $color="#22c55e" />
            <MetricLabel>{gmvCard?.total_label || "전체 매출"}</MetricLabel>
            <MetricValue>{numberFormat(gmvCard?.total_value)}</MetricValue>
          </MetricRow>

          {(gmvCard?.details || []).map((detail, index) => (
            <MetricRow key={`gmv-${detail.label}-${index}`}>
              <Dot $color={index === 0 ? "#2563eb" : "#ef5a67"} />
              <MetricLabel>{detail.label}</MetricLabel>
              <MetricSubValue>{numberFormat(detail.value)}</MetricSubValue>
            </MetricRow>
          ))}
        </TopMetricCard>

        <TopMetricCard>
          <MetricHeader>
            <MetricTitle>
              {contributionCard?.title || "금일 공헌이익"}
            </MetricTitle>
            <InfoTooltip
              title="금일 공헌이익"
              lines={contributionTooltipLines}
            />
          </MetricHeader>

          <MetricRow>
            <Dot $color="#22c55e" />
            <MetricLabel>
              {contributionCard?.total_label || "전체 이익"}
            </MetricLabel>
            <MetricValue>
              {numberFormat(contributionCard?.total_value)}
            </MetricValue>
          </MetricRow>

          {(contributionCard?.details || []).map((detail, index) => (
            <MetricRow key={`profit-${detail.label}-${index}`}>
              <Dot $color={index === 0 ? "#2563eb" : "#ef5a67"} />
              <MetricLabel>{detail.label}</MetricLabel>
              <MetricSubValue>{numberFormat(detail.value)}</MetricSubValue>
            </MetricRow>
          ))}
        </TopMetricCard>

        <TopMetricCard>
          <MetricHeader>
            <MetricTitle>AI 성과</MetricTitle>
            <InfoTooltip title="AI 성과" lines={aiPerformanceTooltipLines} />
          </MetricHeader>

          <MetricRow>
            <Dot $color="#22c55e" />
            <MetricLabel>수익성 개선</MetricLabel>
            <MetricValue>
              {numberFormat(aiPerformance?.improvement_profit)}
            </MetricValue>
          </MetricRow>

          <MetricRow>
            <Dot $color="#2563eb" />
            <MetricLabel>AI 가격변경 횟수</MetricLabel>
            <MetricSubValue>
              {Number(
                aiPerformance?.ai_price_change_count || 0,
              ).toLocaleString()}
              회
            </MetricSubValue>
          </MetricRow>

          <MetricRow>
            <Dot $color="#ef5a67" />
            <MetricLabel>악성재고 판매</MetricLabel>
            <MetricSubValue>
              {Number(
                aiPerformance?.bad_inventory_sold_sku_count || 0,
              ).toLocaleString()}{" "}
              SKU / {qtyFormat(aiPerformance?.bad_inventory_sold_qty)}
            </MetricSubValue>
          </MetricRow>
        </TopMetricCard>
      </TopMetricGrid>

      <SectionLabel>
        <Dot $color="#2563eb" />
        AI 전략 및 최저가
      </SectionLabel>
      <SectionSubText>
        시장 가격을 비교해 조정이 필요한 상품을 확인하세요.
      </SectionSubText>

      <ContentGrid>
        <Card>
          <CardTopRow>
            <SectionTitle>AI 가격 전략 성과</SectionTitle>
          </CardTopRow>

          <TabsRow>
            {categories.map((tab) => (
              <TabButton
                key={tab}
                type="button"
                $active={activeAiTab === tab}
                onClick={() => handleAiTabClick(tab)}
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
                  points={buildLinePoints(
                    aiTrend.map((item) => Number(item.ai_profit || 0)),
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
                    aiTrend.map((item) => Number(item.manual_profit || 0)),
                    520,
                    250,
                    22,
                  )}
                />
              </ChartSvg>

              <XAxis>
                {(aiTrend.length
                  ? aiTrend
                  : weekLabels.map((label) => ({ label }))
                ).map((item, index) => (
                  <span key={`${item.label}-${index}`}>{item.label}</span>
                ))}
              </XAxis>
            </ChartCanvas>

            <AxisRight>
              <span>5천</span>
              <span>4천</span>
              <span>3천</span>
              <span>2천</span>
              <span>1천</span>
              <span>0</span>
            </AxisRight>
          </DualAxisChartWrap>

          <LegendRow>
            <LegendItem>
              <Dot $color="#2563eb" />
              AI 이익
            </LegendItem>
            <LegendItem>
              <Dot $color="#ef4444" />
              수동 이익(예측)
            </LegendItem>
          </LegendRow>
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle>가격 조정 필요 상품</SectionTitle>
            <Info size={14} />
          </CardHeader>

          <MiniTable>
            <thead>
              <tr>
                <th>상품명</th>
                <th>현재가</th>
                <th>시장 최저가</th>
                <th>AI 추천가</th>
                <th>예상 효과</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.adjustment_items || []).map((row) => (
                <tr key={`adjust-${row.product_code}`}>
                  <td>
                    <ProductAnchor
                      href={`/product-detail?productCode=${row.product_code}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.product_name}
                    </ProductAnchor>
                  </td>
                  <td>{numberFormat(row.current_price)}</td>
                  <td>
                    <NegativeText>
                      {row.market_lowest_price
                        ? numberFormat(row.market_lowest_price)
                        : "-"}
                    </NegativeText>
                  </td>
                  <td>
                    <BlueText>
                      {row.ai_recommended_price
                        ? numberFormat(row.ai_recommended_price)
                        : "-"}
                    </BlueText>
                  </td>
                  <td>{row.expected_effect}</td>
                  <td>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </Card>
      </ContentGrid>

      <SectionLabel>
        <Dot $color="#eab308" />
        공헌이익
      </SectionLabel>
      <SectionSubText>
        수익성이 낮은 상품과 개선 대상을 점검하세요.
      </SectionSubText>

      <ContentGrid>
        <Card>
          <CardTopRow>
            <SectionTitle>가격 변화에 따른 공헌이익</SectionTitle>
            <SearchWrap>
              <SearchInput
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="상품명, 상품코드로 검색"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <SearchIconWrap role="button" onClick={handleSearch}>
                <Search size={15} />
              </SearchIconWrap>
            </SearchWrap>
          </CardTopRow>

          <InfoText>
            상품코드 : {dashboard?.contribution_product_code || "-"}{" "}
            {dashboard?.contribution_product_name || ""}
          </InfoText>

          <LegendRow>
            <LegendItem>
              <Dot $color="#ef4444" /> 최저가
            </LegendItem>
            <LegendItem>
              <Dot $color="#22c55e" /> 나의 판매가
            </LegendItem>
            <LegendItem>
              <Dot $color="#2563eb" /> 판매량
            </LegendItem>
            <LegendItem>
              <Dot $color="#eab308" /> 공헌이익
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
                {salesBars.map((bar, index) => (
                  <rect
                    key={`sales-${index}`}
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
                    key={`profit-${index}`}
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
                    contributionTrend.map((item) =>
                      Number(item.lowest_price || 0),
                    ),
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
                    contributionTrend.map((item) => Number(item.my_price || 0)),
                    760,
                    260,
                    28,
                  )}
                />
              </BarSvg>

              <XAxisNine>
                {(contributionTrend.length
                  ? contributionTrend
                  : hourLabels.map((label) => ({ label }))
                ).map((item, index) => (
                  <span key={`${item.label}-${index}`}>{item.label}</span>
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
            <SectionTitle>🚨 수익성 개선 필요 상품</SectionTitle>
          </SmallHeader>

          <MiniTable>
            <thead>
              <tr>
                <th>순서</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>평균이익</th>
                <th>이익률</th>
                <th>개선 제안</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.low_profit_items || []).map((row) => (
                <tr key={`low-profit-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton
                      type="button"
                      onClick={() =>
                        navigate(`/admin/product-update/${row.product_code}`)
                      }
                    >
                      {row.product_code}
                    </CodeButton>
                  </td>
                  <td>
                    <ProductAnchor
                      href={`/product-detail?productCode=${row.product_code}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.product_name}
                    </ProductAnchor>
                  </td>
                  <td>{numberFormat(row.average_profit)}</td>
                  <td>
                    <NegativeText>{percentText(row.profit_rate)}</NegativeText>
                  </td>
                  <td>
                    <GreenText>{row.suggestion}</GreenText>
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
      <SectionSubText>
        주요 판매 상품과 카테고리 비중을 확인하세요.
      </SectionSubText>

      <BottomGrid>
        <Card>
          <SmallHeader>
            <SectionTitle>판매랭킹 TOP 5</SectionTitle>
          </SmallHeader>

          <MiniTable>
            <thead>
              <tr>
                <th>순위</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>금일 판매량</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.ranking_items || []).map((row) => (
                <tr key={`rank-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton
                      type="button"
                      onClick={() =>
                        navigate(`/admin/product-update/${row.product_code}`)
                      }
                    >
                      {row.product_code}
                    </CodeButton>
                  </td>
                  <td>
                    <ProductAnchor
                      href={`/product-detail?productCode=${row.product_code}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.product_name}
                    </ProductAnchor>
                  </td>
                  <td>{qtyFormat(row.sales_qty)}</td>
                </tr>
              ))}
            </tbody>
          </MiniTable>
        </Card>

        <Card>
          <SectionTitle>상품별 판매 비중</SectionTitle>

          <TabsRow>
            {categories.map((tab) => (
              <TabButton
                key={tab}
                type="button"
                $active={activeShareTab === tab}
                onClick={() => handleShareTabClick(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </TabsRow>

          <ChartCanvasOnly>
            <ChartSvg viewBox="0 0 520 250" preserveAspectRatio="none">
              {shareBars.map((bar, index) => (
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
              {(dashboard?.share_points?.length
                ? dashboard.share_points
                : weekLabels.map((label) => ({ label }))
              ).map((item, index) => (
                <span key={`${item.label}-${index}`}>{item.label}</span>
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

const PageState = styled.div`
  padding: 40px 24px;
  color: #374151;
  font-size: 15px;
`;

const ErrorText = styled.div`
  margin-bottom: 14px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
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

const SectionSubText = styled.div`
  margin: -6px 0 16px 18px;
  color: #9ca3af;
  font-size: 13px;
  font-weight: 500;
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
`;

const CardHeader = styled(CardTopRow)``;
const SmallHeader = styled(CardTopRow)`
  margin-bottom: 10px;
`;

const TabsRow = styled.div`
  display: flex;
  gap: 18px;
  margin: 16px 0 8px;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  border: none;
  background: transparent;
  padding: 0 0 8px;
  color: ${({ $active }) => ($active ? "#111827" : "#9ca3af")};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#3b5bfd" : "transparent")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const DualAxisChartWrap = styled.div`
  display: grid;
  grid-template-columns: 38px 1fr 38px;
  align-items: stretch;
  gap: 8px;
`;

const AxisLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px 0 28px;
  color: #9ca3af;
  font-size: 11px;
`;

const AxisRight = styled(AxisLeft)`
  align-items: flex-start;
`;

const ChartCanvas = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChartCanvasOnly = styled(ChartCanvas)`
  margin-top: 12px;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 250px;
  overflow: visible;
`;

const XAxis = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  color: #9ca3af;
  font-size: 11px;
  text-align: center;
`;

const LegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
`;

const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 8px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 12px;
    color: #374151;
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: #9ca3af;
    font-weight: 700;
    white-space: nowrap;
  }
`;

const ProductAnchor = styled.a`
  color: #374151;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CodeButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
`;

const SearchWrap = styled.div`
  width: 220px;
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 9px 10px;
  font-size: 12px;
  color: #374151;
  background: transparent;
`;

const SearchIconWrap = styled.div`
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;
`;

const InfoText = styled.div`
  margin: 10px 0 12px;
  color: #6b7280;
  font-size: 12px;
`;

const BarChartWrap = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr 52px;
  gap: 8px;
`;

const BarAxisLeft = styled(AxisLeft)`
  padding-bottom: 28px;
`;

const BarAxisRight = styled(AxisRight)`
  padding-bottom: 28px;
`;

const BarSvg = styled.svg`
  width: 100%;
  height: 260px;
  overflow: visible;
`;

const XAxisNine = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  color: #9ca3af;
  font-size: 11px;
  text-align: center;
`;

const NegativeText = styled.span`
  color: #ef4444;
  font-weight: 700;
`;

const BlueText = styled.span`
  color: #2563eb;
  font-weight: 700;
`;

const GreenText = styled.span`
  color: #16a34a;
  font-weight: 700;
`;
