import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableComponent from "../../../components/TableComponent";

const inventoryData = [
  {
    id: 1,
    productCode: "9744302255",
    productName: "농심 신라면건면 114g, 1개",
    totalStock: 11111,
    availableStock: 11000,
    badStock: 11,
    scheduledWork: 100,
    safetyStock: 500,
    inventoryStatus: "안전재고",
    purchasePrice: 900,
    assetAmount: 9999900,
    salesStatus: "판매중",
    category: "라면",
  },
  {
    id: 2,
    productCode: "12279799725",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    totalStock: 500,
    availableStock: 450,
    badStock: 10,
    scheduledWork: 40,
    safetyStock: 200,
    inventoryStatus: "안전재고",
    purchasePrice: 3300,
    assetAmount: 1650000,
    salesStatus: "판매중",
    category: "과자",
  },
  {
    id: 3,
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    totalStock: 2,
    availableStock: 0,
    badStock: 2,
    scheduledWork: 0,
    safetyStock: 300,
    inventoryStatus: "일시품절",
    purchasePrice: 18000,
    assetAmount: 0,
    salesStatus: "일시품절",
    category: "국/탕/찌개",
  },
  {
    id: 4,
    productCode: "5909188198",
    productName: "코카콜라 콜라 1.5L, 12개",
    totalStock: 500,
    availableStock: 800,
    badStock: 800,
    scheduledWork: 800,
    safetyStock: 800,
    inventoryStatus: "발주권고",
    purchasePrice: 30000,
    assetAmount: 24000000,
    salesStatus: "판매중",
    category: "음료",
  },
  {
    id: 5,
    productCode: "57954282217",
    productName: "롯데 맛있는 비엔나 소시지 1kg, 1개",
    totalStock: 10000,
    availableStock: 200,
    badStock: 200,
    scheduledWork: 200,
    safetyStock: 200,
    inventoryStatus: "악성재고",
    purchasePrice: 7500,
    assetAmount: 75000000,
    salesStatus: "판매중",
    category: "냉장식품",
  },
  {
    id: 6,
    productCode: "6156192013",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    totalStock: 0,
    availableStock: 0,
    badStock: 0,
    scheduledWork: 50,
    safetyStock: 300,
    inventoryStatus: "일시품절",
    purchasePrice: 18000,
    assetAmount: 0,
    salesStatus: "일시품절",
    category: "국/탕/찌개",
  },
  {
    id: 7,
    productCode: "6156192014",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    totalStock: 3,
    availableStock: 0,
    badStock: 3,
    scheduledWork: 0,
    safetyStock: 300,
    inventoryStatus: "일시품절",
    purchasePrice: 18000,
    assetAmount: 0,
    salesStatus: "일시품절",
    category: "국/탕/찌개",
  },
  {
    id: 8,
    productCode: "12279799726",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    totalStock: 500,
    availableStock: 450,
    badStock: 10,
    scheduledWork: 40,
    safetyStock: 200,
    inventoryStatus: "안전재고",
    purchasePrice: 3300,
    assetAmount: 1650000,
    salesStatus: "판매중지",
    category: "과자",
  },
  {
    id: 9,
    productCode: "12279799727",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    totalStock: 500,
    availableStock: 450,
    badStock: 10,
    scheduledWork: 40,
    safetyStock: 200,
    inventoryStatus: "안전재고",
    purchasePrice: 3300,
    assetAmount: 1650000,
    salesStatus: "판매종료",
    category: "과자",
  },
  {
    id: 10,
    productCode: "12279799728",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    totalStock: 500,
    availableStock: 450,
    badStock: 10,
    scheduledWork: 40,
    safetyStock: 200,
    inventoryStatus: "안전재고",
    purchasePrice: 3300,
    assetAmount: 1650000,
    salesStatus: "판매중",
    category: "과자",
  },
];

const inventoryStatusOptions = [
  "안전재고",
  "발주권고",
  "일시품절",
  "악성재고",
];

const salesStatusOptions = [
  "판매중",
  "판매중지",
  "일시품절",
  "판매종료",
];

const salesStatusList = ["판매중", "판매중지", "일시품절", "판매종료"];

const categoryOptions = [
  ...new Set(inventoryData.map((item) => item.category)),
].map((value) => ({
  label: value,
  value,
}));

const formatNumber = (value) => `${Number(value).toLocaleString()}원`;
const formatCount = (value) => `${Number(value).toLocaleString()}개`;

export default function LiveInventory() {
  const nav = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [inventoryValue, setInventoryValue] = useState("");
  const [salesValue, setSalesValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState(inventoryData);

  const handleSalesStatusChange = (id, value) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, salesStatus: value } : item,
      ),
    );
  };

  const summary = useMemo(() => {
    return {
      totalCount: rows.length,
      salesSummary: {
        판매중: rows.filter((item) => item.salesStatus === "판매중").length,
        판매중지: rows.filter((item) => item.salesStatus === "판매중지").length,
        일시품절: rows.filter((item) => item.salesStatus === "일시품절").length,
        판매종료: rows.filter((item) => item.salesStatus === "판매종료").length,
      },
      inventorySummary: {
        안전재고: rows.filter((item) => item.inventoryStatus === "안전재고").length,
        발주권고: rows.filter((item) => item.inventoryStatus === "발주권고").length,
        일시품절: rows.filter((item) => item.inventoryStatus === "일시품절").length,
        악성재고: rows.filter((item) => item.inventoryStatus === "악성재고").length,
      },
      warningItems: rows
        .filter((item) => item.inventoryStatus === "발주권고")
        .slice(0, 3),
    };
  }, [rows]);

  const filteredData = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return rows.filter((item) => {
      const matchKeyword =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.productCode.toLowerCase().includes(q);

      const matchCategory = categoryValue ? item.category === categoryValue : true;
      const matchInventory = inventoryValue
        ? item.inventoryStatus === inventoryValue
        : true;
      const matchSales = salesValue ? item.salesStatus === salesValue : true;

      return matchKeyword && matchCategory && matchInventory && matchSales;
    });
  }, [rows, keyword, categoryValue, inventoryValue, salesValue]);

  const columns = [
    {
      key: "productCode",
      title: "상품코드",
      width: "120px",
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
      width: "250px",
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
      key: "totalStock",
      title: "총재고",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "availableStock",
      title: "가용재고",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "badStock",
      title: "불용재고",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "scheduledWork",
      title: "작업예정",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "safetyStock",
      title: "안전재고",
      width: "100px",
      sortType: "number",
      render: (value) => formatCount(value),
    },
    {
      key: "inventoryStatus",
      title: "재고상태",
      width: "110px",
      sortable: false,
      render: (value) => (
        <InventoryStatusBadge $type={value}>{value}</InventoryStatusBadge>
      ),
    },
    {
      key: "purchasePrice",
      title: "재고원가",
      width: "110px",
      sortType: "number",
      render: (value) => formatNumber(value),
    },
    {
      key: "assetAmount",
      title: "재고자산액",
      width: "120px",
      sortType: "number",
      render: (value) => formatNumber(value),
    },
    {
      key: "salesStatus",
      title: "판매상태",
      width: "120px",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <SalesStatusSelect
            $type={value}
            value={value}
            onChange={(e) => handleSalesStatusChange(row.id, e.target.value)}
          >
            {salesStatusList.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SalesStatusSelect>
        </CenterCell>
      ),
    },
  ];

  return (
    <Page>
      <Content>
        <TopBar>
          <PageTitle>실시간 재고 현황</PageTitle>
        </TopBar>

        <CardGrid>
          <SummaryCardBox>
            <CardTitle>전체 재고 수</CardTitle>
            <BigValueRow>
              <BigValue>{summary.totalCount}</BigValue>
              <BigSuffix>SKU</BigSuffix>
            </BigValueRow>
            <GrowthText>↑ 6개 vs Yesterday</GrowthText>
          </SummaryCardBox>

          <SummaryCardBox>
            <CardTitle>판매 상태별</CardTitle>
            <StatusList>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="green" />
                  판매중
                </StatusLabel>
                <StatusValue>{summary.salesSummary["판매중"]} SKU</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="yellow" />
                  판매중지
                </StatusLabel>
                <StatusValue>{summary.salesSummary["판매중지"]} SKU</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="pink" />
                  일시품절
                </StatusLabel>
                <StatusValue>{summary.salesSummary["일시품절"]} SKU</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="indigo" />
                  판매종료
                </StatusLabel>
                <StatusValue>{summary.salesSummary["판매종료"]} SKU</StatusValue>
              </StatusRow>
            </StatusList>
          </SummaryCardBox>

          <SummaryCardBox>
            <CardTitle>재고 상태별</CardTitle>
            <StatusList>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="green" />
                  안전재고
                </StatusLabel>
                <StatusValue>{summary.inventorySummary["안전재고"]} SKU</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="yellow" />
                  발주권고
                </StatusLabel>
                <StatusValue>{summary.inventorySummary["발주권고"]} SKU</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="pink" />
                  일시품절
                </StatusLabel>
                <StatusValue>{summary.inventorySummary["일시품절"]} SKU</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>
                  <Dot $color="red" />
                  악성재고
                </StatusLabel>
                <StatusValue>{summary.inventorySummary["악성재고"]} SKU</StatusValue>
              </StatusRow>
            </StatusList>
          </SummaryCardBox>

          <SummaryCardBox>
            <CardHeaderRow>
              <CardTitle>발주 권고</CardTitle>
              <CardRightValue>{summary.inventorySummary["발주권고"]} SKU</CardRightValue>
            </CardHeaderRow>

            <WarningHeader>
              <span>재고 부족 예상</span>
              <span>현재고</span>
            </WarningHeader>

            <WarningList>
              {summary.warningItems.length > 0 ? (
                summary.warningItems.map((row) => (
                  <WarningItem key={row.id}>
                    <WarningName>{row.productName}</WarningName>
                    <WarningStock>{formatCount(row.availableStock)}</WarningStock>
                  </WarningItem>
                ))
              ) : (
                <WarningEmpty>발주 권고 대상이 없습니다.</WarningEmpty>
              )}
            </WarningList>
          </SummaryCardBox>
        </CardGrid>

        <TableComponent
          variant="inventory"
          columns={columns}
          data={filteredData}
          rowKey="id"
          searchValue={keyword}
          onSearchChange={(value) => {
            setKeyword(value);
            setPage(1);
          }}
          searchPlaceholder="상품명, 상품코드로 검색"
          filterValue={categoryValue}
          onFilterChange={(value) => {
            setCategoryValue(value);
            setPage(1);
          }}
          filterPlaceholder="카테고리"
          filterOptions={categoryOptions}
          extraToolbar={
            <FilterGroup>
              <ToolbarSelect
                value={inventoryValue}
                onChange={(e) => {
                  setInventoryValue(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">재고상태별</option>
                {inventoryStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </ToolbarSelect>

              <ToolbarSelect
                value={salesValue}
                onChange={(e) => {
                  setSalesValue(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">판매상태별</option>
                {salesStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </ToolbarSelect>
            </FilterGroup>
          }
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Content>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  color: #2d3648;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
`;

const Content = styled.main`
  padding: 26px 26px 30px;
  min-width: 0;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #2c3445;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1.1fr 1fr;
  gap: 18px;
  margin-bottom: 22px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, minmax(260px, 1fr));
  }

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCardBox = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 18px;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.02),
    0 8px 20px rgba(31, 41, 55, 0.04);
  min-height: 168px;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #323a49;
  margin-bottom: 16px;
`;

const BigValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
`;

const BigValue = styled.div`
  font-size: 48px;
  line-height: 1;
  font-weight: 800;
  color: #1f2937;
`;

const BigSuffix = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
`;

const GrowthText = styled.div`
  font-size: 14px;
  color: #48bb78;
  font-weight: 600;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #2f3645;
  font-weight: 600;
`;

const StatusValue = styled.div`
  font-size: 14px;
  color: #1f2937;
  font-weight: 700;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background: ${({ $color }) => {
    if ($color === "green") return "#3ecf78";
    if ($color === "yellow") return "#f6b800";
    if ($color === "pink") return "#cc35ff";
    if ($color === "indigo") return "#4338ca";
    if ($color === "red") return "#ff5f5f";
    return "#cbd5e1";
  }};
`;

const CardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardRightValue = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
`;

const WarningHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #7b8494;
  margin-bottom: 10px;
`;

const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const WarningItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
`;

const WarningName = styled.div`
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WarningStock = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #374151;
`;

const WarningEmpty = styled.div`
  font-size: 14px;
  color: #98a2b3;
  padding-top: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const ToolbarSelect = styled.select`
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

const CenterCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InventoryStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 800;
  background: ${({ $type }) => {
    if ($type === "안전재고") return "#dcf6e7";
    if ($type === "발주권고") return "#fff2bf";
    if ($type === "일시품절") return "#f4d5ff";
    if ($type === "악성재고") return "#ffd9d9";
    return "#eef2f7";
  }};
  color: ${({ $type }) => {
    if ($type === "안전재고") return "#1ea95f";
    if ($type === "발주권고") return "#f1a600";
    if ($type === "일시품절") return "#c02bf4";
    if ($type === "악성재고") return "#ff5a5a";
    return "#667085";
  }};
`;

const SalesStatusSelect = styled.select`
  height: 32px;
  min-width: 96px;
  border: 0;
  border-radius: 7px;
  padding: 0 30px 0 10px;
  font-size: 12px;
  font-weight: 800;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-color: ${({ $type }) => {
    if ($type === "판매중") return "#dcf6e7";
    if ($type === "일시품절") return "#f4d5ff";
    if ($type === "판매중지") return "#fff2bf";
    if ($type === "판매종료") return "#e5e7eb";
    return "#eef2f7";
  }};

  color: ${({ $type }) => {
    if ($type === "판매중") return "#1ea95f";
    if ($type === "일시품절") return "#c02bf4";
    if ($type === "판매중지") return "#f1a600";
    if ($type === "판매종료") return "#6b7280";
    return "#667085";
  }};

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
  }
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