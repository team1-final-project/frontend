import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Package, Megaphone, AlertTriangle, ShoppingBag } from "lucide-react";
import TableComponent from "../../components/TableComponent";
import StatusBadge from "../../components/StatusBadge";

const initialProducts = [
  {
    id: 1,
    productCode: "9744302255",
    productName: "농심 신라면컵 114g, 1개",
    category: "가공 / 간식류 > 라면",
    price: 1250,
    isVisible: true,
    minPrice: 900,
    maxPrice: 1500,
    stock: 11111,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 2,
    productCode: "12277099725",
    productName: "농심 짜파게티 큰사발 90g, 1개",
    category: "간식 / 음료 > 스낵식사",
    price: 5700,
    isVisible: false,
    minPrice: 0,
    maxPrice: 0,
    stock: 30,
    saleStatus: "임시중지",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 3,
    productCode: "6156192012",
    productName: "CJ 비비고 사골곰탕 500g, 18개",
    category: "가공 / 간식류 > 즉석식품",
    price: 21400,
    isVisible: false,
    minPrice: 19000,
    maxPrice: 24900,
    stock: 0,
    saleStatus: "품절",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 4,
    productCode: "5909188198",
    productName: "코카콜라 클래식 1.5L, 12개",
    category: "간식 / 음료 > 탄산음료",
    price: 34080,
    isVisible: false,
    minPrice: 29000,
    maxPrice: 39000,
    stock: 12347,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 5,
    productCode: "5909188199",
    productName: "코카콜라 제로 1.5L, 12개",
    category: "간식 / 음료 > 탄산음료",
    price: 34080,
    isVisible: true,
    minPrice: 29000,
    maxPrice: 39000,
    stock: 4321,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 6,
    productCode: "5909188200",
    productName: "칠성사이다 1.5L, 12개",
    category: "간식 / 음료 > 탄산음료",
    price: 31800,
    isVisible: true,
    minPrice: 28000,
    maxPrice: 36500,
    stock: 842,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 7,
    productCode: "5909188201",
    productName: "웅진 하늘보리 500ml, 20개",
    category: "간식 / 음료 > 차음료",
    price: 17800,
    isVisible: true,
    minPrice: 15900,
    maxPrice: 19800,
    stock: 115,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 8,
    productCode: "5909188202",
    productName: "오리온 초코파이 468g, 1개",
    category: "간식 / 음료 > 과자",
    price: 4850,
    isVisible: false,
    minPrice: 4300,
    maxPrice: 5900,
    stock: 71,
    saleStatus: "임시중지",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 9,
    productCode: "5909188203",
    productName: "삼립 정통 크림빵 3입",
    category: "가공 / 간식류 > 빵류",
    price: 2980,
    isVisible: true,
    minPrice: 2500,
    maxPrice: 3500,
    stock: 12,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 10,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 11,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 12,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 13,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 14,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 15,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 16,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 17,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 18,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 19,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
  {
    id: 20,
    productCode: "5909188204",
    productName: "팔도 비빔면 130g, 5개",
    category: "가공 / 간식류 > 라면",
    price: 5980,
    isVisible: true,
    minPrice: 5200,
    maxPrice: 6800,
    stock: 8,
    saleStatus: "판매중",
    updatedAt: "2026/04/07 09:07",
  },
];

const categoryOptions = [
  { label: "전체 카테고리", value: "" },
  { label: "가공 / 간식류 > 라면", value: "가공 / 간식류 > 라면" },
  { label: "간식 / 음료 > 스낵식사", value: "간식 / 음료 > 스낵식사" },
  { label: "가공 / 간식류 > 즉석식품", value: "가공 / 간식류 > 즉석식품" },
  { label: "간식 / 음료 > 탄산음료", value: "간식 / 음료 > 탄산음료" },
  { label: "간식 / 음료 > 차음료", value: "간식 / 음료 > 차음료" },
  { label: "간식 / 음료 > 과자", value: "간식 / 음료 > 과자" },
  { label: "가공 / 간식류 > 빵류", value: "가공 / 간식류 > 빵류" },
];

const statusStyleMap = {
  판매중: { label: "판매중", variant: "success" },
  임시중지: { label: "임시중지", variant: "warning" },
  품절: { label: "품절", variant: "danger" },
};

function formatNumber(value) {
  return `${Number(value).toLocaleString()}원`;
}

function ProductSummaryCard({ title, value, diff, diffType = "up", icon }) {
  return (
    <Card>
      <CardTop>
        <CardTitle>{title}</CardTitle>
        <CardIconWrap>{icon}</CardIconWrap>
      </CardTop>

      <CardValue>{value}</CardValue>

      <CardBottom $type={diffType}>
        <span>{diffType === "up" ? "↑" : "↓"}</span>
        <span>{diff}</span>
        <CardSubText>vs Yesterday</CardSubText>
      </CardBottom>
    </Card>
  );
}

function VisibilityToggle({ checked, onClick }) {
  return (
    <ToggleButton type="button" $checked={checked} onClick={onClick}>
      <ToggleThumb $checked={checked} />
    </ToggleButton>
  );
}

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const summary = useMemo(() => {
    const totalCount = products.length;
    const saleCount = products.filter(
      (item) => item.saleStatus === "판매중",
    ).length;
    const soldOutCount = products.filter(
      (item) => item.saleStatus === "품절",
    ).length;
    const hiddenCount = products.filter((item) => !item.isVisible).length;

    return {
      totalCount,
      saleCount,
      soldOutCount,
      hiddenCount,
    };
  }, [products]);

  const filteredData = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return products.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.productCode.toLowerCase().includes(keyword) ||
        item.productName.toLowerCase().includes(keyword);

      const matchesCategory = categoryValue
        ? item.category === categoryValue
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchValue, categoryValue]);

  const handleToggleVisible = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item,
      ),
    );
  };

  const columns = [
    {
      key: "productCode",
      title: "상품코드",
      width: "120px",
      render: (value) => <CodeText>{value}</CodeText>,
    },
    {
      key: "productName",
      title: "상품명",
      width: "260px",
      render: (value) => <ProductName>{value}</ProductName>,
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
      key: "isVisible",
      title: "노출",
      width: "80px",
      align: "center",
      sortable: false,
      render: (value, row) => (
        <CenterCell>
          <VisibilityToggle
            checked={value}
            onClick={() => handleToggleVisible(row.id)}
          />
        </CenterCell>
      ),
    },
    {
      key: "minPrice",
      title: "최저가판매",
      width: "110px",
      sortType: "number",
      render: (value) => (value > 0 ? formatNumber(value) : "-"),
    },
    {
      key: "maxPrice",
      title: "최고가판매",
      width: "110px",
      sortType: "number",
      render: (value) => (value > 0 ? formatNumber(value) : "-"),
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
        <PrimaryButton type="button">상품등록</PrimaryButton>
      </HeaderRow>

      <SummaryGrid>
        <ProductSummaryCard
          title="전체 상품 수"
          value={`${summary.totalCount}개`}
          diff="6개"
          diffType="up"
          icon={<Package size={18} />}
        />
        <ProductSummaryCard
          title="판매 중"
          value={`${summary.saleCount}개`}
          diff="1개"
          diffType="down"
          icon={<Megaphone size={18} />}
        />
        <ProductSummaryCard
          title="품절"
          value={`${summary.soldOutCount}개`}
          diff="1개"
          diffType="up"
          icon={<AlertTriangle size={18} />}
        />
        <ProductSummaryCard
          title="판매중지"
          value={`${summary.hiddenCount}개`}
          diff="6개"
          diffType="up"
          icon={<ShoppingBag size={18} />}
        />
      </SummaryGrid>

      <TableSection>
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
          filterOptions={categoryOptions.filter((item) => item.value !== "")}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </TableSection>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100%;
`;

const HeaderRow = styled.div`
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
`;

const PrimaryButton = styled.button`
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
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

const Card = styled.div`
  padding: 16px 18px;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
`;

const CardTop = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const CardTitle = styled.div`
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
`;

const CardIconWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f3f6fb;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardValue = styled.div`
  margin-bottom: 8px;
  color: #111827;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $type }) => ($type === "up" ? "#16a34a" : "#ef4444")};
  font-size: 12px;
  font-weight: 700;
`;

const CardSubText = styled.span`
  margin-left: 4px;
  color: #9ca3af;
  font-weight: 500;
`;

const TableSection = styled.div`
  width: 100%;
`;

const CodeText = styled.strong`
  color: #111827;
  font-weight: 700;
`;

const ProductName = styled.div`
  min-width: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
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

const ToggleButton = styled.button`
  position: relative;
  width: 34px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? "#2563eb" : "#d1d5db")};
  cursor: pointer;
  padding: 0;
  transition: background 0.15s ease;
`;

const ToggleThumb = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => ($checked ? "16px" : "2px")};
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  transition: left 0.15s ease;
`;
