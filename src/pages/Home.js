import React from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import herosectionImg from "../assets/herosection.png";
import brandlogosImg from "../assets/brandlogos.png";

import shinramyunImg from "../assets/shinramyeon.jpg";
import cocacolaImg from "../assets/cocacola.jpg";
import jjajangImg from "../assets/jjajang.jpg";
import potetochipImg from "../assets/potetochip.webp";
import seawookkangImg from "../assets/seowookkang.webp";
import sosiziImg from "../assets/sosizi.jpg";

const bestItems = [
  {
    id: 1,
    name: "농심 신라면, 120g, 5개",
    rating: "4.5/5",
    price: "4,150원",
    originalPrice: "5,000원",
    discount: "-17%",
    image: shinramyunImg,
    imageScale: 0.70,

  },
  {
    id: 2,
    name: "코카콜라 캔 190ml, 30개",
    rating: "3.5/5",
    price: "16,630원",
    originalPrice: "33,690원",
    discount: "-50%",
    image: cocacolaImg,
    imageScale: 0.79,

  },
  {
    id: 3,
    name: "오뚜기 3분 쇠고기 짜장 200g, 1개",
    rating: "4.5/5",
    price: "980원",
    originalPrice: "840원",
    discount: "+16%",
    image: jjajangImg,
    imageScale: 0.69,

  },
  {
    id: 4,
    name: "농심 포테토칩 오리지널 60g, 1개",
    rating: "4.5/5",
    price: "5,480원",
    originalPrice: "5,680원",
    discount: "-4%",
    image: potetochipImg,
    imageScale: 0.82,

  },
];

const hotDealItems = [
  {
    id: 1,
    name: "농심 새우깡 오리지널, 90g, 1개",
    rating: "5.0/5",
    price: "900원",
    originalPrice: "1,050원",
    discount: "-14%",
    image: seawookkangImg,
    imageScale: 0.82,

  },
  {
    id: 2,
    name: "롯데 맛있는 비엔나 소시지 1kg, 1개",
    rating: "4.0/5",
    price: "5,860원",
    originalPrice: "7,250원",
    discount: "-19%",
    image: sosiziImg,
    imageScale: 0.75,

  },
  {
    id: 3,
    name: "코카콜라 캔 190ml, 30개",
    rating: "3.5/5",
    price: "16,630원",
    originalPrice: "33,690원",
    discount: "-50%",
    image: cocacolaImg,
    imageScale: 0.82,

  },
  {
    id: 4,
    name: "농심 신라면, 120g, 5개",
    rating: "4.5/5",
    price: "4,150원",
    originalPrice: "5,000원",
    discount: "-17%",
    image: shinramyunImg,
    imageScale: 0.82,

  },
];

function ProductCard({ item }) {
  const isPositive = item.discount.trim().startsWith("+");

  return (
    <ProductCardWrap>
      <ProductThumb>
        <ProductImage src={item.image} alt={item.name} $scale={item.imageScale} />
      </ProductThumb>

      <ProductName to="/product-detail">{item.name}</ProductName>

      <RatingRow>
        <Stars>★★★★★</Stars>
        <RatingText>{item.rating}</RatingText>
      </RatingRow>

      <PriceRow>
        <CurrentPrice>{item.price}</CurrentPrice>
        <OriginalPrice>{item.originalPrice}</OriginalPrice>
        <DiscountBadge $positive={isPositive}>{item.discount}</DiscountBadge>
      </PriceRow>
    </ProductCardWrap>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <Page>
      <HeroSection>
        <HeroCanvas>
          <HeroBaseImage src={herosectionImg} alt="메인 히어로" />

          <HeroOverlay>
            <HeroTitle>
              농심 辛라면
              <br />
              Stock+er 에서
              <br />
              최저가로 구매 !
            </HeroTitle>

            <HeroButton type="button" onClick={() => navigate("/signup")}>
              Buy Now
            </HeroButton>

            <StatsRow>
              <StatBlock>
                <StatValue>900만+</StatValue>
                <StatLabel>누적 구매</StatLabel>
              </StatBlock>

              <StatDivider />

              <StatBlock>
                <StatValue>8.9만+</StatValue>
                <StatLabel>리뷰 수</StatLabel>
              </StatBlock>

              <StatDivider />

              <StatBlock>
                <StatValue>10억$+</StatValue>
                <StatLabel>누적 수익액</StatLabel>
              </StatBlock>
            </StatsRow>
          </HeroOverlay>
        </HeroCanvas>
      </HeroSection>

      <BrandBar>
        <BrandCanvas>
          <BrandLogosImage src={brandlogosImg} alt="브랜드 로고" />
        </BrandCanvas>
      </BrandBar>

      <MainSection>
        <SectionTitle>Best</SectionTitle>

        <CardGrid>
          {bestItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </CardGrid>

        <ViewAllButton type="button">View All</ViewAllButton>
      </MainSection>

      <SectionDivider />

      <MainSection>
        <SectionTitle>Hot Deal</SectionTitle>

        <CardGrid>
          {hotDealItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </CardGrid>

        <ViewAllButton type="button">View All</ViewAllButton>
      </MainSection>

      <SalesSection>
        <SectionTitle>Sales Item</SectionTitle>

        <SalesPanel>
          <SalesTopRow>
            <SalesCard>
              <SalesTitle>신라면</SalesTitle>
              <MiniRamenCard />
            </SalesCard>

            <SalesCard>
              <SalesTitle>햇반</SalesTitle>
              <RiceCard />
            </SalesCard>
          </SalesTopRow>

          <SalesBottomRow>
            <SalesWideCard>
              <SalesTitle>3분카레</SalesTitle>
              <CurryCard />
            </SalesWideCard>

            <SalesSmallCard>
              <SalesTitle>코카콜라제로</SalesTitle>
              <CokeZeroCard>
                <Can />
                <Can />
                <Can />
                <Can />
              </CokeZeroCard>
            </SalesSmallCard>
          </SalesBottomRow>
        </SalesPanel>
      </SalesSection>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  background: #efefef;
`;

const HeroSection = styled.section`
  width: 100%;
  background: #e7dccd;
`;

const HeroCanvas = styled.div`
  position: relative;
  width: 100%;
  max-width: 1265px;
  margin: 0 auto;
`;

const HeroBaseImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  pointer-events: none;
`;

const HeroOverlay = styled.div`
  position: absolute;
  left: 4.1%;
  top: 16.4%;
  width: 29.2%;
  z-index: 2;

  @media (max-width: 900px) {
    width: 31%;
    left: 4%;
    top: 15%;
  }

  @media (max-width: 640px) {
    width: 33%;
    left: 4%;
    top: 14%;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(18px, 4.35vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.06em;
  font-weight: 900;
  color: #111111;
`;

const HeroButton = styled.button`
  width: clamp(74px, 9vw, 138px);
  height: clamp(28px, 3vw, 44px);
  margin-top: clamp(14px, 2.2vw, 36px);
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: clamp(8px, 1vw, 13px);
  font-weight: 700;
`;

const StatsRow = styled.div`
  margin-top: clamp(20px, 4.1vw, 56px);
  display: flex;
  align-items: flex-start;
  gap: clamp(10px, 1.5vw, 22px);

  @media (max-width: 560px) {
    display: none;
  }
`;

const StatBlock = styled.div`
  min-width: 0;
`;

const StatValue = styled.div`
  font-size: clamp(16px, 2.5vw, 42px);
  line-height: 1;
  letter-spacing: -0.05em;
  font-weight: 900;
  color: #111111;
  white-space: nowrap;
`;

const StatLabel = styled.div`
  margin-top: 4px;
  font-size: clamp(7px, 0.72vw, 12px);
  font-weight: 600;
  color: #7d7368;
  white-space: nowrap;
`;

const StatDivider = styled.div`
  width: 1px;
  height: clamp(24px, 3vw, 52px);
  background: rgba(17, 17, 17, 0.12);
  margin-top: 1px;
`;

const BrandBar = styled.section`
  width: 100%;
  background: #000000;
`;

const BrandCanvas = styled.div`
  width: 100%;
  max-width: 1265px;
  margin: 0 auto;
`;

const BrandLogosImage = styled.img`
  display: block;
  width: 100%;
  height: 81px;
`;

const MainSection = styled.section`
  max-width: 1265px;
  margin: 0 auto;
  padding: 42px 52px 18px;

  @media (max-width: 1100px) {
    padding: 34px 20px 18px;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 30px;
  line-height: 1;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.05em;
  margin-bottom: 42px;

  @media (max-width: 900px) {
    font-size: 42px;
    margin-bottom: 26px;
  }

  @media (max-width: 640px) {
    font-size: 34px;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCardWrap = styled.article``;

const ProductThumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: #FFF;
  overflow: hidden;
`;

const ProductImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  background-color: #FFF;
  object-fit: contain;
  transform: scale(${({ $scale }) => $scale || 1});
  transform-origin: center;
`;

const ProductName = styled(Link)`
  display: block;
  margin-top: 14px;
  font-size: 16px;
  line-height: 1.55;
  font-weight: 700;
  color: #111111;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const Stars = styled.span`
  color: #ffbf1a;
  font-size: 17px;
  letter-spacing: 0.8px;
`;

const RatingText = styled.span`
  color: #8d857b;
  font-size: 13px;
  font-weight: 600;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const CurrentPrice = styled.span`
  font-size: 17px;
  font-weight: 900;
  color: #111111;
`;

const OriginalPrice = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #999189;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${({ $positive }) => ($positive ? "#dfeeff" : "#f5dddd")};
  color: ${({ $positive }) => ($positive ? "#2f6fd6" : "#c66a6a")};
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
`;

const ViewAllButton = styled.button`
  display: block;
  width: 170px;
  height: 46px;
  margin: 32px auto 36px;
  border-radius: 999px;
  border: 1px solid #d7cfc4;
  background: transparent;
  color: #111111;
  font-size: 13px;
  font-weight: 500;
`;

const SectionDivider = styled.div`
  max-width: 1265px;
  height: 1px;
  margin: 0 auto;
  background: #dfd9d1;
`;

const SalesSection = styled.section`
  max-width: 1265px;
  margin: 0 auto;
  padding: 34px 40px 60px;

  @media (max-width: 1100px) {
    padding: 34px 20px 48px;
  }
`;

const SalesPanel = styled.div`
  border-radius: 28px;
  background: #dddddd;
  padding: 20px;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

const SalesTopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SalesBottomRow = styled.div`
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SalesCardBase = styled.article`
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: #e9dece;
`;

const SalesCard = styled(SalesCardBase)`
  height: 260px;
`;

const SalesWideCard = styled(SalesCardBase)`
  height: 220px;
`;

const SalesSmallCard = styled(SalesCardBase)`
  height: 220px;
`;

const SalesTitle = styled.div`
  position: absolute;
  left: 16px;
  top: 14px;
  z-index: 2;
  font-size: 15px;
  line-height: 1;
  font-weight: 900;
  color: #ffffff;
`;

const MiniRamenCard = styled.div`
  position: absolute;
  left: 22px;
  right: 22px;
  top: 34px;
  bottom: 16px;

  &::before {
    content: "";
    position: absolute;
    left: 18px;
    top: 34px;
    width: 118px;
    height: 140px;
    border-radius: 12px;
    background: #e41f1f;
  }

  &::after {
    content: "";
    position: absolute;
    left: 34px;
    bottom: 0;
    width: 126px;
    height: 72px;
    border-radius: 50% 50% 42% 42% / 30% 30% 70% 70%;
    background: linear-gradient(180deg, #3c261e 0%, #1f120d 100%);
    box-shadow: 0 10px 16px rgba(0, 0, 0, 0.14);
  }
`;

const RiceCard = styled.div`
  position: absolute;
  inset: 0;

  &::before {
    content: "";
    position: absolute;
    right: 46px;
    top: 40px;
    width: 126px;
    height: 126px;
    border-radius: 50%;
    background: #f3ece2;
    border: 7px solid #e7dccd;
  }

  &::after {
    content: "";
    position: absolute;
    left: 48px;
    bottom: 24px;
    width: 116px;
    height: 64px;
    border-radius: 50% 50% 42% 42% / 32% 32% 68% 68%;
    background: #d5c7b8;
  }
`;

const CurryCard = styled.div`
  position: absolute;
  inset: 0;

  &::before {
    content: "";
    position: absolute;
    left: 34px;
    top: 54px;
    width: 140px;
    height: 122px;
    border-radius: 10px;
    background: #ecd111;
  }

  &::after {
    content: "";
    position: absolute;
    left: 136px;
    bottom: 16px;
    width: 116px;
    height: 58px;
    border-radius: 50% 50% 42% 42% / 32% 32% 68% 68%;
    background: #ece8df;
  }
`;

const CokeZeroCard = styled.div`
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: flex;
  gap: 6px;
`;

const Can = styled.div`
  width: 32px;
  height: 102px;
  border-radius: 8px;
  background: linear-gradient(180deg, #f0c74f 0%, #df2626 42%, #bfbfbf 100%);
  box-shadow: 0 8px 14px rgba(0, 0, 0, 0.1);
`;