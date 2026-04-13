import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";

const SUMMARY_CARDS = [
  { id: 1, title: "전체 상품 수", value: "66 SKU", diff: "6 SKU", positive: true },
  { id: 2, title: "AI 가격변경 상품", value: "60 SKU", diff: "0 SKU", positive: false },
  { id: 3, title: "최저가 유지 상품", value: "55 SKU", diff: "6 SKU", positive: true },
  { id: 4, title: "최저가 아닌 상품", value: "10 SKU", diff: "6 SKU", positive: true },
];

const MOCK_ROWS = [
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

export default function PriceSearch() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    keyword: "",
    category: "",
    lowestYn: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRows = useMemo(() => {
    return MOCK_ROWS.filter((item) => {
      const keyword = filters.keyword.trim();

      const matchKeyword =
        !keyword ||
        item.productName.includes(keyword) ||
        item.productCode.includes(keyword);

      const matchCategory =
        !filters.category || item.category.includes(filters.category);

      const matchLowest =
        !filters.lowestYn || item.isLowest === filters.lowestYn;

      const matchStartDate =
        !filters.startDate || item.updatedDate >= filters.startDate;

      const matchEndDate =
        !filters.endDate || item.updatedDate <= filters.endDate;

      return (
        matchKeyword &&
        matchCategory &&
        matchLowest &&
        matchStartDate &&
        matchEndDate
      );
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const handleChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      keyword: "",
      category: "",
      lowestYn: "",
    });
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
     
      <PageSection>
        <PageInner>
          <Title>가격 조회</Title>
          <SummaryGrid>
            {SUMMARY_CARDS.map((card) => (
              <SummaryCard key={card.id}>
                <SummaryTitle>{card.title}</SummaryTitle>
                <SummaryValue>{card.value}</SummaryValue>
                <SummaryDiff positive={card.positive}>
                  <span>{card.positive ? "↑" : "–"}</span> {card.diff}
                  <SummarySub>vs Yesterday</SummarySub>
                </SummaryDiff>
              </SummaryCard>
            ))}
          </SummaryGrid>

          <FilterBar>
            <FilterInput
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChangeFilter}
            />
            <Tilde>~</Tilde>
            <FilterInput
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChangeFilter}
            />

            <KeywordInput
              type="text"
              name="keyword"
              placeholder="상품명, 상품코드로 검색"
              value={filters.keyword}
              onChange={handleChangeFilter}
            />

            <FilterSelect
              name="category"
              value={filters.category}
              onChange={handleChangeFilter}
            >
              <option value="">카테고리</option>
              <option value="라면">라면</option>
              <option value="스낵과자">스낵과자</option>
              <option value="즉석식품">즉석식품</option>
              <option value="탄산음료">탄산음료</option>
            </FilterSelect>

            <FilterSelect
              name="lowestYn"
              value={filters.lowestYn}
              onChange={handleChangeFilter}
            >
              <option value="">최저가여부</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </FilterSelect>

            <PrimaryButton type="button" onClick={handleSearch}>
              검색
            </PrimaryButton>
            <SecondaryButton type="button" onClick={handleReset}>
              초기화
            </SecondaryButton>
          </FilterBar>

          <TableCard>
            <TableScroll>
              <StyledTable>
                <thead>
                  <tr>
                    <th>카탈로그 ID</th>
                    <th>상품코드</th>
                    <th>상품명</th>
                    <th>판매가</th>
                    <th>최저가</th>
                    <th>최저가여부</th>
                    <th>최저가대비</th>
                    <th>AI 가격변경</th>
                    <th>최저가제한</th>
                    <th>최고가제한</th>
                    <th>재고</th>
                    <th>판매상태</th>
                    <th>카테고리</th>
                    <th>최근변경일</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedRows.map((item) => (
                    <tr key={item.id}>
                      <td>{item.catalogId}</td>
                      <BoldCell>{item.productCode}</BoldCell>
                      <ProductNameCell>{item.productName}</ProductNameCell>
                      <td>{item.salePrice}</td>
                      <td>{item.lowestPrice}</td>
                      <LowestCell isLowest={item.isLowest}>
                        {item.isLowest}
                      </LowestCell>
                      <td>
                        <PriceGapWrap>
                          <div>{item.priceGap}</div>
                          <RateBadge negative={item.priceRate.startsWith("-")}>
                            {item.priceRate}
                          </RateBadge>
                        </PriceGapWrap>
                      </td>
                      <td>
                        <Switch checked={item.aiPriceChanged}>
                          <SwitchThumb checked={item.aiPriceChanged} />
                        </Switch>
                      </td>
                      <td>{item.minPrice}</td>
                      <td>{item.maxPrice}</td>
                      <td>{item.stock}</td>
                      <td>
                        <StatusBadge status={item.status}>{item.status}</StatusBadge>
                      </td>
                      <td>{item.category}</td>
                      <td>{item.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableScroll>
          </TableCard>

          <PaginationRow>
            <PageSizeBox>
              <span>Showing</span>
              <PageSizeSelect value={pageSize} onChange={handlePageSizeChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </PageSizeSelect>
              <span>of {filteredRows.length}</span>
            </PageSizeBox>

            <Pagination>
              <PageButton
                type="button"
                disabled={page === 1}
                onClick={() => handlePageChange(1)}
              >
                «
              </PageButton>
              <PageButton
                type="button"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                ‹
              </PageButton>

              {pageNumbers.map((num) => (
                <PageButton
                  key={num}
                  type="button"
                  active={page === num}
                  onClick={() => handlePageChange(num)}
                >
                  {num}
                </PageButton>
              ))}

              <PageButton
                type="button"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                ›
              </PageButton>
              <PageButton
                type="button"
                disabled={page === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                »
              </PageButton>
            </Pagination>
          </PaginationRow>
        </PageInner>
      </PageSection>
      
    </>
  );
}

/* styled-components */

const PageSection = styled.main`
  min-height: calc(100vh - 160px);
  background: #f5f7fb;
  padding: 32px;
`;

const PageInner = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 30px;
  font-weight: 700;
  color: #1f2430;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(17, 24, 39, 0.04);
`;

const SummaryTitle = styled.p`
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #5f6876;
`;

const SummaryValue = styled.h3`
  margin: 0 0 10px;
  font-size: 42px;
  line-height: 1;
  font-weight: 700;
  color: #1e2430;
`;

const SummaryDiff = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ positive }) => (positive ? "#19b45b" : "#9aa3b2")};

  span {
    margin-right: 2px;
  }
`;

const SummarySub = styled.span`
  margin-left: 6px;
  color: #9aa3b2;
  font-weight: 500;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
`;

const sharedInputStyle = css`
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e5e9f0;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
  color: #1f2430;
  outline: none;

  &:focus {
    border-color: #4a7cff;
  }
`;

const FilterInput = styled.input`
  ${sharedInputStyle}
`;

const KeywordInput = styled.input`
  ${sharedInputStyle};
  min-width: 260px;
`;

const FilterSelect = styled.select`
  ${sharedInputStyle};
  min-width: 130px;
  cursor: pointer;
`;

const Tilde = styled.span`
  color: #8c95a3;
  font-size: 14px;
`;

const PrimaryButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: #e8edf5;
  color: #1f2430;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(17, 24, 39, 0.04);
  overflow: hidden;
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 1460px;
  border-collapse: collapse;

  th,
  td {
    padding: 16px 14px;
    text-align: center;
    border-bottom: 1px solid #eef1f5;
    font-size: 14px;
    white-space: nowrap;
    color: #2a3240;
  }

  th {
    background: #f9fafc;
    font-weight: 700;
    color: #7b8492;
  }

  tbody tr:hover {
    background: #fafcff;
  }
`;

const BoldCell = styled.td`
  font-weight: 700;
`;

const ProductNameCell = styled.td`
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LowestCell = styled.td`
  font-weight: 700;
  color: ${({ isLowest }) => (isLowest === "Y" ? "#18b663" : "#ef5350")};
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
  background: ${({ negative }) => (negative ? "#dcf7e8" : "#ffe7e7")};
  color: ${({ negative }) => (negative ? "#18b663" : "#ef5350")};
`;

const Switch = styled.div`
  position: relative;
  width: 42px;
  height: 24px;
  margin: 0 auto;
  border-radius: 999px;
  background: ${({ checked }) => (checked ? "#707784" : "#d7dbe3")};
`;

const SwitchThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ checked }) => (checked ? "21px" : "3px")};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  transition: left 0.2s ease;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 74px;
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;

  ${({ status }) => {
    switch (status) {
      case "판매중":
        return css`
          background: #dcf7e8;
          color: #19b45b;
        `;
      case "판매중지":
        return css`
          background: #fff4cf;
          color: #d79b0c;
        `;
      case "품절":
        return css`
          background: #f4dfff;
          color: #9b45db;
        `;
      case "판매종료":
        return css`
          background: #ebe7ff;
          color: #6b5ae0;
        `;
      default:
        return css`
          background: #eef1f5;
          color: #6c7480;
        `;
    }
  }}
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PageSizeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6f7785;
  font-size: 14px;
`;

const PageSizeSelect = styled.select`
  ${sharedInputStyle};
  height: 38px;
  padding: 0 10px;
  min-width: 64px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PageButton = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid #e5e9f0;
  border-radius: 8px;
  background: ${({ active }) => (active ? "#2563eb" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#4b5563")};
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;