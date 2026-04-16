import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ToggleSwitch from "../../../components/ToggleSwitch";

const MOCK_PRODUCT = {
  productCode: "9744302255",
  productName: "농심 신라면컵 114g, 1개",
  salePrice: "1,100원",
  catalogId: "53390091166",
  catalogName: "농심 신라면 114g, 1개",
  lowestPrice: "1,200원",
};


const MOCK_ROWS = [
  {
    id: 1,
    datetime: "26/04/05 09:07",
    aiChanged: true,
    salePrice: "1,250원",
    salesQty: "30개",
    salesPerHour: "0.6개",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "140원",
    priceRate: "+12.6%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "5,000개",
    date: "2026-04-05",
  },
  {
    id: 2,
    datetime: "26/04/07 09:07",
    aiChanged: true,
    salePrice: "1,010원",
    salesQty: "900개",
    salesPerHour: "60개",
    isLowest: "Y",
    lowestPrice: "1,110원",
    priceGap: "100원",
    priceRate: "-9%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "4,100개",
    date: "2026-04-07",
  },
  {
    id: 3,
    datetime: "26/04/08 00:07",
    aiChanged: true,
    salePrice: "1,110원",
    salesQty: "800개",
    salesPerHour: "25개",
    isLowest: "Y",
    lowestPrice: "1,210원",
    priceGap: "100원",
    priceRate: "-8.2%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "3,300개",
    date: "2026-04-08",
  },
  {
    id: 4,
    datetime: "26/04/09 08:00",
    aiChanged: true,
    salePrice: "990원",
    salesQty: "3,000개",
    salesPerHour: "298.5개",
    isLowest: "Y",
    lowestPrice: "1,010원",
    priceGap: "100원",
    priceRate: "-8.2%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "300개",
    date: "2026-04-09",
  },
  {
    id: 5,
    datetime: "26/04/09 18:03",
    aiChanged: false,
    salePrice: "1,330원",
    salesQty: "30개",
    salesPerHour: "-",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "220원",
    priceRate: "+19.8%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "30개",
    date: "2026-04-09",
  },
  {
    id: 6,
    datetime: "26/04/09 18:03",
    aiChanged: false,
    salePrice: "1,330원",
    salesQty: "30개",
    salesPerHour: "-",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "220원",
    priceRate: "+19.8%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "30개",
    date: "2026-04-09",
  },
  {
    id: 7,
    datetime: "26/04/09 18:03",
    aiChanged: false,
    salePrice: "1,330원",
    salesQty: "30개",
    salesPerHour: "-",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "220원",
    priceRate: "+19.8%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "30개",
    date: "2026-04-09",
  },
  {
    id: 8,
    datetime: "26/04/09 18:03",
    aiChanged: false,
    salePrice: "1,330원",
    salesQty: "30개",
    salesPerHour: "-",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "220원",
    priceRate: "+19.8%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "30개",
    date: "2026-04-09",
  },
  {
    id: 9,
    datetime: "26/04/09 18:03",
    aiChanged: false,
    salePrice: "1,330원",
    salesQty: "30개",
    salesPerHour: "-",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "220원",
    priceRate: "+19.8%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "30개",
    date: "2026-04-09",
  },
  {
    id: 10,
    datetime: "26/04/09 18:03",
    aiChanged: false,
    salePrice: "1,330원",
    salesQty: "30개",
    salesPerHour: "-",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "220원",
    priceRate: "+19.8%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "30개",
    date: "2026-04-09",
  },
  {
    id: 11,
    datetime: "26/04/10 09:00",
    aiChanged: true,
    salePrice: "1,180원",
    salesQty: "250개",
    salesPerHour: "12개",
    isLowest: "Y",
    lowestPrice: "1,210원",
    priceGap: "30원",
    priceRate: "-2.4%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "280개",
    date: "2026-04-10",
  },
  {
    id: 12,
    datetime: "26/04/10 12:30",
    aiChanged: false,
    salePrice: "1,290원",
    salesQty: "40개",
    salesPerHour: "2개",
    isLowest: "N",
    lowestPrice: "1,110원",
    priceGap: "180원",
    priceRate: "+16.2%",
    minPrice: "900원",
    maxPrice: "1,500원",
    adjustmentLimit: "500원",
    stock: "240개",
    date: "2026-04-10",
  },
];


export default function AIHistory() {
  const [rows, setRows] = useState(MOCK_ROWS);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    keyword: "",
  });

  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const normalizedKeyword = filters.keyword.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchKeyword =
        !normalizedKeyword ||
        MOCK_PRODUCT.productCode.toLowerCase().includes(normalizedKeyword) ||
        MOCK_PRODUCT.productName.toLowerCase().includes(normalizedKeyword);

      const matchStartDate =
        !filters.startDate || item.date >= filters.startDate;

      const matchEndDate = !filters.endDate || item.date <= filters.endDate;

      return matchKeyword && matchStartDate && matchEndDate;
    });
  }, [rows, filters.startDate, filters.endDate, normalizedKeyword]);

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pagedRows = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, page, pageSize]);



  const handleToggleAiChanged = (id, nextChecked) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, aiChanged: nextChecked } : item
      )
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setSearched(true);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const renderEmptyState = () => (
    <EmptyStateWrap>
      <EmptyIconWrap>
        <AlertTriangle size={54} strokeWidth={1.8} />
      </EmptyIconWrap>
      <EmptyText>상품을 검색하세요</EmptyText>
    </EmptyStateWrap>
  );

  const renderResult = () => (
    <>
      <SectionCard>
        <SectionTitle>상품정보</SectionTitle>
        <InfoGrid>
          <InfoRow>
            <InfoLabel>상품코드</InfoLabel>
            <InfoValueBox $compact>
              <InternalLink to={`/admin/product-update/${MOCK_PRODUCT.productCode}`}>
                {MOCK_PRODUCT.productCode}
              </InternalLink>
            </InfoValueBox>
          </InfoRow>

          <InfoRow>
            <InfoLabel>상품명</InfoLabel>
            <InfoValueBox>
              <ExternalAnchor href="#">
                {MOCK_PRODUCT.productName}
              </ExternalAnchor>
            </InfoValueBox>
          </InfoRow>

          <InfoRow>
            <InfoLabel>판매가</InfoLabel>
            <InfoValueBox $compact>{MOCK_PRODUCT.salePrice}</InfoValueBox>
          </InfoRow>
        </InfoGrid>
      </SectionCard>

      <SectionCard>
        <SectionTitle>가격비교 정보</SectionTitle>
        <InfoGrid>
          <InfoRow>
            <InfoLabel>카탈로그 ID</InfoLabel>
            <InfoValueBox $compact>
              <ExternalAnchor
                href={`https://search.shopping.naver.com/catalog/${MOCK_PRODUCT.catalogId}`}
                target="_blank"
                rel="noreferrer"
              >
                {MOCK_PRODUCT.catalogId}
              </ExternalAnchor>
            </InfoValueBox>
          </InfoRow>

          <InfoRow>
            <InfoLabel>카탈로그명</InfoLabel>
            <InfoValueBox>{MOCK_PRODUCT.catalogName}</InfoValueBox>
          </InfoRow>

          <InfoRow>
            <InfoLabel>최저가</InfoLabel>
            <InfoValueBox $compact>{MOCK_PRODUCT.lowestPrice}</InfoValueBox>
          </InfoRow>
        </InfoGrid>
      </SectionCard>

      <SectionCard>
        <SectionTitle>상세이력</SectionTitle>

        <TableCard>
          <TableScroll>
            <StyledTable>
              <thead>
                <tr>
                  <th>일자</th>
                  <th>판매가</th>
                  <th>판매량</th>
                  <th>시간당판매량</th>
                  <th>최저가여부</th>
                  <th>최저가</th>
                  <th>최저가대비</th>
                  <th>최저가제한</th>
                  <th>최고가제한</th>
                  <th>희망조정가 제한</th>
                  <th>재고</th>
                </tr>
              </thead>

              <tbody>
                {pagedRows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.datetime}</td>
                    <td>{item.salePrice}</td>
                    <td>{item.salesQty}</td>
                    <td>{item.salesPerHour}</td>
                    <LowestTextCell $isLowest={item.isLowest}>
                      {item.isLowest}
                    </LowestTextCell>
                    <td>{item.lowestPrice}</td>
                    <td>
                      <GapWrap>
                        <div>{item.priceGap}</div>
                        <RateBadge $negative={item.priceRate.startsWith("-")}>
                          {item.priceRate}
                        </RateBadge>
                      </GapWrap>
                    </td>
                    <td>{item.minPrice}</td>
                    <td>{item.maxPrice}</td>
                    <td>{item.adjustmentLimit}</td>
                    <td>{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableScroll>
        </TableCard>

        <PaginationRow>
          <PageSizeBox>
            <span>Showing</span>
            <PageSizeSelect
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </PageSizeSelect>
            <span>of {totalCount}</span>
          </PageSizeBox>

          <Pagination>
            <PageButton
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={14} />
            </PageButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <PageButton
                key={num}
                type="button"
                $active={page === num}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </PageButton>
            ))}

            <PageButton
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight size={14} />
            </PageButton>
          </Pagination>
        </PaginationRow>
      </SectionCard>
    </>
  );

  return (
    <PageSection>
      <PageInner>
        <TopBar>
          <PageTitle>AI 가격변경 이력 조회</PageTitle>

          <TopActions>
            <BellWrap>
              <Bell size={20} />
              <Badge>4</Badge>
            </BellWrap>
            <ProfileCircle />
          </TopActions>
        </TopBar>

        <FilterBar>
          <DateInputWrap>
            <FilterInput
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
            <CalendarIcon>
              <CalendarDays size={16} />
            </CalendarIcon>
          </DateInputWrap>

          <Tilde>~</Tilde>

          <DateInputWrap>
            <FilterInput
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
            <CalendarIcon>
              <CalendarDays size={16} />
            </CalendarIcon>
          </DateInputWrap>

          <KeywordWrap>
            <KeywordInput
              type="text"
              name="keyword"
              placeholder="상품명, 상품코드로 검색"
              value={filters.keyword}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <KeywordIconButton type="button" onClick={handleSearch}>
              <Search size={16} />
            </KeywordIconButton>
          </KeywordWrap>
        </FilterBar>

        {searched && totalCount > 0 ? renderResult() : renderEmptyState()}
      </PageInner>
    </PageSection>
  );
}

const PageSection = styled.main`
  min-height: 100vh;
  background: #f5f6f8;
  padding: 28px 26px 40px;
`;

const PageInner = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #1f2430;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const BellWrap = styled.div`
  position: relative;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.span`
  position: absolute;
  top: -7px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #8b7cf6;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #22c55e;
    border: 2px solid #f5f6f8;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

const sharedInputStyle = css`
  height: 42px;
  border: 1px solid #eceef3;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #d5d9e2;
  }
`;

const DateInputWrap = styled.div`
  position: relative;
  width: 134px;
`;

const FilterInput = styled.input`
  ${sharedInputStyle};
  width: 100%;
  padding: 0 38px 0 14px;

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }
`;

const CalendarIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #9aa3b2;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tilde = styled.span`
  color: #9aa3b2;
  font-size: 14px;
`;

const KeywordWrap = styled.div`
  display: flex;
  align-items: center;
  width: 230px;
  height: 42px;
  border: 1px solid #eceef3;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
`;

const KeywordInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 14px;
  color: #374151;
  font-size: 14px;

  &::placeholder {
    color: #9aa3b2;
  }
`;

const KeywordIconButton = styled.button`
  width: 42px;
  height: 42px;
  border: none;
  border-left: 1px solid #f0f2f6;
  background: #ffffff;
  color: #9aa3b2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const EmptyStateWrap = styled.div`
  min-height: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9aa3b2;
`;

const EmptyIconWrap = styled.div`
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const SectionCard = styled.section`
  background: #ffffff;
  border: 1px solid #eef0f4;
  border-radius: 16px;
  padding: 18px 18px 16px;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 800;
  color: #1f2430;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: center;
  gap: 14px;
`;

const InfoLabel = styled.div`
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
`;

const InfoValueBox = styled.div`
  height: 34px;
  width: ${({ $compact }) => ($compact ? "174px" : "100%")};
  border: 1px solid #eceef3;
  border-radius: 6px;
  background: #ffffff;
  padding: 0 14px;
  display: flex;
  align-items: center;
  color: #4b5563;
  font-size: 14px;
`;

const linkBase = css`
  color: #111827;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const InternalLink = styled(Link)`
  ${linkBase}
`;

const ExternalAnchor = styled.a`
  ${linkBase}
`;

const TableCard = styled.div`
  border: 1px solid #eef0f4;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
`;

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cfd5df;
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f3f7;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 1280px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 12px;
    text-align: center;
    border-bottom: 1px solid #eef1f5;
    font-size: 13px;
    white-space: nowrap;
    color: #2a3240;
  }

  th {
    background: #f9fafc;
    font-weight: 700;
    color: #8b93a1;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const LowestTextCell = styled.td`
  font-weight: 700 !important;
  color: ${({ $isLowest }) => ($isLowest === "Y" ? "#18b663" : "#ef5350")} !important;
`;

const GapWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const RateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $negative }) => ($negative ? "#dcf7e8" : "#ffe7e7")};
  color: ${({ $negative }) => ($negative ? "#18b663" : "#ef5350")};
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PageSizeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b93a1;
  font-size: 13px;
`;

const PageSizeSelect = styled.select`
  ${sharedInputStyle};
  height: 34px;
  min-width: 58px;
  padding: 0 10px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PageButton = styled.button`
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid ${({ $active }) => ($active ? "#111827" : "#e5e9f0")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#111827" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#4b5563")};
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;