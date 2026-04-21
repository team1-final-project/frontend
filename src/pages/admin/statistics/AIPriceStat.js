import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Search, ChevronDown } from "lucide-react";
import InfoTooltip from "../../../components/InfoTooltip";
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

import { getAdminAIPriceStat } from "../../../api/adminAIPriceStat";

const PERIOD_OPTIONS = [
  { value: "daily", label: "일간" },
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
];

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

function getDiffMeta(aiValue, manualValue, type = "currency") {
  const diff = Number(aiValue || 0) - Number(manualValue || 0);
  const abs = Math.abs(diff);
  const isPositive = diff >= 0;

  if (type === "count") {
    return {
      isPositive,
      text: `${formatNumber(abs)}개`,
    };
  }

  if (type === "percent") {
    return {
      isPositive,
      text: `${abs.toFixed(1)}%`,
    };
  }

  return {
    isPositive,
    text: `${formatNumber(Math.round(abs))}원`,
  };
}

function PerformanceDiffCell({ aiValue, manualValue, type = "currency" }) {
  const { isPositive, text } = getDiffMeta(aiValue, manualValue, type);

  return (
    <PerformanceDiff $positive={isPositive}>
      {isPositive ? "↑" : "↓"} {text}
    </PerformanceDiff>
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
  const [performanceCategory, setPerformanceCategory] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);

        const data = await getAdminAIPriceStat({
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          period,
          simulation_keyword: simulationKeyword || undefined,
          simulation_category: simulationCategory,
          simulation_period: simulationPeriod,
          compare_period: comparePeriod,
          performance_category: performanceCategory || undefined,
        });

        setDashboard(data);

        const options = data?.category_options || [];
        if (options.length > 0 && (!performanceCategory || !options.includes(performanceCategory))) {
          setPerformanceCategory(options[0]);
        }
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.detail || "AI 가격변경 분석 조회에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [
    startDate,
    endDate,
    period,
    simulationKeyword,
    simulationCategory,
    simulationPeriod,
    comparePeriod,
    performanceCategory,
  ]);

  const categoryOptions = dashboard?.category_options || [];

  const summary = dashboard?.summary || {
    compare_label: "전주 대비",
    ai_revenue: 0,
    ai_revenue_change_rate: 0,
    ai_profit: 0,
    ai_profit_margin: 0,
    ai_profit_change_rate: 0,
    lowest_price_share: 0,
    lowest_price_share_change_rate: 0,
    price_change_count: 0,
    price_change_count_change_rate: 0,
  };

  const simulationChartData = dashboard?.simulation?.items || [];
  const categoryComparisonRows = dashboard?.category_comparison?.items || [];
  const categoryCompareLabel =
    dashboard?.category_comparison?.compare_label || "전주 대비";
  const performanceChartData = dashboard?.performance?.items || [];
  const historyRows = dashboard?.history?.items || [];
  const strategyRows = dashboard?.strategy?.items || [];
  const strategyCompareLabel =
    dashboard?.strategy?.compare_label || "전주 대비";

  const handleProductClick = (productCode) => {
    navigate(`/admin/product-update/${productCode}`, {
      state: { focusSection: "ai-pricing" },
    });
  };

  const summaryCards = useMemo(
    () => [
      {
        title: "AI 창출 매출액",
        mainValue: formatNumber(summary.ai_revenue),
        mainSuffix: "원",
        change: summary.ai_revenue_change_rate,
      },
      {
        title: "AI 창출 공헌이익",
        mainValue: formatPercent(summary.ai_profit_margin),
        subValue: `/ ${formatCurrency(summary.ai_profit)}`,
        change: summary.ai_profit_change_rate,
      },
      {
        title: "최저가 점유율",
        mainValue: formatPercent(summary.lowest_price_share),
        change: summary.lowest_price_share_change_rate,
      },
      {
        title: "AI 가격변경 횟수",
        mainValue: formatNumber(summary.price_change_count),
        mainSuffix: "회",
        change: summary.price_change_count_change_rate,
      },
    ],
    [summary]
  );

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

      {isLoading ? <LoadingText>데이터를 불러오는 중입니다.</LoadingText> : null}

      <SummaryGrid>
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            mainValue={card.mainValue}
            mainSuffix={card.mainSuffix}
            subValue={card.subValue}
            change={card.change}
            compareLabel={summary.compare_label}
          />
        ))}
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
                {categoryOptions.map((category) => (
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
                dataKey="ai_revenue"
                name="AI 매출"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ai_profit"
                name="AI 이익"
                stroke="#7aa2ff"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manual_revenue"
                name="수동 매출(예측)"
                stroke="#ef5350"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manual_profit"
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
                    <PerformanceDiffCell
                      aiValue={row.ai.revenue}
                      manualValue={row.manual.revenue}
                      type="currency"
                    />
                  </td>
                  <td>
                    <PerformanceDiffCell
                      aiValue={row.ai.profit}
                      manualValue={row.manual.profit}
                      type="currency"
                    />
                  </td>
                  <td>
                    <PerformanceDiffCell
                      aiValue={row.ai.sales}
                      manualValue={row.manual.sales}
                      type="count"
                    />
                  </td>
                  <td>
                    <PerformanceDiffCell
                      aiValue={row.ai.margin}
                      manualValue={row.manual.margin}
                      type="percent"
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
            {categoryOptions.map((category) => (
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
                  dataKey="ai_revenue"
                  name="AI 매출"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ai_profit"
                  name="AI 이익"
                  stroke="#7aa2ff"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="manual_revenue"
                  name="수동 매출(예측)"
                  stroke="#ef5350"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="manual_profit"
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
                <tr key={`${row.product_code}-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton type="button" onClick={() => handleProductClick(row.product_code)}>
                      {row.product_code}
                    </CodeButton>
                  </td>
                  <td>{row.product_name}</td>
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
            <InfoTooltip
              title="사유 기준 안내"
              ariaLabel="전략 수정 필요한 상품 사유 안내"
              width={300}
              lines={[
                "최저가 제한: 현재 판매가가 최소 허용 가격에 도달했거나 근접해 추가 인하 여지가 거의 없는 상태입니다.",
                "회당 조정가 제한: 현재 판매가가 시장 최저가보다 높아 추가 조정이 필요하지만, 한 번에 조정 가능한 가격 범위를 고려해야 하는 상태입니다.",
              ]}
            />
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
                <th>{strategyCompareLabel}</th>
                <th>판매가</th>
                <th>이익</th>
                <th>이익률</th>
                <th>카테고리</th>
              </tr>
            </thead>
            <tbody>
              {strategyRows.map((row) => (
                <tr key={`${row.product_code}-${row.rank}`}>
                  <td>{row.rank}</td>
                  <td>
                    <CodeButton type="button" onClick={() => handleProductClick(row.product_code)}>
                      {row.product_code}
                    </CodeButton>
                  </td>
                  <td>{row.product_name}</td>
                  <td>
                    <StrategyReason>{row.reason}</StrategyReason>
                  </td>
                  <td>{formatCount(row.sales_qty)}</td>
                  <td>{formatCount(row.stock)}</td>
                  <td>
                    <DeltaBadge $negative={row.compare_rate < 0}>
                      {formatDeltaPercent(row.compare_rate)}
                    </DeltaBadge>
                  </td>
                  <td>{formatCurrency(row.sale_price)}</td>
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

const LoadingText = styled.div`
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
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
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #dfe5ee;
  border-radius: 14px;
  background: #ffffff;
  overflow: hidden;

  th,
  td {
    padding: 14px 12px;
    text-align: center;
    white-space: nowrap;
    font-size: 13px;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }

  thead th {
    color: #9aa3b2;
    font-weight: 700;
    background: #ffffff;
  }

  tbody td {
    color: #1f2937;
    font-weight: 500;
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  thead tr:last-child th {
    border-bottom: 1px solid #dfe5ee;
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

const PerformanceDiff = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${({ $positive }) => ($positive ? "#22c55e" : "#ef4444")};
  font-size: 14px;
  font-weight: 700;
`;