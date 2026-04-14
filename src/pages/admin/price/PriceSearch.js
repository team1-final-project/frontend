import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SummaryCard from "../../../components/SummaryCard";
import TableComponent from "../../../components/TableComponent";
import StatusBadge from "../../../components/StatusBadge";
import ToggleSwitch from "../../../components/ToggleSwitch";

const initialRows = [
  {
    id: 1,
    catalogId: "53390091166",
    productCode: "9744302255",
    productName: "농심 신라면 114g, 1개",
    salePrice: "1,250원",
    lowestPrice: "1,110원",
    isLowest: "N",
    priceGap: "140원",
    priceRate: "+12.6%",
    aiPriceChanged: true,
    minPrice: "900원",
    maxPrice: "1,500원",
    stock: "11,111개",
    status: "판매중",
    category: "가공 / 간편식품 > 라면",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 2,
    catalogId: "59386488490",
    productCode: "12279799725",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    salePrice: "5,970원",
    lowestPrice: "7,380원",
    isLowest: "Y",
    priceGap: "1,410원",
    priceRate: "-19.1%",
    aiPriceChanged: false,
    minPrice: "-",
    maxPrice: "-",
    stock: "30개",
    status: "판매중지",
    category: "간식 / 음료 > 스낵과자",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 3,
    catalogId: "51929484460",
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    salePrice: "21,400원",
    lowestPrice: "20,290원",
    isLowest: "N",
    priceGap: "1,110원",
    priceRate: "+5.4%",
    aiPriceChanged: true,
    minPrice: "19,000원",
    maxPrice: "24,900원",
    stock: "0개",
    status: "품절",
    category: "가공 / 간편식품 > 즉석식품",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 4,
    catalogId: "58572119865",
    productCode: "5909188198",
    productName: "코카콜라 큰라 1.5L, 12개",
    salePrice: "34,080원",
    lowestPrice: "34,180원",
    isLowest: "Y",
    priceGap: "100원",
    priceRate: "-0.3%",
    aiPriceChanged: true,
    minPrice: "29,000원",
    maxPrice: "39,000원",
    stock: "1,234개",
    status: "판매종료",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 5,
    catalogId: "58572119866",
    productCode: "5909188199",
    productName: "코카콜라 제로 1.5L, 12개",
    salePrice: "33,080원",
    lowestPrice: "33,180원",
    isLowest: "Y",
    priceGap: "100원",
    priceRate: "-0.3%",
    aiPriceChanged: false,
    minPrice: "28,000원",
    maxPrice: "38,000원",
    stock: "220개",
    status: "판매중",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 6,
    catalogId: "58572119867",
    productCode: "5909188200",
    productName: "칠성사이다 1.5L, 12개",
    salePrice: "31,500원",
    lowestPrice: "31,000원",
    isLowest: "N",
    priceGap: "500원",
    priceRate: "+1.6%",
    aiPriceChanged: true,
    minPrice: "27,000원",
    maxPrice: "36,000원",
    stock: "940개",
    status: "판매중",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 7,
    catalogId: "58572119868",
    productCode: "5909188201",
    productName: "코카콜라 큰라 1.5L, 12개",
    salePrice: "34,080원",
    lowestPrice: "34,180원",
    isLowest: "Y",
    priceGap: "100원",
    priceRate: "-0.3%",
    aiPriceChanged: true,
    minPrice: "29,000원",
    maxPrice: "39,000원",
    stock: "1,234개",
    status: "판매종료",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 8,
    catalogId: "58572119869",
    productCode: "5909188202",
    productName: "코카콜라 큰라 1.5L, 12개",
    salePrice: "34,080원",
    lowestPrice: "34,180원",
    isLowest: "Y",
    priceGap: "100원",
    priceRate: "-0.3%",
    aiPriceChanged: true,
    minPrice: "29,000원",
    maxPrice: "39,000원",
    stock: "1,234개",
    status: "판매종료",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 9,
    catalogId: "58572119870",
    productCode: "5909188203",
    productName: "코카콜라 큰라 1.5L, 12개",
    salePrice: "34,080원",
    lowestPrice: "34,180원",
    isLowest: "Y",
    priceGap: "100원",
    priceRate: "-0.3%",
    aiPriceChanged: true,
    minPrice: "29,000원",
    maxPrice: "39,000원",
    stock: "1,234개",
    status: "판매종료",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 10,
    catalogId: "58572119871",
    productCode: "5909188204",
    productName: "코카콜라 큰라 1.5L, 12개",
    salePrice: "34,080원",
    lowestPrice: "34,180원",
    isLowest: "Y",
    priceGap: "100원",
    priceRate: "-0.3%",
    aiPriceChanged: true,
    minPrice: "29,000원",
    maxPrice: "39,000원",
    stock: "1,234개",
    status: "판매종료",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
  {
    id: 11,
    catalogId: "58572119872",
    productCode: "5909188205",
    productName: "코카콜라 큰라 1.5L, 12개",
    salePrice: "34,080원",
    lowestPrice: "34,180원",
    isLowest: "Y",
    priceGap: "100원",
    priceRate: "-0.3%",
    aiPriceChanged: true,
    minPrice: "29,000원",
    maxPrice: "39,000원",
    stock: "1,234개",
    status: "판매종료",
    category: "간식 / 음료 > 탄산음료",
    updatedDate: "2026-04-07",
    updatedAt: "26/04/07 09:07",
  },
];

const categoryOptions = [
  ...new Set(initialRows.map((item) => item.category)),
].map((value) => ({
  label: value,
  value,
}));

const saleStatusOptions = ["판매중", "판매중지", "품절", "판매종료"];

const lowestStyleMap = {
  Y: { label: "Y", variant: "success" },
  N: { label: "N", variant: "danger" },
};

export default function PriceSearch() {
  const nav = useNavigate();

  const [rows, setRows] = useState(initialRows);
  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [lowestYn, setLowestYn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const summary = useMemo(() => {
    return {
      totalCount: rows.length,
      aiChangedCount: rows.filter((item) => item.aiPriceChanged).length,
      lowestCount: rows.filter((item) => item.isLowest === "Y").length,
      notLowestCount: rows.filter((item) => item.isLowest === "N").length,
    };
  }, [rows]);

  const filteredData = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return rows.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.productName.toLowerCase().includes(keyword) ||
        item.productCode.toLowerCase().includes(keyword);

      const matchesCategory = categoryValue
        ? item.category === categoryValue
        : true;

      const matchesLowest = lowestYn ? item.isLowest === lowestYn : true;
      const matchesStartDate = startDate ? item.updatedDate >= startDate : true;
      const matchesEndDate = endDate ? item.updatedDate <= endDate : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLowest &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [rows, searchValue, categoryValue, lowestYn, startDate, endDate]);

  const handleToggleAiPriceChanged = (id, checked) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, aiPriceChanged: checked } : item,
      ),
    );
  };

  const handleChangeSaleStatus = (id, value) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: value } : item,
      ),
    );
  };

  const handleReset = () => {
    setSearchValue("");
    setCategoryValue("");
    setLowestYn("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const columns = [
    {
      key: "catalogId",
      title: "카탈로그 ID",
      width: "130px",
      render: (value) => (
        <CatalogLink
          href={`https://search.shopping.naver.com/catalog/${value}`}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </CatalogLink>
      ),
    },
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
      key: "salePrice",
      title: "판매가",
      width: "100px",
    },
    {
      key: "lowestPrice",
      title: "최저가",
      width: "100px",
    },
    {
      key: "isLowest",
      title: "최저가여부",
      width: "90px",
      sortable: false,
      render: (value) => {
        const status = lowestStyleMap[value] || {
          label: value,
          variant: "info",
        };

        return (
          <StatusBadge
            value={status.label}
            variant={status.variant}
            width="54px"
          />
        );
      },
    },
    {
      key: "priceGap",
      title: "최저가대비",
      width: "110px",
      sortable: false,
      render: (value, row) => (
        <PriceGapWrap>
          <div>{value}</div>
          <RateBadge $negative={row.priceRate.startsWith("-")}>
            {row.priceRate}
          </RateBadge>
        </PriceGapWrap>
      ),
    },
    {
      key: "aiPriceChanged",
      title: "AI 가격변경",
      width: "96px",
      align: "center",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <ToggleSwitch
            checked={value}
            onChange={(checked) => handleToggleAiPriceChanged(row.id, checked)}
            width={42}
            height={24}
          />
        </CenterCell>
      ),
    },
    {
      key: "minPrice",
      title: "최저가제한",
      width: "100px",
    },
    {
      key: "maxPrice",
      title: "최고가제한",
      width: "100px",
    },
    {
      key: "stock",
      title: "재고",
      width: "90px",
    },
    {
      key: "status",
      title: "판매상태",
      width: "120px",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <SaleStatusSelect
            $status={value}
            value={value}
            onChange={(e) => handleChangeSaleStatus(row.id, e.target.value)}
          >
            {saleStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SaleStatusSelect>
        </CenterCell>
      ),
    },
    {
      key: "category",
      title: "카테고리",
      width: "190px",
      sortable: false,
      render: (value) => <SubText>{value}</SubText>,
    },
    {
      key: "updatedAt",
      title: "최근변경일",
      width: "120px",
      sortable: false,
      render: (value) => <SubText>{value}</SubText>,
    },
  ];

  return (
    <PageWrap>
      <HeaderRow>
        <Title>가격 조회</Title>
      </HeaderRow>

      <SummaryGrid>
        <SummaryCard
          title="전체 상품 수"
          subText="가격 조회 대상"
          value={`${summary.totalCount} SKU`}
          change="0 SKU"
          up
        />
        <SummaryCard
          title="AI 가격변경 상품"
          subText="자동 조정 대상"
          value={`${summary.aiChangedCount} SKU`}
          change="0 SKU"
          up
        />
        <SummaryCard
          title="최저가 유지 상품"
          subText="현재 최저가 일치"
          value={`${summary.lowestCount} SKU`}
          change="0 SKU"
          up
        />
        <SummaryCard
          title="최저가 아닌 상품"
          subText="재조정 필요"
          value={`${summary.notLowestCount} SKU`}
          change="0 SKU"
          up={false}
        />
      </SummaryGrid>

      <TableComponent
        variant="price"
        columns={columns}
        data={filteredData}
        rowKey="id"
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
              value={categoryValue}
              onChange={(e) => {
                setCategoryValue(e.target.value);
                setPage(1);
              }}
            >
              <option value="">카테고리</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={lowestYn}
              onChange={(e) => {
                setLowestYn(e.target.value);
                setPage(1);
              }}
            >
              <option value="">최저가여부</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </FilterSelect>

            <SecondaryButton type="button" onClick={handleReset}>
              초기화
            </SecondaryButton>
          </CustomToolbar>
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
  gap: 12px;
  margin-bottom: 20px;
  margin-top: 5px;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
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
  height: 38px;
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

const DateDivider = styled.span`
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
`;

const KeywordInput = styled.input`
  height: 38px;
  min-width: 260px;
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

const FilterSelect = styled.select`
  height: 38px;
  min-width: 130px;
  padding: 0 12px;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #cfd8e3;
  }
`;

const SecondaryButton = styled.button`
  height: 38px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: #e8edf5;
  color: #1f2430;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const SubText = styled.span`
  color: #6b7280;
  font-size: 12px;
`;

const CenterCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceGapWrap = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const RateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $negative }) => ($negative ? "#dcf7e8" : "#ffe7e7")};
  color: ${({ $negative }) => ($negative ? "#18b663" : "#ef5350")};
`;

const CodeLink = styled.button`
  border: none;
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

const CatalogLink = styled.a`
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ProductNameLink = styled.a`
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const SaleStatusSelect = styled.select`
  height: 30px;
  min-width: 96px;
  padding: 0 30px 0 10px;
  border: 0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-color: ${({ $status }) => {
    if ($status === "판매중") return "#dcf7e8";
    if ($status === "판매중지") return "#fff4cf";
    if ($status === "품절") return "#f4dfff";
    if ($status === "판매종료") return "#ebe7ff";
    return "#eef1f5";
  }};

  color: ${({ $status }) => {
    if ($status === "판매중") return "#19b45b";
    if ($status === "판매중지") return "#d79b0c";
    if ($status === "품절") return "#9b45db";
    if ($status === "판매종료") return "#6b5ae0";
    return "#6c7480";
  }};

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;

  &:focus {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
  }
`;