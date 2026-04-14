import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableComponent from "../../../components/TableComponent";

const historyData = [
  {
    id: 1,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "9744302255",
    productName: "농심 신라면건면 114g, 1개",
    baseStock: 1000,
    movementQty: 500,
    resultStock: 1500,
    note: "-",
  },
  {
    id: 2,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "12279799725",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    baseStock: 230,
    movementQty: -30,
    resultStock: 200,
    note: "-",
  },
  {
    id: 3,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "12279799725",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    baseStock: 230,
    movementQty: -30,
    resultStock: 200,
    note: "-",
  },
  {
    id: 4,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "12279799725",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    baseStock: 230,
    movementQty: -30,
    resultStock: 200,
    note: "-",
  },
  {
    id: 5,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "12279799725",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    baseStock: 230,
    movementQty: -30,
    resultStock: 200,
    note: "-",
  },
  {
    id: 6,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "12279799725",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    baseStock: 230,
    movementQty: -30,
    resultStock: 200,
    note: "-",
  },
  {
    id: 7,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "9744302255",
    productName: "농심 신라면건면 114g, 1개",
    baseStock: 1000,
    movementQty: 500,
    resultStock: 1500,
    note: "-",
  },
  {
    id: 8,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "9744302255",
    productName: "농심 신라면건면 114g, 1개",
    baseStock: 1000,
    movementQty: 500,
    resultStock: 1500,
    note: "-",
  },
  {
    id: 9,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "9744302255",
    productName: "농심 신라면건면 114g, 1개",
    baseStock: 1000,
    movementQty: 500,
    resultStock: 1500,
    note: "-",
  },
  {
    id: 10,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "9744302255",
    productName: "농심 신라면건면 114g, 1개",
    baseStock: 1000,
    movementQty: 500,
    resultStock: 1500,
    note: "-",
  },
  {
    id: 11,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    baseStock: 120,
    movementQty: 456,
    resultStock: 576,
    note: "긴급 입고",
  },
  {
    id: 12,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "5909188198",
    productName: "코카콜라 콜라 1.5L, 12개",
    baseStock: 800,
    movementQty: 3000,
    resultStock: 3800,
    note: "-",
  },
  {
    id: 13,
    date: "26/04/07 09:07",
    type: "입고",
    productCode: "57954282217",
    productName: "롯데 맛있는 비엔나 소시지 1kg, 1개",
    baseStock: 600,
    movementQty: 2000,
    resultStock: 2600,
    note: "-",
  },
  {
    id: 14,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "5909188198",
    productName: "코카콜라 콜라 1.5L, 12개",
    baseStock: 900,
    movementQty: -1200,
    resultStock: -300,
    note: "대량 출고",
  },
  {
    id: 15,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    baseStock: 700,
    movementQty: -1500,
    resultStock: -800,
    note: "-",
  },
  {
    id: 16,
    date: "26/04/07 09:07",
    type: "출고",
    productCode: "57954282217",
    productName: "롯데 맛있는 비엔나 소시지 1kg, 1개",
    baseStock: 1000,
    movementQty: -240,
    resultStock: 760,
    note: "-",
  },
];

const movementTypeOptions = [
  { label: "입출고 구분", value: "" },
  { label: "입고", value: "입고" },
  { label: "출고", value: "출고" },
];

const weekLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const inboundTrend = [48, 90, 82, 84, 86, 70, 78];
const outboundTrend = [24, 42, 43, 48, 60, 74, 70];

const formatCount = (value) => `${Math.abs(Number(value)).toLocaleString()}개`;

const formatSignedCount = (value) =>
  `${value > 0 ? "+" : ""}${Number(value).toLocaleString()}개`;

const buildPolylinePoints = (values, width, height, padding = 12) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y =
        height -
        padding -
        ((value - min) * (height - padding * 2)) / range;
      return `${x},${y}`;
    })
    .join(" ");
};

export default function InventoryHistory() {
  const nav = useNavigate();

  const [rows] = useState(historyData);
  const [searchValue, setSearchValue] = useState("");
  const [movementType, setMovementType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const summary = useMemo(() => {
    const inboundRows = rows.filter((row) => row.type === "입고");
    const outboundRows = rows.filter((row) => row.type === "출고");

    const inboundSkuCount = new Set(inboundRows.map((row) => row.productCode)).size;
    const outboundSkuCount = new Set(outboundRows.map((row) => row.productCode)).size;

    const inboundQty = inboundRows.reduce(
      (acc, row) => acc + Math.abs(row.movementQty),
      0,
    );
    const outboundQty = outboundRows.reduce(
      (acc, row) => acc + Math.abs(row.movementQty),
      0,
    );

    return {
      inboundSkuCount,
      outboundSkuCount,
      inboundQty,
      outboundQty,
    };
  }, [rows]);

  const filteredData = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return rows.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.productName.toLowerCase().includes(keyword) ||
        item.productCode.toLowerCase().includes(keyword);

      const matchType = movementType ? item.type === movementType : true;

      const normalizedDate = `20${item.date.slice(0, 8).replace(/\//g, "-")}`;

      const matchStartDate = startDate ? normalizedDate >= startDate : true;
      const matchEndDate = endDate ? normalizedDate <= endDate : true;

      return matchKeyword && matchType && matchStartDate && matchEndDate;
    });
  }, [rows, searchValue, movementType, startDate, endDate]);

  const columns = [
    {
      key: "date",
      title: "일자",
      width: "140px",
      sortType: "date",
      render: (value) => <SubText>{value}</SubText>,
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
      key: "productCode",
      title: "상품코드",
      width: "130px",
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
        <QuantityText $positive={value > 0}>{formatSignedCount(value)}</QuantityText>
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
      key: "note",
      title: "비고",
      width: "100px",
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
      ↑ 6 SKU / 2,000개 <span>vs Yesterday</span>
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
      ↓ 4 SKU / 3,000개 <span>vs Yesterday</span>
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

      <ChartArea>
        <TrendSvg viewBox="0 0 260 96" preserveAspectRatio="none">
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
        </TrendSvg>

        <XAxis>
          {weekLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </XAxis>
      </ChartArea>
    </TrendInner>
  </TrendCard>
</SummaryGrid>

      <TableComponent
        variant="inventory"
        columns={columns}
        data={filteredData}
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
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />

            <DateDivider>~</DateDivider>

            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />

            <KeywordInput
              type="text"
              placeholder="상품명, 상품코드로 검색"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setPage(1);
              }}
            />

            <FilterSelect
              value={movementType}
              onChange={(e) => {
                setMovementType(e.target.value);
                setPage(1);
              }}
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
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 24px;
  background: #f5f7fb;
  min-height: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  margin-top: 5px;
`;

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
`;

const SummaryGrid = styled.div`
  margin-bottom: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.42fr;
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const CardBase = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 14px 14px;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.02),
    0 8px 20px rgba(31, 41, 55, 0.04);
  min-height: 104px;
  box-sizing: border-box;
`;

const StatCard = styled(CardBase)``;

const TrendCard = styled(CardBase)`
  padding-bottom: 18px;
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #2f3645;
  margin-bottom: 8px;
`;

const BigLine = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-height: 38px;
`;

const BigNumber = styled.div`
  font-size: 38px;
  line-height: 1;
  font-weight: 800;
  color: #1f2937;
`;

const Unit = styled.div`
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const Slash = styled.div`
  font-size: 20px;
  line-height: 1;
  color: #9ca3af;
  margin: 0 1px 3px;
`;

const SubNumber = styled.div`
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ChangeRow = styled.div`
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
  color: ${({ $up }) => ($up ? "#22c55e" : "#ef4444")};

  span {
    color: #9ca3af;
    font-weight: 600;
    margin-left: 4px;
  }
`;

const TrendHeader = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #2f3645;
  margin-bottom: 8px;
`;

const TrendInner = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 6px;
  align-items: stretch;
  height: 100%;
`;

const LegendArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 6px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
`;

const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2px;
  min-height: 0;
`;

const TrendSvg = styled.svg`
  width: 100%;
  height: 72px;
  display: block;
`;

const XAxis = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-top: -2px;

  span {
    font-size: 10px;
    color: #9ca3af;
    text-align: center;
    font-weight: 600;
    line-height: 1;
  }
`;

const CustomToolbar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const DateInput = styled.input`
  height: 44px;
  min-width: 124px;
  padding: 0 12px;
  border: 1px solid #e6eaf2;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #c9d6ff;
  }
`;

const DateDivider = styled.span`
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
`;

const KeywordInput = styled.input`
  height: 44px;
  min-width: 260px;
  padding: 0 12px;
  border: 1px solid #e6eaf2;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #c9d6ff;
  }
`;

const FilterSelect = styled.select`
  height: 44px;
  min-width: 126px;
  padding: 0 14px;
  border: 1px solid #e6eaf2;
  border-radius: 10px;
  background: #ffffff;
  color: #7b8494;
  font-size: 13px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #c9d6ff;
  }
`;

const SubText = styled.span`
  color: #4b5563;
  font-size: 13px;
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
  background: ${({ $type }) => ($type === "입고" ? "#dbeafe" : "#fee2e2")};
  color: ${({ $type }) => ($type === "입고" ? "#2563eb" : "#ef4444")};
`;

const QuantityText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? "#2563eb" : "#ef4444")};
`;

const CodeLink = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  font-weight: 800;
  color: inherit;
  cursor: pointer;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ProductNameLink = styled.a`
  color: inherit;
  font: inherit;
  text-decoration: none;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;