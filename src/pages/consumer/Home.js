import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import herosectionImg from "../../assets/sinramyeon banner.png";
import * as S from "./HomeStyles";
import { getHomeAiRanking } from "../../api/stats";

import { bestItems, hotDealItems, brandLogos } from "./HomeData";

import salesShinramyunImg from "../../assets/sales-shinramyun.png";
import salesCokezeroImg from "../../assets/sales-cokezero.png";
import salesCurryImg from "../../assets/sales-curry.png";
import salesHetbanImg from "../../assets/sales-hetban.png";

function StarRating({ rating }) {
  const numericRating = Number.parseFloat(rating) || 0;
  const percentage = Math.max(0, Math.min(100, (numericRating / 5) * 100));

  return (
    <S.StarsWrap aria-label={`평점 ${numericRating}점 / 5점`}>
      <S.StarsBase>★★★★★</S.StarsBase>
      <S.StarsFill $width={percentage}>★★★★★</S.StarsFill>
    </S.StarsWrap>
  );
}

function AIRankingSection({ data }) {
  const [selectedDropCategoryId, setSelectedDropCategoryId] = useState(
    data.priceDropTop5ByCategory?.[0]?.categoryId || "",
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    data.categories?.[0]?.id || "",
  );

  const [selectedProductId, setSelectedProductId] = useState(
    data.categories?.[0]?.products?.[0]?.id || "",
  );

  const [selectedPeriod, setSelectedPeriod] = useState("weekly");

  const selectedDropCategory =
    data.priceDropTop5ByCategory?.find(
      (category) => category.categoryId === selectedDropCategoryId,
    ) || data.priceDropTop5ByCategory?.[0];

  const maxDropAmount = Math.max(
    ...(selectedDropCategory?.items?.map((item) => item.dropAmount) || []),
    1,
  );

  useEffect(() => {
    if (!data.categories?.length) return;

    const currentCategory = data.categories.find(
      (category) => category.id === selectedCategoryId,
    );

    if (!currentCategory) {
      setSelectedCategoryId(data.categories[0].id);
      setSelectedProductId(data.categories[0].products?.[0]?.id || "");
      return;
    }

    const hasSelectedProduct = currentCategory.products?.some(
      (product) => product.id === selectedProductId,
    );

    if (!hasSelectedProduct) {
      setSelectedProductId(currentCategory.products?.[0]?.id || "");
    }
  }, [data, selectedCategoryId, selectedProductId]);

  const selectedCategory =
    data.categories?.find((category) => category.id === selectedCategoryId) ||
    data.categories?.[0];

  const selectedProduct =
    selectedCategory?.products?.find(
      (product) => product.id === selectedProductId,
    ) || selectedCategory?.products?.[0];

  const graphData =
    selectedPeriod === "weekly"
      ? selectedProduct?.weekly
      : selectedProduct?.monthly;

  return (
    <S.AIRankingSection>
      <S.AIRankingTitle>AI Ranking</S.AIRankingTitle>

      <S.AIRankingGrid>
        <S.AIRankingCard>
          <S.CardTop>
            <S.CardTitle>가격 하락폭 TOP 5</S.CardTitle>

            <S.SelectWrap>
              <S.SelectBox
                value={selectedDropCategoryId}
                onChange={(e) => setSelectedDropCategoryId(e.target.value)}
              >
                {data.priceDropTop5ByCategory?.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </S.SelectBox>
              <S.SelectArrowText>▾</S.SelectArrowText>
            </S.SelectWrap>
          </S.CardTop>

          <S.BarList>
            {selectedDropCategory?.items?.map((item, index) => (
              <S.BarItem key={item.name}>
                <S.BarItemTop>
                  <S.RankBadge>{index + 1}</S.RankBadge>

                  <S.BarMain>
                    <S.BarHeader>
                      <S.BarLabel>{item.name}</S.BarLabel>

                      <S.BarValueWrap>
                        <S.BarValue>
                          -{item.dropAmount.toLocaleString()}원
                        </S.BarValue>
                        <S.BarSubValue>-{item.dropRate}%</S.BarSubValue>
                      </S.BarValueWrap>
                    </S.BarHeader>

                    <S.BarTrack>
                      <S.BarFill
                        style={{
                          width: `${(item.dropAmount / maxDropAmount) * 100}%`,
                          background:
                            index === 0
                              ? "#f06464"
                              : index === 1
                                ? "#f27474"
                                : index === 2
                                  ? "#f48787"
                                  : index === 3
                                    ? "#f4a0a0"
                                    : "#f6b3b3",
                        }}
                      />
                    </S.BarTrack>
                  </S.BarMain>
                </S.BarItemTop>

                {index !== selectedDropCategory.items.length - 1 && (
                  <S.BarDivider />
                )}
              </S.BarItem>
            ))}
          </S.BarList>
        </S.AIRankingCard>

        <S.AIRankingCard>
          <S.CardTop>
            <S.CardTitle>AI 분석 주간 정보</S.CardTitle>

            <S.TopActions>
              <S.SelectWrap>
                <S.SelectBox
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  {data.categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </S.SelectBox>
                <S.SelectArrow />
              </S.SelectWrap>

              <S.MoreLink type="button">더보기</S.MoreLink>
            </S.TopActions>
          </S.CardTop>

          <S.MiniTable>
            <thead>
              <tr>
                <th>SN</th>
                <th>
                  <S.InnerSelectWrap>
                    <S.InnerSelect
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      {selectedCategory?.products?.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </S.InnerSelect>
                    <S.InnerSelectArrow />
                  </S.InnerSelectWrap>
                </th>
                <th>금주</th>
                <th>7일전 대비</th>
                <th>2주전 대비</th>
              </tr>
            </thead>
            <tbody>
              {selectedProduct && (
                <tr>
                  <td>5</td>
                  <td>{selectedProduct.name}</td>
                  <td>{selectedProduct.currentPrice.toLocaleString()}</td>
                  <td>
                    <S.NegativeValue>
                      {selectedProduct.weekCompare > 0 ? "+" : ""}
                      {selectedProduct.weekCompare}
                    </S.NegativeValue>
                  </td>
                  <td>
                    <S.PositiveValue>
                      {selectedProduct.twoWeekCompare > 0 ? "+" : ""}
                      {selectedProduct.twoWeekCompare}
                    </S.PositiveValue>
                  </td>
                </tr>
              )}
            </tbody>
          </S.MiniTable>

          <S.TabRow>
            <S.PeriodTab
              type="button"
              $active={selectedPeriod === "monthly"}
              onClick={() => setSelectedPeriod("monthly")}
            >
              월간
            </S.PeriodTab>
            <S.PeriodTab
              type="button"
              $active={selectedPeriod === "weekly"}
              onClick={() => setSelectedPeriod("weekly")}
            >
              주간
            </S.PeriodTab>
          </S.TabRow>

          <S.TrendChartWrap>
            <S.CustomChartArea>
              <S.YAxisColumn>
                {[60, 50, 40, 30, 20, 10].map((value) => (
                  <S.YAxisLabel key={value}>{value}</S.YAxisLabel>
                ))}
              </S.YAxisColumn>

              <S.ChartMain>
                <S.ChartGridLines>
                  {[...Array(6)].map((_, index) => (
                    <S.GridLine key={index} />
                  ))}
                </S.ChartGridLines>

                <S.PlotArea>
                  {graphData?.series?.map((series, index) => (
                    <S.LineSvg
                      key={index}
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        fill="none"
                        stroke={series.color}
                        strokeWidth="1.8"
                        points={series.values
                          .map((value, valueIndex) => {
                            const total = series.values.length;
                            const x =
                              total === 1
                                ? 0
                                : (valueIndex / (total - 1)) * 100;
                            const y = 100 - (value / 60) * 100;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />
                    </S.LineSvg>
                  ))}
                </S.PlotArea>

                <S.XAxisRow>
                  {graphData?.labels?.map((label) => (
                    <S.XAxisLabel key={label}>{label}</S.XAxisLabel>
                  ))}
                </S.XAxisRow>
              </S.ChartMain>

              <S.ChartLegendSide>
                {graphData?.series?.map((series, index) => (
                  <S.SideLegendItem key={index}>
                    <S.SideLegendLine style={{ background: series.color }} />
                    <S.SideLegendText>Value</S.SideLegendText>
                  </S.SideLegendItem>
                ))}
              </S.ChartLegendSide>
            </S.CustomChartArea>
          </S.TrendChartWrap>
        </S.AIRankingCard>
      </S.AIRankingGrid>

      <S.ViewAllButton type="button">더보기</S.ViewAllButton>
    </S.AIRankingSection>
  );
}

function ProductCard({ item }) {
  const isPositive = item.discount.trim().startsWith("+");

  return (
    <S.ProductCardWrap>
      <S.ProductThumb>
        <S.ProductImage
          src={item.image}
          alt={item.name}
          $scale={item.imageScale}
        />
      </S.ProductThumb>

      <S.ProductName to="/product-detail">{item.name}</S.ProductName>

      <S.RatingRow>
        <StarRating rating={item.rating} />
        <S.RatingText>{item.rating}</S.RatingText>
      </S.RatingRow>

      <S.PriceRow>
        <S.CurrentPrice>{item.price}</S.CurrentPrice>
        <S.OriginalPrice>{item.originalPrice}</S.OriginalPrice>
        <S.DiscountBadge $positive={isPositive}>
          {item.discount}
        </S.DiscountBadge>
      </S.PriceRow>
    </S.ProductCardWrap>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [aiRanking, setAiRanking] = useState({
    priceDropTop5ByCategory: [],
    categories: [],
  });

  useEffect(() => {
    const fetchAiRanking = async () => {
      try {
        const data = await getHomeAiRanking();
        setAiRanking(data);
      } catch (error) {
        console.error("AI Ranking 조회 실패:", error);
      }
    };

    fetchAiRanking();
  }, []);

  return (
    <S.Page>
      <S.HeroSection>
        <S.HeroCanvas>
          <S.HeroBaseImage src={herosectionImg} alt="메인 히어로" />

          <S.HeroOverlay>
            <S.HeroTitle>
              농심 辛라면
              <br />
              Stock+er 에서
              <br />
              최저가로 구매 !
            </S.HeroTitle>

            <S.HeroButton type="button" onClick={() => navigate("/signup")}>
              Buy Now
            </S.HeroButton>

            <S.StatsRow>
              <S.StatBlock>
                <S.StatValue>900만+</S.StatValue>
                <S.StatLabel>누적 구매</S.StatLabel>
              </S.StatBlock>

              <S.StatDivider />

              <S.StatBlock>
                <S.StatValue>8.9만+</S.StatValue>
                <S.StatLabel>리뷰 수</S.StatLabel>
              </S.StatBlock>

              <S.StatDivider />

              <S.StatBlock>
                <S.StatValue>10억$+</S.StatValue>
                <S.StatLabel>누적 수익액</S.StatLabel>
              </S.StatBlock>
            </S.StatsRow>
          </S.HeroOverlay>
        </S.HeroCanvas>
      </S.HeroSection>

      <S.BrandBar>
        <S.BrandCanvas>
          <S.BrandTrack>
            <S.BrandGroup>
              {brandLogos.map((logo) => (
                <S.BrandLogoItem key={logo.id}>
                  <S.BrandLogo
                    src={logo.src}
                    alt={logo.alt}
                    $scale={logo.scale}
                  />
                </S.BrandLogoItem>
              ))}
            </S.BrandGroup>

            <S.BrandGroup aria-hidden="true">
              {brandLogos.map((logo) => (
                <S.BrandLogoItem key={`clone-${logo.id}`}>
                  <S.BrandLogo
                    src={logo.src}
                    alt={logo.alt}
                    $scale={logo.scale}
                  />
                </S.BrandLogoItem>
              ))}
            </S.BrandGroup>
          </S.BrandTrack>
        </S.BrandCanvas>
      </S.BrandBar>

      <S.MainSection>
        <AIRankingSection data={aiRanking} />

        <S.SectionDivider />

        <S.MainSectionTitle>Best</S.MainSectionTitle>

        <S.CardGrid>
          {bestItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </S.CardGrid>

        <S.ViewAllButton type="button">View All</S.ViewAllButton>
      </S.MainSection>

      <S.SectionDivider />

      <S.MainSection>
        <S.MainSectionTitle>Hot Deal</S.MainSectionTitle>

        <S.CardGrid>
          {hotDealItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </S.CardGrid>

        <S.ViewAllButton type="button">View All</S.ViewAllButton>
      </S.MainSection>

      <S.SalesSection>
        <S.SalesPanel>
          <S.SectionTitle>Sales Item</S.SectionTitle>

          <S.SalesTopRow>
            <S.SalesImageCard $variant="shin">
              <S.SalesImage
                src={salesShinramyunImg}
                alt="신라면"
                $variant="shin"
              />
            </S.SalesImageCard>

            <S.SalesImageCard $variant="hetban">
              <S.SalesImage src={salesHetbanImg} alt="햇반" $variant="hetban" />
            </S.SalesImageCard>
          </S.SalesTopRow>

          <S.SalesBottomRow>
            <S.SalesWideImageCard $variant="curry">
              <S.SalesImage
                src={salesCurryImg}
                alt="3분카레"
                $variant="curry"
              />
            </S.SalesWideImageCard>

            <S.SalesSmallImageCard $variant="cokezero">
              <S.SalesImage
                src={salesCokezeroImg}
                alt="코카콜라제로"
                $variant="cokezero"
              />
            </S.SalesSmallImageCard>
          </S.SalesBottomRow>
        </S.SalesPanel>
      </S.SalesSection>
    </S.Page>
  );
}
