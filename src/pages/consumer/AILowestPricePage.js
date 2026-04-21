import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import * as S from "./AILowestPricePage.styles";
import { aiLowestCategories, aiLowestProducts } from "./aiLowestPriceMock";

function formatPrice(value) {
  return `${value.toLocaleString()}원`;
}

// 0원을 하단 기준으로 두고, 최고가를 상단 기준으로 잡아
// 선이 축과 자연스럽게 맞도록 좌표를 계산
function getTrendPoints(points) {
  const max = Math.max(...points);
  const min = 0;
  const range = Math.max(max - min, 1);

  return points.map((value, index, array) => {
    const x = array.length === 1 ? 0 : (index / (array.length - 1)) * 100;
    // 위아래 여백 확보
    const y = 36 - ((value - min) / range) * 28;
    return { x, y };
  });
}

export default function AILowestPricePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("drop");

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    let result = aiLowestProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      const matchesKeyword =
        !normalizedKeyword ||
        product.name.toLowerCase().includes(normalizedKeyword) ||
        product.brand.toLowerCase().includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });

    result = [...result].sort((a, b) => {
      if (sortType === "priceLow") return a.currentPrice - b.currentPrice;
      if (sortType === "lowest") return a.lowestPrice - b.lowestPrice;
      if (sortType === "recommend") {
        return a.badgeType.localeCompare(b.badgeType);
      }
      return b.dropAmount - a.dropAmount;
    });

    return result;
  }, [selectedCategory, keyword, sortType]);

  const selectedCategoryName =
    aiLowestCategories.find((category) => category.id === selectedCategory)
      ?.name || "전체";

  const handleChangeCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setKeyword("");
  };

  return (
    <S.Page>
      <S.Inner>
        <S.PageHeader>
          <S.PageTitle>AI 최저가</S.PageTitle>
          <S.PageDescription>
            AI가 분석한 최저가 상품과 최근 가격 변동을 한눈에 확인하세요.
          </S.PageDescription>
        </S.PageHeader>

        <S.FilterPanel>
          <S.SectionLabel>카테고리 선택</S.SectionLabel>

          <S.CategoryRow>
            {aiLowestCategories.map((category) => (
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
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={`${selectedCategoryName} 내 상품 검색`}
              />
            </S.SearchBox>

            <S.SortSelect
              value={sortType}
              onChange={(event) => setSortType(event.target.value)}
            >
              <option value="drop">하락폭순</option>
              <option value="lowest">최저가순</option>
              <option value="priceLow">현재가 낮은순</option>
              <option value="recommend">AI 추천순</option>
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
          {filteredProducts.length > 0 ? (
            <S.ProductGrid>
              {filteredProducts.map((product) => {
                const chartPoints = getTrendPoints(product.trendPoints);
                const polylinePoints = chartPoints
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ");

                const leftMaxPrice = Math.max(...product.trendPoints);

                return (
                  <S.ProductCard key={product.id}>
                    <S.ProductTop>
                      <S.ProductThumb>
                        <S.ProductImage
                          src={product.image}
                          alt={product.name}
                        />
                      </S.ProductThumb>

                      <S.ProductMain>
                        <S.BrandText>{product.brand}</S.BrandText>
                        <S.ProductName>{product.name}</S.ProductName>

                        <S.AITag $tone={product.badgeType}>
                          {product.aiRecommendation}
                        </S.AITag>

                        <S.PriceSummary>
                          <S.InfoCard>
                            <S.InfoLabel>현재가</S.InfoLabel>
                            <S.InfoValue>
                              {formatPrice(product.currentPrice)}
                            </S.InfoValue>
                          </S.InfoCard>

                          <S.InfoCard>
                            <S.InfoLabel>최근 최저가</S.InfoLabel>
                            <S.InfoValue>
                              {formatPrice(product.lowestPrice)}
                            </S.InfoValue>
                          </S.InfoCard>

                          <S.InfoCard>
                            <S.InfoLabel>하락폭</S.InfoLabel>
                            <S.DropValue>
                              -{formatPrice(product.dropAmount)}
                            </S.DropValue>
                          </S.InfoCard>
                        </S.PriceSummary>
                      </S.ProductMain>
                    </S.ProductTop>

                    <S.ProductBottom>
                      <S.AIBox>
                        <S.AIBoxTitle>AI 추천 코멘트</S.AIBoxTitle>
                        <S.AIBoxDescription>
                          {product.aiDescription}
                        </S.AIBoxDescription>
                      </S.AIBox>

                      <S.TrendSection>
                        <S.TrendHeaderRow>
                          <S.TrendLabel>최근 가격 추이</S.TrendLabel>

                          <S.PeriodTabRow>
                            <S.PeriodChip $active>1개월</S.PeriodChip>
                            <S.PeriodChip>3개월</S.PeriodChip>
                            <S.PeriodChip>6개월</S.PeriodChip>
                          </S.PeriodTabRow>
                        </S.TrendHeaderRow>

                        <S.TrendChartWrap>
                          <S.TrendYAxis>
                            <S.TrendYAxisValue>
                              {leftMaxPrice.toLocaleString()}원
                            </S.TrendYAxisValue>
                            <S.TrendYAxisValue>&nbsp;</S.TrendYAxisValue>
                            <S.TrendYAxisValue>
                              {product.currentPrice.toLocaleString()}원
                            </S.TrendYAxisValue>
                            <S.TrendYAxisValue>&nbsp;</S.TrendYAxisValue>
                            <S.TrendYAxisValue>0원</S.TrendYAxisValue>
                          </S.TrendYAxis>

                          <S.ChartArea>
                            <S.SimpleTrendChart>
                              <S.ChartGuideLine $top="0%" />
                              <S.ChartGuideLine $top="25%" />
                              <S.ChartGuideLine $top="50%" />
                              <S.ChartGuideLine $top="75%" />
                              <S.ChartGuideLine $top="100%" />

                              <S.SimpleTrendSvg
                                viewBox="0 0 100 40"
                                preserveAspectRatio="none"
                              >
                                <polyline
                                  fill="none"
                                  stroke="#2f6fd6"
                                  strokeWidth="1.4"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                  points={polylinePoints}
                                />

                                {chartPoints.map((point, index) => (
                                  <circle
                                    key={index}
                                    cx={point.x}
                                    cy={point.y}
                                    r="1.6"
                                    fill="#ffffff"
                                    stroke="#2f6fd6"
                                    strokeWidth="1.2"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                ))}
                              </S.SimpleTrendSvg>
                            </S.SimpleTrendChart>

                            <S.TrendBottomWrap>
                              <S.TrendDateRow>
                                {product.trendLabels.map((label) => (
                                  <S.TrendDate key={label}>{label}</S.TrendDate>
                                ))}
                              </S.TrendDateRow>
                            </S.TrendBottomWrap>
                          </S.ChartArea>
                        </S.TrendChartWrap>
                      </S.TrendSection>

                      <S.ButtonRow>
                        <S.DetailButton to={`/products/${product.id}`}>
                          상세 보기
                        </S.DetailButton>
                      </S.ButtonRow>
                    </S.ProductBottom>
                  </S.ProductCard>
                );
              })}
            </S.ProductGrid>
          ) : (
            <S.EmptyBox>조건에 맞는 상품이 없어요.</S.EmptyBox>
          )}
        </S.GridSection>
      </S.Inner>
    </S.Page>
  );
}
