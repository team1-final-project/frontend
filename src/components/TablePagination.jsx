import React from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function TablePagination({
  page = 1,
  totalPages = 1,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
}) {
  const currentPage = Math.min(page, totalPages);
  const startCount = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endCount = Math.min(currentPage * pageSize, totalCount);

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(
        <PageButton
          key={i}
          type="button"
          $active={i === currentPage}
          onClick={() => onPageChange?.(i)}
        >
          {i}
        </PageButton>,
      );
    }

    return pages;
  };

  return (
    <Footer>
      <FooterLeft>
        <LeftGroup>
          <span>Showing</span>

          <PageSizeWrap>
            <PageSizeSelect
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </PageSizeSelect>

            <SelectIcon>
              <ChevronDown size={14} />
            </SelectIcon>
          </PageSizeWrap>
        </LeftGroup>

        <CountText>
          {startCount}-{endCount} of {totalCount}
        </CountText>
      </FooterLeft>

      <Pagination>
        <ArrowButton
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={14} />
        </ArrowButton>

        {renderPagination()}

        <ArrowButton
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight size={14} />
        </ArrowButton>
      </Pagination>
    </Footer>
  );
}

const Footer = styled.div`
  margin-top: 14px;
  padding: 0 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  color: #9ca3af;
  font-size: 13px;
  white-space: nowrap;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const CountText = styled.span`
  flex-shrink: 0;
`;

const PageSizeWrap = styled.div`
  position: relative;
`;

const PageSizeSelect = styled.select`
  height: 32px;
  min-width: 54px;
  padding: 0 28px 0 10px;
  border: 1px solid #edf0f4;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 12px;
  appearance: none;
  cursor: pointer;
  outline: none;
`;

const SelectIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const ArrowButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #edf0f4;
  border-radius: 8px;
  background: #ffffff;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

const PageButton = styled.button`
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid ${({ $active }) => ($active ? "#2563eb" : "#edf0f4")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#2563eb" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#9ca3af")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;