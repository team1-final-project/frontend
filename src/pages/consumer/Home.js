import React from "react";
import { useNavigate } from "react-router-dom";
import herosectionImg from "../../assets/herosection.png";
import * as S from "./HomeStyles";

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
                <S.BrandLogoItem key={`clone-${logo.id} `}>
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
