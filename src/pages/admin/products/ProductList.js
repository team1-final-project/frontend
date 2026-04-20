import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Plus } from "lucide-react";
import SummaryCard from "../../../components/SummaryCard";
import TableComponent from "../../../components/TableComponent";
import StatusBadge from "../../../components/StatusBadge";
import ToggleSwitch from "../../../components/ToggleSwitch";
import { getCategories } from "../../../api/category";
import {
  getAdminProductList,
  updateAdminProductAiPricing,
} from "../../../api/adminProduct";

const statusStyleMap = {
  판매중: { label: "판매중", variant: "success" },
  일시품절: { label: "일시품절", variant: "warning" },
  품절: { label: "품절", variant: "danger" },
};

const salesStatusLabelMap = {
  ON_SALE: "판매중",
  READY: "판매예정",
  STOPPED: "판매중지",
  SOLD_OUT: "품절",
  ENDED: "판매종료",
};

function mapSaleStatusLabel(value) {
  return salesStatusLabelMap[value] || value || "-";
}

function formatUpdatedAt(value) {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

function formatNumber(value) {
  return `${Number(value).toLocaleString()}원`;
}

function toDateValue(dateTimeText) {
  return dateTimeText?.split(" ")[0] ?? "";
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [summary, setSummary] = useState({
    totalCount: 0,
    saleCount: 0,
    soldOutCount: 0,
    aiEnabledCount: 0,
  });

  const nav = useNavigate();

  const categoryOptions = useMemo(() => {
    return categories.flatMap((mainCategory) =>
      (mainCategory.subCategories || []).map((subCategory) => ({
        label: `${mainCategory.name} > ${subCategory.name}`,
        value: String(subCategory.id),
      })),
    );
  }, [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error(error);
        alert("카테고리 목록 조회에 실패했습니다.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getAdminProductList({
          keyword: searchValue.trim() || undefined,
          category_id: categoryValue ? Number(categoryValue) : undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          page,
          size: pageSize,
        });

        const mappedItems = (data.items || []).map((item) => ({
          id: item.id,
          productCode: item.product_code,
          productName: item.product_name,
          category: item.category_name,
          price: item.sale_price,
          aiPricingEnabled: item.ai_pricing_enabled,
          stock: item.stock_qty,
          saleStatus: mapSaleStatusLabel(item.sale_status),
          updatedAt: formatUpdatedAt(item.updated_at),
        }));

        setProducts(mappedItems);

        setSummary({
          totalCount: data.summary?.total_count || 0,
          saleCount: data.summary?.sale_count || 0,
          soldOutCount: data.summary?.sold_out_count || 0,
          aiEnabledCount: data.summary?.ai_enabled_count || 0,
        });

        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error(error);
        alert(
          error?.response?.data?.detail || "상품 목록 조회에 실패했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchValue, categoryValue, startDate, endDate, page, pageSize]);

  const handleToggleAiPricing = async (id, nextChecked) => {
    const previousProducts = products;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, aiPricingEnabled: nextChecked } : item,
      ),
    );

    setSummary((prev) => ({
      ...prev,
      aiEnabledCount: nextChecked
        ? prev.aiEnabledCount + 1
        : Math.max(0, prev.aiEnabledCount - 1),
    }));

    try {
      await updateAdminProductAiPricing(id, nextChecked);
    } catch (error) {
      console.error(error);

      setProducts(previousProducts);

      setSummary((prev) => ({
        ...prev,
        aiEnabledCount: nextChecked
          ? Math.max(0, prev.aiEnabledCount - 1)
          : prev.aiEnabledCount + 1,
      }));

      alert(
        error?.response?.data?.detail ||
          "AI 가격변경 상태 변경에 실패했습니다.",
      );
    }
  };

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
      key: "aiPricingEnabled",
      title: "AI 가격변경",
      width: "120px",
      align: "center",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <ToggleSwitch
            checked={value}
            onChange={(nextChecked) =>
              handleToggleAiPricing(row.id, nextChecked)
            }
          />
        </CenterCell>
      ),
    },

    {
      key: "stock",
      title: "재고",
      width: "90px",
      sortType: "number",
      render: (value) => `${Number(value).toLocaleString()}개`,
    },
    {
      key: "saleStatus",
      title: "판매상태",
      width: "110px",
      sortable: false,
      render: (value) => {
        const status = statusStyleMap[value] || {
          label: value,
          variant: "info",
        };

        return (
          <StatusBadge
            value={status.label}
            variant={status.variant}
            width="88px"
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
      <HeaderRow>
        <Title>상품 목록</Title>
      </HeaderRow>

      <SummaryGrid>
        <SummaryCard
          title="전체 상품 수"
          value={
            <>
              {summary.totalCount}
              <span>SKU</span>
            </>
          }
          change="6 SKU"
          up
        />
        <SummaryCard
          title="판매 중"
          value={
            <>
              {summary.saleCount}
              <span>SKU</span>
            </>
          }
          change="1 SKU"
          up={false}
        />
        <SummaryCard
          title="품절"
          value={
            <>
              {summary.soldOutCount}
              <span>SKU</span>
            </>
          }
          change="1 SKU"
          up
        />
        <SummaryCard
          title="AI 가격변경"
          value={
            <>
              {summary.aiEnabledCount}
              <span>SKU</span>
            </>
          }
          change="0 SKU"
          up
        />
      </SummaryGrid>

      <TableComponent
        columns={columns}
        data={products}
        headerAlign="center"
        cellAlign="center"
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
        filterPlaceholder="전체"
        filterOptions={categoryOptions}
        extraToolbar={
          <DateFilterGroup>
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
          </DateFilterGroup>
        }
        toolbarRight={
          <PrimaryButton
            type="button"
            onClick={() => nav("/admin/product-regist")}
          >
            <Plus size={15} />
            상품등록
          </PrimaryButton>
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
  padding: 25px;
  background: var(--background);
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
  font-size: var(--title);
  font-weight: 700;
`;

const PrimaryButton = styled.button`
  height: 35px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }

  & svg {
    color: white;
  }
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

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const DateInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
  color: var(--font);
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: var(--focus-border);
  }
`;

const DateDivider = styled.span`
  color: var(--placeholder);
  font-size: 13px;
  font-weight: 600;
`;

const ProductNameLink = styled.a`
  display: block;
  min-width: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;

const SubText = styled.span`
  color: var(--font);
  font-size: 12px;
`;

const CenterCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CodeLink = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: var(--font);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: var(--blue);
    text-decoration: underline;
  }
`;
