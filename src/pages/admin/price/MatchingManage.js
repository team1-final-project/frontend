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
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "53390091166",
    productCode: "9744302255",
    productName: "농심 신라면컵 114g, 1개",
    category: "가공 / 간편식류 > 라면",
    price: 1250,
    useAiPrice: true,
    saleStatus: "판매중",
    updatedAt: "2026-04-07 09:07",
  },
  {
    id: 2,
    matchStatus: "미매칭",
    matchYn: "N",
    catalogNo: "-",
    productCode: "12277997925",
    productName: "농심 포테토칩 오리지널 390g, 1개",
    category: "간식 / 음료 > 스낵식사",
    price: 5700,
    useAiPrice: false,
    saleStatus: "판매대기",
    updatedAt: "2026-04-07 09:07",
  },
  {
    id: 3,
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "51929484460",
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    category: "가공 / 간편식류 > 즉석식품",
    price: 21400,
    useAiPrice: false,
    saleStatus: "품절",
    updatedAt: "2026-04-07 09:07",
  },
  {
    id: 4,
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "58572119865",
    productCode: "5909188198",
    productName: "코카콜라 클래식 1.5L, 12개",
    category: "간식 / 음료 > 탄산음료",
    price: 34080,
    useAiPrice: false,
    saleStatus: "판매중",
    updatedAt: "2026-04-07 09:07",
  },
  {
    id: 5,
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "58572119866",
    productCode: "5909188199",
    productName: "코카콜라 제로 1.5L, 12개",
    category: "간식 / 음료 > 탄산음료",
    price: 34080,
    useAiPrice: false,
    saleStatus: "판매중",
    updatedAt: "2026-04-07 09:07",
  },
  {
    id: 6,
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "58572119867",
    productCode: "5909188200",
    productName: "칠성사이다 1.5L, 12개",
    category: "간식 / 음료 > 탄산음료",
    price: 31800,
    useAiPrice: true,
    saleStatus: "판매중",
    updatedAt: "2026-04-07 09:07",
  },
  {
    id: 7,
    matchStatus: "미매칭",
    matchYn: "N",
    catalogNo: "-",
    productCode: "5909188201",
    productName: "웅진 하늘보리 500ml, 20개",
    category: "간식 / 음료 > 차음료",
    price: 17800,
    useAiPrice: true,
    saleStatus: "판매대기",
    updatedAt: "2026-04-06 09:07",
  },
  {
    id: 8,
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "58572119868",
    productCode: "5909188202",
    productName: "오리온 초코파이 468g, 1개",
    category: "간식 / 음료 > 과자",
    price: 4850,
    useAiPrice: true,
    saleStatus: "판매중",
    updatedAt: "2026-04-06 09:07",
  },
  {
    id: 9,
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "58572119869",
    productCode: "5909188203",
    productName: "삼립 정통 크림빵 3입",
    category: "가공 / 간편식류 > 빵류",
    price: 2980,
    useAiPrice: false,
    saleStatus: "판매중",
    updatedAt: "2026-04-06 09:07",
  },
  {
    id: 10,
    matchStatus: "매칭",
    matchYn: "Y",
    catalogNo: "58572119870",
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간편식류 > 라면",
    price: 5980,
    useAiPrice: true,
    saleStatus: "판매중",
    updatedAt: "2026-04-05 09:07",
  },
];

const categoryOptions = [
  { label: "가공 / 간편식류 > 라면", value: "가공 / 간편식류 > 라면" },
  { label: "간식 / 음료 > 스낵식사", value: "간식 / 음료 > 스낵식사" },
  { label: "가공 / 간편식류 > 즉석식품", value: "가공 / 간편식류 > 즉석식품" },
  { label: "간식 / 음료 > 탄산음료", value: "간식 / 음료 > 탄산음료" },
  { label: "간식 / 음료 > 차음료", value: "간식 / 음료 > 차음료" },
  { label: "간식 / 음료 > 과자", value: "간식 / 음료 > 과자" },
  { label: "가공 / 간편식류 > 빵류", value: "가공 / 간편식류 > 빵류" },
];

const matchStatusOptions = [
  { label: "매칭", value: "매칭" },
  { label: "미매칭", value: "미매칭" },
];

const saleStatusStyleMap = {
  판매중: { label: "판매중", variant: "success" },
  판매대기: { label: "판매대기", variant: "warning" },
  임시중지: { label: "임시중지", variant: "warning" },
  품절: { label: "품절", variant: "purple" },
};

const matchingStyleMap = {
  매칭: { label: "매칭", variant: "success" },
  미매칭: { label: "매칭", variant: "danger" },
};

function formatNumber(value) {
  return `${Number(value).toLocaleString()}원`;
}

function toDateValue(dateTimeText = "") {
  return dateTimeText.split(" ")[0].replace(/\//g, "-");
}

export default function MatchingManage() {
  const nav = useNavigate();

  const [rows, setRows] = useState(initialRows);
  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [matchFilter, setMatchFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const summary = useMemo(() => {
    return {
      totalCount: rows.length,
      matchedCount: rows.filter((item) => item.matchStatus === "매칭").length,
      unmatchedCount: rows.filter((item) => item.matchStatus === "미매칭")
        .length,
      aiPriceCount: rows.filter((item) => item.useAiPrice).length,
    };
  }, [rows]);

  const filteredData = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return rows.filter((item) => {
      const itemDate = toDateValue(item.updatedAt);

      const matchesSearch =
        !keyword ||
        item.catalogNo.toLowerCase().includes(keyword) ||
        item.productCode.toLowerCase().includes(keyword) ||
        item.productName.toLowerCase().includes(keyword);

      const matchesCategory = categoryValue
        ? item.category === categoryValue
        : true;

      const matchesMatchStatus = matchFilter
        ? item.matchStatus === matchFilter
        : true;

      const matchesStartDate = startDate ? itemDate >= startDate : true;
      const matchesEndDate = endDate ? itemDate <= endDate : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMatchStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [rows, searchValue, categoryValue, matchFilter, startDate, endDate]);

  const handleToggleAiPrice = (id) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, useAiPrice: !item.useAiPrice } : item,
      ),
    );
  };

  const columns = [
    {
      key: "matchStatus",
      title: "매칭 여부",
      width: "90px",
      sortable: false,
      render: (value) => {
        const status = matchingStyleMap[value] || {
          label: "매칭",
          variant: "info",
        };

        return (
          <StatusBadge
            value={status.label}
            variant={status.variant}
            width="62px"
          />
        );
      },
    },
    {
      key: "matchYn",
      title: "매칭상태",
      width: "80px",
      sortable: false,
      render: (value) => (
        <MatchYnText $matched={value === "Y"}>{value}</MatchYnText>
      ),
    },
    {
      key: "catalogNo",
      title: "카탈로그번호",
      width: "120px",
      render: (value) =>
        value && value !== "-" ? (
          <CatalogLinkButton
            type="button"
            onClick={() =>
              window.open(
                `https://search.shopping.naver.com/catalog/${value}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            {value}
          </CatalogLinkButton>
        ) : (
          <DashText>-</DashText>
        ),
    },
    {
      key: "productCode",
      title: "상품코드",
      width: "120px",
      render: (value, row) => (
        <ActionTextButton
          type="button"
          onClick={() =>
            nav(`/admin/product-update/${row.productCode}`, {
              state: { product: row },
            })
          }
        >
          {value}
        </ActionTextButton>
      ),
    },
    {
      key: "productName",
      title: "상품명",
      width: "250px",
      render: (value, row) => (
        <ProductNameButton
          type="button"
          onClick={() =>
            window.open(
              `/product-detail?productCode=${row.productCode}`,
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          {value}
        </ProductNameButton>
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
      key: "price",
      title: "판매가",
      width: "100px",
      sortType: "number",
      render: (value) => formatNumber(value),
    },
    {
      key: "useAiPrice",
      title: "AI 가격변경",
      width: "110px",
      align: "center",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <ToggleSwitch
            checked={value}
            onChange={() => handleToggleAiPrice(row.id)}
          />
        </CenterCell>
      ),
    },
    {
      key: "saleStatus",
      title: "판매상태",
      width: "110px",
      sortable: false,
      render: (value) => {
        const status = saleStatusStyleMap[value] || {
          label: value,
          variant: "info",
        };

        return (
          <StatusBadge
            value={status.label}
            variant={status.variant}
            width="84px"
          />
        );
      },
    },
    {
      key: "updatedAt",
      title: "최근변경일",
      width: "130px",
      sortType: "date",
      render: (value) => <SubText>{value}</SubText>,
    },
  ];

  return (
    <PageWrap>
      <Title>카탈로그 매칭 조회</Title>

      <SummaryGrid>
        <SummaryCard
          title="전체 상품 수"
          subText="전체 등록 상품"
          value={`${summary.totalCount}개`}
          change="6개"
          up
        />
        <SummaryCard
          title="카탈로그 매칭 상품"
          subText="매칭 완료 상품"
          value={`${summary.matchedCount}개`}
          change="0개"
          up={false}
        />
        <SummaryCard
          title="카탈로그 미매칭 상품"
          subText="매칭 대기 상품"
          value={`${summary.unmatchedCount}개`}
          change="1개"
          up
        />
        <SummaryCard
          title="AI 가격변경 상품"
          subText="AI 가격 적용 상품"
          value={`${summary.aiPriceCount}개`}
          change="0개"
          up={false}
        />
      </SummaryGrid>

      <TableComponent
        columns={columns}
        data={filteredData}
        rowKey="id"
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
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
          <ExtraToolbarWrap>
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
            <MatchSelectWrap>
              <MatchSelect
                value={matchFilter}
                onChange={(e) => {
                  setMatchFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">매칭상태</option>
                {matchStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </MatchSelect>
            </MatchSelectWrap>
            <ResetButton
              type="button"
              onClick={() => {
                setSearchValue("");
                setCategoryValue("");
                setMatchFilter("");
                setStartDate("");
                setEndDate("");
                setPage(1);
              }}
            >
              초기화
            </ResetButton>
          </ExtraToolbarWrap>
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

const Title = styled.h2`
  margin: 0 0 18px;
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

const ExtraToolbarWrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
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

const MatchSelectWrap = styled.div`
  position: relative;
`;

const MatchSelect = styled.select`
  height: 38px;
  min-width: 110px;
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

const ResetButton = styled.button`
  height: 38px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const ActionTextButton = styled.button`
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

const ProductNameButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const CatalogLinkButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #03c75a;
    text-decoration: underline;
  }
`;

const MatchYnText = styled.span`
  color: ${({ $matched }) => ($matched ? "#16a34a" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;
`;

const DashText = styled.span`
  color: #9ca3af;
  font-size: 13px;
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
