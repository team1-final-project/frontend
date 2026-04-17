import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import * as S from "./AllProductsPage.styles";
import { allProducts, productCategories } from "./allProductsMock";

function formatPrice(value) {
  return `${value.toLocaleString()}원`;
}

function getDiscountRate(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function renderStars(rating) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export default function AllProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    let result = allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      const matchesKeyword =
        !normalizedKeyword ||
        product.name.toLowerCase().includes(normalizedKeyword) ||
        product.brand.toLowerCase().includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });

    result = [...result].sort((a, b) => {
      if (sortType === "priceLow") return a.price - b.price;
      if (sortType === "priceHigh") return b.price - a.price;
      if (sortType === "ai") return a.badgeType.localeCompare(b.badgeType);
      return b.id - a.id;
    });

    return result;
  }, [selectedCategory, keyword, sortType]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const selectedCategoryName =
    productCategories.find((category) => category.id === selectedCategory)
      ?.name || "전체";

  const handleChangeCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setKeyword("");
    setCurrentPage(1);
  };

  const handleChangeKeyword = (event) => {
    setKeyword(event.target.value);
    setCurrentPage(1);
  };

  const handleChangeSort = (event) => {
    setSortType(event.target.value);
    setCurrentPage(1);
  };

  return (
    <S.Page>
      <S.Inner>
        <S.PageHeader>
          <S.PageTitle>전체 상품</S.PageTitle>
          <S.PageDescription>
            카테고리별 상품을 확인하고 원하는 상품을 검색해보세요.
          </S.PageDescription>
        </S.PageHeader>

        <S.FilterPanel>
          <S.SectionLabel>카테고리 선택</S.SectionLabel>

          <S.CategoryRow>
            {productCategories.map((category) => (
              <S.CategoryButton
                key={category.id}
                type="button"
                $active={selectedCategory === category.id}
                onClick={() => handleChangeCategory(category.id)}
              >
                {category.name}
              </S.CategoryButton>
            ))}
          </S.CategoryRow>

          <S.SearchSortRow>
            <S.SearchBox>
              <S.SearchIcon>
                <Search size={18} />
              </S.SearchIcon>
              <S.SearchInput
                value={keyword}
                onChange={handleChangeKeyword}
                placeholder={`${selectedCategoryName} 내 상품 검색`}
              />
            </S.SearchBox>

            <S.SortSelect value={sortType} onChange={handleChangeSort}>
              <option value="latest">최신순</option>
              <option value="priceLow">가격 낮은순</option>
              <option value="priceHigh">가격 높은순</option>
              <option value="ai">AI 추천순</option>
            </S.SortSelect>
          </S.SearchSortRow>

          <S.ResultRow>
            <S.ResultText>
              <S.ResultStrong>{selectedCategoryName}</S.ResultStrong> 카테고리 ·
              총 <S.ResultStrong>{filteredProducts.length}</S.ResultStrong>개
              상품
            </S.ResultText>
          </S.ResultRow>
        </S.FilterPanel>

        <S.GridSection>
          {pagedProducts.length > 0 ? (
            <S.ProductGrid>
              {pagedProducts.map((product) => {
                const discountRate = getDiscountRate(
                  product.price,
                  product.originalPrice,
                );

                return (
                  <S.ProductCard
                    key={product.id}
                    to={`/products/${product.id}`}
                  >
                    <S.ProductThumb>
                      <S.ProductImage src={product.image} alt={product.name} />
                    </S.ProductThumb>

                    <S.ProductBody>
                      <S.ProductName>{product.name}</S.ProductName>

                      <S.RatingRow>
                        <S.Stars>{renderStars(product.rating)}</S.Stars>
                        <S.RatingText>{product.rating}/5</S.RatingText>
                      </S.RatingRow>

                      <S.PriceRow>
                        <S.CurrentPrice>
                          {formatPrice(product.price)}
                        </S.CurrentPrice>

                        {product.originalPrice ? (
                          <S.OriginalPrice>
                            {formatPrice(product.originalPrice)}
                          </S.OriginalPrice>
                        ) : null}

                        {discountRate ? (
                          <S.DiscountBadge>-{discountRate}%</S.DiscountBadge>
                        ) : null}
                      </S.PriceRow>

                      <S.TagRow>
                        <S.ProductTag $tone={product.badgeType}>
                          {product.aiTag}
                        </S.ProductTag>
                      </S.TagRow>
                    </S.ProductBody>
                  </S.ProductCard>
                );
              })}
            </S.ProductGrid>
          ) : (
            <S.EmptyBox>조건에 맞는 상품이 없어요.</S.EmptyBox>
          )}
        </S.GridSection>

        {filteredProducts.length > pageSize ? (
          <S.PaginationRow>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <S.PageButton
                  key={page}
                  type="button"
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </S.PageButton>
              ),
            )}
          </S.PaginationRow>
        ) : null}
      </S.Inner>
    </S.Page>
  );
}
