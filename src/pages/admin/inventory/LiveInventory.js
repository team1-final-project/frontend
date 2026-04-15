import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableComponent from "../../../components/TableComponent";
import {
  getAdminLiveInventoryList,
  patchAdminLiveInventoryRow,
} from "../../../api/adminInventory";

const inventoryStatusOptions = ["안전재고", "발주권고", "일시품절"];
const salesStatusOptions = ["판매중", "판매중지", "품절", "판매종료", "판매예정"];

const salesStatusList = [
  { value: "ON_SALE", label: "판매중" },
  { value: "STOPPED", label: "판매중지" },
  { value: "SOLD_OUT", label: "품절" },
  { value: "ENDED", label: "판매종료" },
  { value: "READY", label: "판매예정" },
];

const saleStatusLabelMap = {
  ON_SALE: "판매중",
  STOPPED: "판매중지",
  SOLD_OUT: "품절",
  ENDED: "판매종료",
  READY: "판매예정",
};

const formatNumber = (value) => `${Number(value || 0).toLocaleString()}원`;
const formatCount = (value) => `${Number(value || 0).toLocaleString()}개`;

const mapInventoryRow = (item) => ({
  id: item.id,
  productCode: item.product_code,
  productName: item.product_name ?? "-",
  totalStock: Number(item.total_stock ?? 0),
  availableStock: Number(item.available_stock ?? 0),
  safetyStock: Number(item.safety_stock_qty ?? 0),
  inventoryStatus: item.inventory_status ?? "안전재고",
  purchasePrice: Number(item.purchase_price ?? 0),
  assetAmount: Number(item.asset_amount ?? 0),
  salesStatusCode: item.sale_status ?? "ON_SALE",
  salesStatus: saleStatusLabelMap[item.sale_status] ?? item.sale_status ?? "-",
  category: item.category ?? "-",
});

export default function LiveInventory() {
  const nav = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [inventoryValue, setInventoryValue] = useState("");
  const [salesValue, setSalesValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  const fetchRows = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getAdminLiveInventoryList();
      const items = Array.isArray(response) ? response : response?.items ?? [];
      setRows(items.map(mapInventoryRow));
    } catch (error) {
      console.error(error);
      setRows([]);
      setErrorMessage(
        error?.response?.data?.detail ||
          "실시간 재고 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const categoryOptions = useMemo(() => {
    return [...new Set(rows.map((item) => item.category).filter(Boolean))].map(
      (value) => ({
        label: value,
        value,
      }),
    );
  }, [rows]);

  const handleSalesStatusChange = async (productCode, nextStatusCode) => {
    const actionKey = `${productCode}:status`;
    const previousRows = rows;

    try {
      setPendingActionKey(actionKey);
      setRows((prev) =>
        prev.map((item) =>
          item.productCode === productCode
            ? {
                ...item,
                salesStatusCode: nextStatusCode,
                salesStatus:
                  saleStatusLabelMap[nextStatusCode] ?? nextStatusCode,
              }
            : item,
        ),
      );

      await patchAdminLiveInventoryRow(productCode, {
        sale_status: nextStatusCode,
      });
    } catch (error) {
      console.error(error);
      setRows(previousRows);
      alert(
        error?.response?.data?.detail || "판매상태 변경에 실패했습니다.",
      );
    } finally {
      setPendingActionKey("");
    }
  };

  const summary = useMemo(() => {
    return {
      totalCount: rows.length,
      salesSummary: {
        판매중: rows.filter((item) => item.salesStatus === "판매중").length,
        판매중지: rows.filter((item) => item.salesStatus === "판매중지").length,
        품절: rows.filter((item) => item.salesStatus === "품절").length,
        판매종료: rows.filter((item) => item.salesStatus === "판매종료").length,
      },
      inventorySummary: {
        안전재고: rows.filter((item) => item.inventoryStatus === "안전재고")
          .length,
        발주권고: rows.filter((item) => item.inventoryStatus === "발주권고")
          .length,
        일시품절: rows.filter((item) => item.inventoryStatus === "일시품절")
          .length,
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

      const matchCategory = categoryValue
        ? item.category === categoryValue
        : true;
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
            value={row.salesStatusCode}
            disabled={pendingActionKey === `${row.productCode}:status`}
            onChange={(e) =>
              handleSalesStatusChange(row.productCode, e.target.value)
            }
          >
            {salesStatusList.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </SalesStatusSelect>
        </CenterCell>
      ),
    },
  ];

  return (
    <PageWrap>
      <HeaderRow>
        <Title>실시간 재고 현황</Title>
      </HeaderRow>

      {isLoading && (
        <PageStatusText>실시간 재고 목록을 불러오는 중입니다.</PageStatusText>
      )}
      {!isLoading && errorMessage && (
        <PageStatusText $error>{errorMessage}</PageStatusText>
      )}

      <SummaryGrid>
        <SummaryCardBox>
          <CardTitle>전체 재고 수</CardTitle>
          <CardValueWrap>
            <CardValue>{summary.totalCount}개</CardValue>
          </CardValueWrap>
          <CardMeta>실시간 조회 기준</CardMeta>
        </SummaryCardBox>

        <SummaryCardBox>
          <CardTitle>판매 상태별</CardTitle>
          <SummaryList>
            <SummaryRow>
              <SummaryLabel>
                <Dot $color="green" />
                판매중
              </SummaryLabel>
              <SummaryValue>{summary.salesSummary["판매중"]} SKU</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>
                <Dot $color="yellow" />
                판매중지
              </SummaryLabel>
              <SummaryValue>{summary.salesSummary["판매중지"]} SKU</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>
                <Dot $color="pink" />
                품절
              </SummaryLabel>
              <SummaryValue>{summary.salesSummary["품절"]} SKU</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>
                <Dot $color="indigo" />
                판매종료
              </SummaryLabel>
              <SummaryValue>{summary.salesSummary["판매종료"]} SKU</SummaryValue>
            </SummaryRow>
          </SummaryList>
        </SummaryCardBox>

        <SummaryCardBox>
          <CardTitle>재고 상태별</CardTitle>
          <SummaryList>
            <SummaryRow>
              <SummaryLabel>
                <Dot $color="green" />
                안전재고
              </SummaryLabel>
              <SummaryValue>{summary.inventorySummary["안전재고"]} SKU</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>
                <Dot $color="yellow" />
                발주권고
              </SummaryLabel>
              <SummaryValue>{summary.inventorySummary["발주권고"]} SKU</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>
                <Dot $color="pink" />
                일시품절
              </SummaryLabel>
              <SummaryValue>{summary.inventorySummary["일시품절"]} SKU</SummaryValue>
            </SummaryRow>
          </SummaryList>
        </SummaryCardBox>

        <SummaryCardBox>
          <CardHeaderRow>
            <CardTitle>발주 권고</CardTitle>
            <CardRightValue>
              {summary.inventorySummary["발주권고"]} SKU
            </CardRightValue>
          </CardHeaderRow>

          <WarningHeader>
            <span>재고 부족 예상</span>
            <span>현 재고</span>
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
      </SummaryGrid>

      <TableComponent
        variant="inventory"
        columns={columns}
        data={filteredData}
        headerAlign="center"
        cellAlign="center"
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

const PageStatusText = styled.div`
  margin-bottom: 14px;
  color: ${({ $error }) => ($error ? "#dc2626" : "#475569")};
  font-size: 13px;
  font-weight: 600;
`;

const SummaryGrid = styled.div`
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCardBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  min-height: 118px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
  box-sizing: border-box;
`;

const CardTitle = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 700;
`;

const CardValueWrap = styled.div`
  margin-top: 14px;
`;

const CardValue = styled.div`
  color: #111827;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
`;

const CardMeta = styled.div`
  margin-top: 10px;
  color: #22c55e;
  font-size: 12px;
  font-weight: 700;
`;

const SummaryList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const SummaryLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
`;

const SummaryValue = styled.div`
  color: #111827;
  font-size: 12px;
  font-weight: 700;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
  background: ${({ $color }) => {
    if ($color === "green") return "#22c55e";
    if ($color === "yellow") return "#f59e0b";
    if ($color === "pink") return "#d946ef";
    if ($color === "indigo") return "#6366f1";
    if ($color === "red") return "#ef4444";
    return "#cbd5e1";
  }};
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardRightValue = styled.div`
  color: #111827;
  font-size: 14px;
  font-weight: 800;
`;

const WarningHeader = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 600;
`;

const WarningList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WarningItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
`;

const WarningName = styled.div`
  min-width: 0;
  color: #111827;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WarningStock = styled.div`
  color: #111827;
  font-size: 12px;
  font-weight: 700;
`;

const WarningEmpty = styled.div`
  color: #9ca3af;
  font-size: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const ToolbarSelect = styled.select`
  height: 38px;
  min-width: 120px;
  padding: 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #6b7280;
  font-size: 13px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #cfd8e3;
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
  min-width: 72px;
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  background: ${({ $type }) => {
    if ($type === "안전재고") return "#dcfce7";
    if ($type === "발주권고") return "#fef3c7";
    if ($type === "일시품절") return "#f5d0fe";
    return "#eef2f7";
  }};
  color: ${({ $type }) => {
    if ($type === "안전재고") return "#16a34a";
    if ($type === "발주권고") return "#d97706";
    if ($type === "일시품절") return "#c026d3";
    return "#667085";
  }};
`;

const SalesStatusSelect = styled.select`
  height: 30px;
  min-width: 94px;
  padding: 0 28px 0 10px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: ${({ $type }) => {
    if ($type === "판매중") return "#dcfce7";
    if ($type === "품절") return "#f5d0fe";
    if ($type === "판매중지") return "#fef3c7";
    if ($type === "판매종료") return "#e5e7eb";
    if ($type === "판매예정") return "#e0ecff";
    return "#eef2f7";
  }};
  color: ${({ $type }) => {
    if ($type === "판매중") return "#16a34a";
    if ($type === "품절") return "#c026d3";
    if ($type === "판매중지") return "#d97706";
    if ($type === "판매종료") return "#6b7280";
    if ($type === "판매예정") return "#2563eb";
    return "#667085";
  }};
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 9px center;
  background-size: 12px;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const CodeLink = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ProductNameLink = styled.a`
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;