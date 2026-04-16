import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableComponent from "../../../components/TableComponent";
import { getAdminInventoryHistoryList } from "../../../api/adminInventory";

const movementTypeOptions = [
  { label: "입출고 구분", value: "" },
  { label: "입고", value: "INBOUND" },
  { label: "출고", value: "ORDER_OUT" },
];

const weekLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const formatCount = (value) =>
  `${Math.abs(Number(value || 0)).toLocaleString()}개`;

const formatSignedCount = (value) =>
  `${Number(value || 0) > 0 ? "+" : ""}${Number(value || 0).toLocaleString()}개`;

const buildPolylinePoints = (values, width, height, padding = 12) => {
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
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
};

const buildChartPoints = (values, width, height, padding = 12) => {
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  return values.map((value, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
    const y =
      height - padding - ((value - min) * (height - padding * 2)) / range;

    return { x, y, value };
  });
};

const formatOccurredAt = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
};

const buildDailyTrend = (rows, targetType) => {
  const today = new Date();
  const result = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const current = new Date(today);
    current.setHours(0, 0, 0, 0);
    current.setDate(today.getDate() - offset);

    const next = new Date(current);
    next.setDate(current.getDate() + 1);

    const total = rows
      .filter((row) => row.changeType === targetType)
      .filter((row) => {
        const occurredAt = new Date(row.occurredAt);
        return occurredAt >= current && occurredAt < next;
      })
      .reduce((acc, row) => acc + Math.abs(Number(row.movementQty || 0)), 0);

    result.push(total);
  }

  return result;
};

export default function InventoryHistory() {
  const nav = useNavigate();
  const chartAreaRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [movementType, setMovementType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let mounted = true;

    const fetchInventoryHistory = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await getAdminInventoryHistoryList({
          keyword: searchValue.trim() || undefined,
          change_type: movementType || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        });

        if (!mounted) return;

        const mappedRows = Array.isArray(response?.items)
          ? response.items.map((item) => ({
              id: item.id,
              productId: item.product_id,
              productCode: item.product_code,
              productName: item.product_name,
              type: item.change_type_label,
              changeType: item.change_type,
              baseStock: Number(item.qty_before ?? 0),
              movementQty: Number(item.change_qty ?? 0),
              resultStock: Number(item.qty_after ?? 0),
              date: formatOccurredAt(item.occurred_at),
              occurredAt: item.occurred_at,
              note: item.note || "-",
            }))
          : [];

        setRows(mappedRows);
      } catch (error) {
        if (!mounted) return;
        console.error("재고 변동 이력 조회 실패", error);
        setRows([]);
        setErrorMessage("재고 변동 이력을 불러오지 못했습니다.");
      } finally {
        if (mounted) {
          setLoading(false);
          setPage(1);
        }
      }
    };

    fetchInventoryHistory();

    return () => {
      mounted = false;
    };
  }, [searchValue, movementType, startDate, endDate]);

  const summary = useMemo(() => {
    const inboundRows = rows.filter((row) => row.changeType === "INBOUND");
    const outboundRows = rows.filter((row) => row.changeType === "ORDER_OUT");

    const inboundSkuCount = new Set(inboundRows.map((row) => row.productCode)).size;
    const outboundSkuCount = new Set(outboundRows.map((row) => row.productCode)).size;

    const inboundQty = inboundRows.reduce(
      (acc, row) => acc + Math.abs(row.movementQty),
      0
    );
    const outboundQty = outboundRows.reduce(
      (acc, row) => acc + Math.abs(row.movementQty),
      0
    );

    return {
      inboundSkuCount,
      outboundSkuCount,
      inboundQty,
      outboundQty,
    };
  }, [rows]);

  const inboundTrend = useMemo(() => buildDailyTrend(rows, "INBOUND"), [rows]);
  const outboundTrend = useMemo(() => buildDailyTrend(rows, "ORDER_OUT"), [rows]);

  const inboundPoints = useMemo(
    () => buildChartPoints(inboundTrend, 260, 96, 10),
    [inboundTrend]
  );
  const outboundPoints = useMemo(
    () => buildChartPoints(outboundTrend, 260, 96, 10),
    [outboundTrend]
  );

  const tooltipData =
    hoveredIndex !== null
      ? {
          label: weekLabels[hoveredIndex],
          inbound: inboundTrend[hoveredIndex] ?? 0,
          outbound: outboundTrend[hoveredIndex] ?? 0,
        }
      : null;

  const handleChartMouseMove = (e) => {
    if (!chartAreaRef.current) return;

    const rect = chartAreaRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(relativeX, rect.width));
    const sectionWidth = rect.width / weekLabels.length;
    const index = Math.min(
      weekLabels.length - 1,
      Math.max(0, Math.floor(clampedX / sectionWidth))
    );

    setHoveredIndex(index);
    setTooltipPosition({
      x: sectionWidth * index + sectionWidth / 2,
      y: 8,
    });
  };

  const handleChartMouseLeave = () => {
    setHoveredIndex(null);
  };

  const columns = [
    {
      key: "productCode",
      title: "상품코드",
      width: "100px",
      render: (value, row) => (
        <CodeLink
          type="button"
          onClick={() =>
            nav(`/admin/product-update/${row.productCode}`, {
              state: { product: row },
            })
          }
        >
          {value}
        </CodeLink>
      ),
    },
    {
      key: "type",
      title: "구분",
      width: "90px",
      sortable: false,
      align: "center",
      render: (value) => <TypeBadge $type={value}>{value}</TypeBadge>,
    },
    {
      key: "productName",
      title: "상품명",
      width: "260px",
      render: (value, row) => (
        <ProductNameLink
          href={`/product-detail?productCode=${row.productCode}`}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </ProductNameLink>
      ),
    },
    {
      key: "baseStock",
      title: "기준재고",
      width: "110px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "movementQty",
      title: "입출고수량",
      width: "120px",
      sortType: "number",
      render: (value) => (
        <QuantityText $positive={value > 0}>
          {formatSignedCount(value)}
        </QuantityText>
      ),
    },
    {
      key: "resultStock",
      title: "반영재고",
      width: "110px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "date",
      title: "일자",
      width: "140px",
      sortValue: (row) => row.occurredAt,
      render: (value) => <SubText>{value}</SubText>,
    },
    {
      key: "note",
      title: "비고",
      width: "220px",
      sortable: false,
      render: (value) => <SubText>{value}</SubText>,
    },
  ];

  return (
    <PageWrap>
      <HeaderRow>
        <Title>입출고 이력 조회</Title>
      </HeaderRow>

      <SummaryGrid>
        <StatCard>
          <CardTitle>입고</CardTitle>
          <BigLine>
            <BigNumber>{summary.inboundSkuCount}</BigNumber>
            <Unit>SKU</Unit>
            <Slash>/</Slash>
            <SubNumber>{summary.inboundQty.toLocaleString()}개</SubNumber>
          </BigLine>
          <ChangeRow $up>
            최근 조회 기준 입고 합계 <span>실데이터 반영</span>
          </ChangeRow>
        </StatCard>

        <StatCard>
          <CardTitle>출고</CardTitle>
          <BigLine>
            <BigNumber>{summary.outboundSkuCount}</BigNumber>
            <Unit>SKU</Unit>
            <Slash>/</Slash>
            <SubNumber>{summary.outboundQty.toLocaleString()}개</SubNumber>
          </BigLine>
          <ChangeRow $up={false}>
            최근 조회 기준 출고 합계 <span>실데이터 반영</span>
          </ChangeRow>
        </StatCard>

        <TrendCard>
          <TrendHeader>입출고 추이</TrendHeader>

          <TrendInner>
            <LegendArea>
              <LegendItem>
                <LegendDot $color="#2563eb" />
                입고
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#ef4444" />
                출고
              </LegendItem>
            </LegendArea>

            <ChartArea
              ref={chartAreaRef}
              onMouseMove={handleChartMouseMove}
              onMouseLeave={handleChartMouseLeave}
            >
              {tooltipData ? (
                <ChartTooltip
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                  }}
                >
                  <TooltipTitle>{tooltipData.label}</TooltipTitle>
                  <TooltipRow>
                    <TooltipLabel>
                      <LegendDot $color="#2563eb" />
                      입고
                    </TooltipLabel>
                    <TooltipValue>{tooltipData.inbound.toLocaleString()}개</TooltipValue>
                  </TooltipRow>
                  <TooltipRow>
                    <TooltipLabel>
                      <LegendDot $color="#ef4444" />
                      출고
                    </TooltipLabel>
                    <TooltipValue>{tooltipData.outbound.toLocaleString()}개</TooltipValue>
                  </TooltipRow>
                </ChartTooltip>
              ) : null}

              <TrendSvg viewBox="0 0 260 96" preserveAspectRatio="none">
                {hoveredIndex !== null ? (
                  <HoverGuide
                    x1={inboundPoints[hoveredIndex]?.x ?? 0}
                    x2={inboundPoints[hoveredIndex]?.x ?? 0}
                    y1="0"
                    y2="96"
                  />
                ) : null}

                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildPolylinePoints(inboundTrend, 260, 96, 10)}
                />
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildPolylinePoints(outboundTrend, 260, 96, 10)}
                />

                {inboundPoints.map((point, index) => (
                  <circle
                    key={`inbound-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={hoveredIndex === index ? 4.5 : 0}
                    fill="#2563eb"
                  />
                ))}

                {outboundPoints.map((point, index) => (
                  <circle
                    key={`outbound-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={hoveredIndex === index ? 4.5 : 0}
                    fill="#ef4444"
                  />
                ))}
              </TrendSvg>

              <XAxis>
                {weekLabels.map((label, index) => (
                  <XAxisLabel
                    key={label}
                    $active={hoveredIndex === index}
                  >
                    {label}
                  </XAxisLabel>
                ))}
              </XAxis>
            </ChartArea>
          </TrendInner>
        </TrendCard>
      </SummaryGrid>

      {errorMessage ? <ErrorText>{errorMessage}</ErrorText> : null}

      <TableComponent
        columns={columns}
        data={rows}
        headerAlign="center"
        cellAlign="center"
        rowKey="id"
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        customToolbar={
          <CustomToolbar>
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

            <KeywordInput
              type="text"
              placeholder="상품명, 상품코드, 비고로 검색"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <FilterSelect
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
            >
              {movementTypeOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </CustomToolbar>
        }
      />

      {loading ? <LoadingText>불러오는 중...</LoadingText> : null}
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
`;

const SummaryGrid = styled.div`
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.3fr;
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #edf0f4;
  border-radius: 20px;
  padding: 20px 22px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
`;

const CardTitle = styled.p`
  margin: 0 0 14px;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
`;

const BigLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const BigNumber = styled.span`
  color: #111827;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
`;

const Unit = styled.span`
  color: #111827;
  font-size: 16px;
  font-weight: 700;
`;

const Slash = styled.span`
  color: #d1d5db;
  font-size: 18px;
  font-weight: 700;
`;

const SubNumber = styled.span`
  color: #4b5563;
  font-size: 16px;
  font-weight: 700;
`;

const ChangeRow = styled.div`
  margin-top: 18px;
  color: ${({ $up }) => ($up ? "#2563eb" : "#ef4444")};
  font-size: 13px;
  font-weight: 700;

  span {
    margin-left: 6px;
    color: #9ca3af;
    font-weight: 500;
  }
`;

const TrendCard = styled(StatCard)`
  min-height: 180px;
`;

const TrendHeader = styled.div`
  margin-bottom: 14px;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
`;

const TrendInner = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: stretch;
`;

const LegendArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const ChartArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TrendSvg = styled.svg`
  width: 100%;
  height: 96px;
  overflow: visible;
`;

const HoverGuide = styled.line`
  stroke: #cbd5e1;
  stroke-width: 1;
  stroke-dasharray: 4 4;
`;

const ChartTooltip = styled.div`
  position: absolute;
  z-index: 5;
  transform: translate(-50%, -100%);
  min-width: 120px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.94);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
  pointer-events: none;
`;

const TooltipTitle = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  & + & {
    margin-top: 6px;
  }
`;

const TooltipLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const TooltipValue = styled.div`
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

const XAxis = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 8px;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
`;

const XAxisLabel = styled.span`
  color: ${({ $active }) => ($active ? "#111827" : "#9ca3af")};
  font-weight: ${({ $active }) => ($active ? 800 : 700)};
`;

const CustomToolbar = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const DateInput = styled.input`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  outline: none;
`;

const DateDivider = styled.span`
  color: #9ca3af;
  font-size: 14px;
  font-weight: 700;
`;

const KeywordInput = styled.input`
  flex: 1 1 280px;
  min-width: 220px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  outline: none;
`;

const FilterSelect = styled.select`
  min-width: 140px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  outline: none;
`;

const CodeLink = styled.button`
  border: 0;
  padding: 0;
  background: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const ProductNameLink = styled.a`
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 58px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $type }) => {
    if ($type === "입고") return "#1d4ed8";
    if ($type === "출고") return "#b91c1c";
    return "#92400e";
  }};
  background: ${({ $type }) => {
    if ($type === "입고") return "#dbeafe";
    if ($type === "출고") return "#fee2e2";
    return "#fef3c7";
  }};
`;

const QuantityText = styled.span`
  color: ${({ $positive }) => ($positive ? "#2563eb" : "#ef4444")};
  font-size: 13px;
  font-weight: 700;
`;

const SubText = styled.span`
  color: #6b7280;
  font-size: 13px;
`;

const ErrorText = styled.div`
  margin-bottom: 12px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
`;

const LoadingText = styled.div`
  margin-top: 12px;
  color: #6b7280;
  font-size: 13px;
`;