import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ChevronUp,
} from "lucide-react";
import TablePagination from "./TablePagination";

export default function TableComponent({
  columns = [],
  data = [],
  rowKey = "id",
  variant = "default",
  headerAlign = "left",
  cellAlign = "left",
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue = "",
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "Filter",
  extraToolbar = null,
  toolbarRight = null,
  customToolbar = null,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  const handleSort = (column) => {
    if (column.sortable === false) return;

    setSortConfig((prev) => {
      if (prev.key === column.key) {
        return {
          key: column.key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key: column.key,
        direction: "asc",
      };
    });
  };

  const isNumericLike = (value) => {
    if (typeof value === "number") return true;
    if (typeof value !== "string") return false;

    const trimmed = value.trim();
    return /^[₩$€£¥+\-]?\s?[\d,.]+%?$/.test(trimmed);
  };

  const parseNumericLike = (value) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return NaN;

    const cleaned = value.replace(/[^0-9.-]/g, "");
    if (!cleaned) return NaN;

    return Number(cleaned);
  };

  const getSortValue = (row, column) => {
    if (column.sortValue) return column.sortValue(row);
    return row[column.key];
  };

  const compareValues = (aValue, bValue, sortType = "auto") => {
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (sortType === "number") {
      const aNum = parseNumericLike(aValue);
      const bNum = parseNumericLike(bValue);

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return aNum - bNum;
      }
    }

    if (sortType === "date") {
      const aDate = new Date(aValue).getTime();
      const bDate = new Date(bValue).getTime();

      if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
        return aDate - bDate;
      }
    }

    if (sortType === "auto") {
      const bothNumbers =
        (typeof aValue === "number" && typeof bValue === "number") ||
        (isNumericLike(aValue) && isNumericLike(bValue));

      if (bothNumbers) {
        const aNum = parseNumericLike(aValue);
        const bNum = parseNumericLike(bValue);

        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return aNum - bNum;
        }
      }
    }

    const aText = String(aValue).toLowerCase();
    const bText = String(bValue).toLowerCase();

    return aText.localeCompare(bText, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const targetColumn = columns.find(
      (column) => column.key === sortConfig.key,
    );
    if (!targetColumn) return data;

    const copied = [...data];

    copied.sort((a, b) => {
      const aValue = getSortValue(a, targetColumn);
      const bValue = getSortValue(b, targetColumn);

      const result = compareValues(
        aValue,
        bValue,
        targetColumn.sortType || "auto",
      );

      return sortConfig.direction === "asc" ? result : -result;
    });

    return copied;
  }, [data, columns, sortConfig]);

  const totalCount = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const renderSortIcon = (column) => {
    if (column.sortable === false) return null;

    if (sortConfig.key !== column.key) {
      return <ArrowUpDown size={variant === "inventory" ? 13 : 14} />;
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp size={variant === "inventory" ? 13 : 14} />
    ) : (
      <ChevronDown size={variant === "inventory" ? 13 : 14} />
    );
  };

  return (
    <Container>
      <Toolbar $variant={variant}>
        {customToolbar ? (
          <CustomToolbarWrap $variant={variant}>
            {customToolbar}
          </CustomToolbarWrap>
        ) : (
          <>
            <ToolbarLeft $variant={variant}>
              {typeof onSearchChange === "function" && (
                <SearchWrap $variant={variant}>
                  <SearchInput
                    $variant={variant}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                  />
                  <SearchIcon>
                    <Search size={15} />
                  </SearchIcon>
                </SearchWrap>
              )}

              {typeof onFilterChange === "function" && (
                <FilterSelectWrap $variant={variant}>
                  <FilterSelect
                    $variant={variant}
                    value={filterValue}
                    onChange={(e) => onFilterChange(e.target.value)}
                  >
                    <option value="">{filterPlaceholder}</option>
                    {filterOptions.map((option) => (
                      <option
                        key={option.value ?? option.label}
                        value={option.value ?? option.label}
                      >
                        {option.label}
                      </option>
                    ))}
                  </FilterSelect>

                  <FilterIcon>
                    <ChevronDown size={15} />
                  </FilterIcon>
                </FilterSelectWrap>
              )}

              {extraToolbar}
            </ToolbarLeft>

            {toolbarRight && <ToolbarRight>{toolbarRight}</ToolbarRight>}
          </>
        )}
      </Toolbar>

      <Wrap $variant={variant}>
        <TableScroll>
          <StyledTable $variant={variant}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{
                      width: column.width || "auto",
                      textAlign:
                        column.headerAlign ||
                        headerAlign ||
                        column.align ||
                        "left",
                    }}
                  >
                    <HeaderButton
                      type="button"
                      $variant={variant}
                      $sortable={column.sortable !== false}
                      $align={
                        column.headerAlign ||
                        headerAlign ||
                        column.align ||
                        "left"
                      }
                      onClick={() => handleSort(column)}
                    >
                      <span>{column.title}</span>
                      {renderSortIcon(column)}
                    </HeaderButton>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pagedData.length > 0 ? (
                pagedData.map((row, rowIndex) => (
                  <tr key={row[rowKey] ?? rowIndex}>
                    {columns.map((column) => {
                      const value = row[column.key];

                      return (
                        <td
                          key={column.key}
                          style={{
                            textAlign: column.align || cellAlign || "left",
                          }}
                        >
                          {column.render ? column.render(value, row) : value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <EmptyCell colSpan={columns.length}>
                    데이터가 없습니다.
                  </EmptyCell>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableScroll>

        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      </Wrap>
    </Container>
  );
}

export function RowActionButton({ onClick }) {
  return (
    <StyledRowActionButton type="button" onClick={onClick}>
      <MoreHorizontal size={16} />
    </StyledRowActionButton>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
`;

const Wrap = styled.div`
  width: 100%;
  background: white;
  overflow: hidden;

  ${({ $variant }) =>
    $variant === "inventory" &&
    css`
      border-radius: 16px;
      padding: 15px;
      box-shadow: var(--shadow);
    `}
  ${({ $variant }) =>
    $variant === "price" &&
    css`
      border-radius: 16px;
      padding: 15px;
      box-shadow: var(--shadow);
    `}
    ${({ $variant }) =>
    $variant === "default" &&
    css`
      border-radius: 16px;
      padding: 15px;
      box-shadow: var(--shadow);
    `};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  ${({ $variant }) =>
    $variant === "inventory"
      ? css`
          padding: 14px 14px 12px;
          margin-bottom: 0;
        `
      : css`
          margin-bottom: 10px;
        `}
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  gap: 10px;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
`;

const CustomToolbarWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const SearchWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: ${({ $variant }) =>
    $variant === "inventory" ? "224px" : "240px"};

  @media (max-width: 900px) {
    max-width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: var(--placeholder);
  }

  ${({ $variant }) =>
    $variant === "inventory"
      ? css`
          height: 44px;
          padding: 0 36px 0 14px;
          border: 1px solid var(--border);

          &:focus {
            border-color: var(--border);
          }
        `
      : css`
          height: 38px;
          padding: 0 34px 0 14px;
          border: 1px solid var(--border);

          &:focus {
            border-color: var(--focus-border);
          }
        `}
`;

const FilterSelectWrap = styled.div`
  position: relative;
  min-width: ${({ $variant }) =>
    $variant === "inventory" ? "126px" : "180px"};

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  border-radius: 10px;
  background: #ffffff;
  font-size: 13px;
  outline: none;
  appearance: none;
  cursor: pointer;

  ${({ $variant }) =>
    $variant === "inventory"
      ? css`
          height: 44px;
          padding: 0 34px 0 14px;
          border: 1px solid var(--border);
          color: var(--placeholder);

          &:focus {
            border-color: var(--border-focus);
          }
        `
      : css`
          height: 38px;
          padding: 0 34px 0 14px;
          border: 1px solid var(--border);
          color: var(--placeholder);

          &:focus {
            border-color: var(--border-focus);
          }
        `}
`;

const FilterIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: ${({ $variant }) =>
    $variant === "inventory" ? "1280px" : "1200px"};

  thead th {
    white-space: nowrap;
    background: #ffffff;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  ${({ $variant }) =>
    $variant === "inventory"
      ? css`
          thead th {
            padding: 16px 14px;
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            color: var(--placeholder);
            font-size: 12px;
            font-weight: 600;
            text-transform: none;
            letter-spacing: normal;
          }

          tbody td {
            position: relative;
            padding: 16px 14px;
            border-bottom: 1px solid var(--border);
            color: var(--font);
            font-size: 12px;
            white-space: nowrap;
            vertical-align: middle;
            background: #ffffff;
          }

          tbody tr:hover td {
            background: var(--hover-bg);
          }
        `
      : css`
          thead th {
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
            color: var(--placeholder);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          tbody td {
            position: relative;
            padding: 16px 14px;
            border-bottom: 1px solid var(--border);
            color: var(--font);
            font-size: 12px;
            white-space: nowrap;
            vertical-align: middle;
            background: #ffffff;
          }

          tbody tr:hover td {
            background: var(--hover-bg);
          }
        `}
`;

const HeaderButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === "center"
      ? "center"
      : $align === "right"
        ? "flex-end"
        : "flex-start"};
  gap: ${({ $variant }) => ($variant === "inventory" ? "4px" : "6px")};
  color: inherit;
  font: inherit;
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};

  svg {
    color: var(--placeholder);

    flex-shrink: 0;
  }
`;

const EmptyCell = styled.td`
  padding: 40px 16px !important;
  text-align: center !important;
  color: var(--placeholder) !important;
  font-size: 12px !important;
`;

const StyledRowActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
