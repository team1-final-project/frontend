import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BEST_ITEMS = [
  {
    id: 1,
    name: "농심 신라면 멀티팩 120g, 5개",
    brand: "농심",
    price: "4,150원",
    originalPrice: "5,000원",
    discount: "-17%",
    rating: "4.5/5",
    color: "#d8291d",
    tone: "#fff3f0",
    visual: "신",
  },
  {
    id: 2,
    name: "코카콜라 캔 190ml, 30개",
    brand: "코카콜라",
    price: "16,630원",
    originalPrice: "33,690원",
    discount: "-50%",
    rating: "3.5/5",
    color: "#d41f1f",
    tone: "#fff2f2",
    visual: "Coke",
  },
  {
    id: 3,
    name: "오뚜기 3분 쇠고기 짜장 200g, 1개",
    brand: "오뚜기",
    price: "980원",
    originalPrice: "840원",
    discount: "+16%",
    rating: "4.5/5",
    color: "#f2d21b",
    tone: "#fffbe8",
    visual: "3분",
  },
  {
    id: 4,
    name: "농심 포테토칩 오리지널 60g, 1개",
    brand: "농심",
    price: "5,480원",
    originalPrice: "5,680원",
    discount: "-4%",
    rating: "4.5/5",
    color: "#76b23a",
    tone: "#f5faef",
    visual: "칩",
  },
];

const HOT_DEAL_ITEMS = [
  {
    id: 1,
    name: "농심 새우깡 오리지널 90g, 1개",
    brand: "농심",
    price: "900원",
    originalPrice: "1,050원",
    discount: "-14%",
    rating: "5.0/5",
    color: "#f07d1f",
    tone: "#fff6ef",
    visual: "새우깡",
  },
  {
    id: 2,
    name: "롯데 맛있는 비엔나 소시지 1kg, 1개",
    brand: "롯데",
    price: "5,860원",
    originalPrice: "7,250원",
    discount: "-19%",
    rating: "4.0/5",
    color: "#d54040",
    tone: "#fff1f1",
    visual: "소시지",
  },
  {
    id: 3,
    name: "코카콜라 캔 190ml, 30개",
    brand: "코카콜라",
    price: "16,630원",
    originalPrice: "33,690원",
    discount: "-50%",
    rating: "3.5/5",
    color: "#d41f1f",
    tone: "#fff2f2",
    visual: "Coke",
  },
  {
    id: 4,
    name: "농심 신라면 멀티팩 120g, 5개",
    brand: "농심",
    price: "4,150원",
    originalPrice: "5,000원",
    discount: "-17%",
    rating: "4.5/5",
    color: "#d8291d",
    tone: "#fff3f0",
    visual: "신",
  },
];

const BRANDS = [
  "SAMYANG",
  "OTTOGI",
  "NONGSHIM",
  "ORION",
  "PALDO",
  "COCA-COLA",
  "PEPSI",
];

const SALES_BANNERS = [
  {
    id: 1,
    title: "신라면",
    subtitle: "한 그릇으로 끝나는 베스트",
    color: "#e23a2b",
    tone: "#f5ede4",
    size: "large",
  },
  {
    id: 2,
    title: "햇반",
    subtitle: "집밥처럼 간편하게",
    color: "#e86f2f",
    tone: "#f5ede4",
    size: "large",
  },
  {
    id: 3,
    title: "3분카레",
    subtitle: "빠르고 든든한 한 끼",
    color: "#f0c620",
    tone: "#f5ede4",
    size: "wide",
  },
  {
    id: 4,
    title: "코카콜라제로",
    subtitle: "가볍게 즐기는 탄산",
    color: "#db2a2a",
    tone: "#f5ede4",
    size: "small",
  },
];

function ProductCard({ item }) {
  return (
    <Card>
      <Thumb tone={item.tone}>
        <Package color={item.color}>
          <PackageMain>{item.visual}</PackageMain>
          <PackageSub>{item.brand}</PackageSub>
        </Package>
      </Thumb>

      <Meta>
        <ProductName>{item.name}</ProductName>

        <RatingRow>
          <Stars>★★★★★</Stars>
          <RatingText>{item.rating}</RatingText>
        </RatingRow>

        <PriceRow>
          <CurrentPrice>{item.price}</CurrentPrice>
          <OriginalPrice>{item.originalPrice}</OriginalPrice>
          <DiscountBadge>{item.discount}</DiscountBadge>
        </PriceRow>
      </Meta>
    </Card>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, member } = useAuth();

  return (
    <Page>
      <HeroSection>
        <HeroInner>
          <HeroLeft>
            <HeroTitle>
              농심 辛라면
              <br />
              Stock+er 에서
              <br />
              최저가로 구매!
            </HeroTitle>

            <HeroDesc>
              실시간 가격 비교와 합리적인 추천으로
              <br />
              인기 상품을 더 좋은 조건으로 만나보세요.
            </HeroDesc>

            <HeroButtonRow>
              <PrimaryButton
                type="button"
                onClick={() =>
                  navigate(isAuthenticated ? "/" : "/signup")
                }
              >
                Buy Now
              </PrimaryButton>

              {!isAuthenticated && (
                <SecondaryButton
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </SecondaryButton>
              )}
            </HeroButtonRow>

            <StatRow>
              <StatCard>
                <StatValue>900만+</StatValue>
                <StatLabel>누적 구매</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>8.9만+</StatValue>
                <StatLabel>리뷰 수</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>10억$+</StatValue>
                <StatLabel>누적 수익액</StatLabel>
              </StatCard>
            </StatRow>
          </HeroLeft>

          <HeroRight>
            <SparkWrap>
              <Spark />
              <Spark small />
            </SparkWrap>

            <HeroVisual>
              <PackageBack>
                <PackageBackInner>
                  <PackageBackTitle>辛</PackageBackTitle>
                  <PackageBackSub>라면</PackageBackSub>
                </PackageBackInner>
              </PackageBack>

              <BowlArea>
                <BowlOuter>
                  <BowlInner>
                    <Noodle />
                    <Topping green />
                    <Topping white />
                    <Topping red />
                  </BowlInner>
                </BowlOuter>
              </BowlArea>
            </HeroVisual>
          </HeroRight>
        </HeroInner>
      </HeroSection>

      <BrandBar>
        <BrandInner>
          {BRANDS.map((brand) => (
            <BrandBadge key={brand}>{brand}</BrandBadge>
          ))}
        </BrandInner>
      </BrandBar>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>Best</SectionTitle>
          <SectionSub>
            지금 가장 많이 찾는 인기 상품을 먼저 만나보세요.
          </SectionSub>
        </SectionHeader>

        <ProductGrid>
          {BEST_ITEMS.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </ProductGrid>

        <CenterButton type="button">View All</CenterButton>
      </ContentSection>

      <DividerLine />

      <ContentSection>
        <SectionHeader>
          <SectionTitle>Hot Deal</SectionTitle>
          <SectionSub>
            빠르게 소진되는 특가 상품을 확인해보세요.
          </SectionSub>
        </SectionHeader>

        <ProductGrid>
          {HOT_DEAL_ITEMS.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </ProductGrid>

        <CenterButton type="button">View All</CenterButton>
      </ContentSection>

      <SalesSection>
        <SectionHeader>
          <SectionTitle>Sales Item</SectionTitle>
          <SectionSub>
            카테고리별 대표 상품을 큼직한 배너로 둘러볼 수 있어요.
          </SectionSub>
        </SectionHeader>

        <SalesGrid>
          {SALES_BANNERS.map((item) => (
            <SalesCard key={item.id} $size={item.size} tone={item.tone}>
              <SalesLabel>{item.title}</SalesLabel>
              <SalesDesc>{item.subtitle}</SalesDesc>
              <SalesVisual color={item.color}>
                <SalesVisualInner>
                  <SalesVisualText>{item.title}</SalesVisualText>
                </SalesVisualInner>
              </SalesVisual>
            </SalesCard>
          ))}
        </SalesGrid>
      </SalesSection>

      <BottomInfoSection>
        <BottomInfoInner>
          <BottomTextBlock>
            <BottomEyebrow>
              {isAuthenticated
                ? `${member?.name || "회원"}님을 위한 추천`
                : "처음 방문하셨나요?"}
            </BottomEyebrow>
            <BottomTitle>
              가격 비교는 빠르게,
              <br />
              선택은 더 합리적으로.
            </BottomTitle>
            <BottomDesc>
              Stock+er는 상품별 가격 흐름과 할인 정보를
              보기 쉽게 정리해주는 소비자 메인 화면을 준비 중입니다.
            </BottomDesc>
          </BottomTextBlock>

          <BottomActionRow>
            <PrimaryButton type="button" onClick={() => navigate("/signup")}>
              회원가입
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => navigate("/login")}>
              로그인
            </SecondaryButton>
          </BottomActionRow>
        </BottomInfoInner>
      </BottomInfoSection>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  background: #f2f2f2;
`;

const HeroSection = styled.section`
  width: 100%;
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.45), transparent 28%),
    linear-gradient(180deg, #eee2d3 0%, #eadfce 100%);
`;

const HeroInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 44px 40px 38px;
  display: grid;
  grid-template-columns: 1.02fr 1fr;
  gap: 24px;
  min-height: 540px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    padding: 32px 20px 28px;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 12px;
`;

const HeroTitle = styled.h1`
  font-size: 64px;
  line-height: 1.04;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;

  @media (max-width: 1080px) {
    font-size: 46px;
  }

  @media (max-width: 680px) {
    font-size: 36px;
  }
`;

const HeroDesc = styled.p`
  margin-top: 18px;
  font-size: 17px;
  line-height: 1.75;
  color: #564d43;

  @media (max-width: 680px) {
    font-size: 15px;
  }
`;

const HeroButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  min-width: 136px;
  height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

const SecondaryButton = styled.button`
  min-width: 136px;
  height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #d8cec0;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
`;

const StatRow = styled.div`
  margin-top: 46px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  position: relative;
  padding-left: 10px;

  &:not(:first-child)::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 8px;
    width: 1px;
    height: 48px;
    background: rgba(17, 17, 17, 0.12);
  }

  @media (max-width: 680px) {
    &:not(:first-child)::before {
      display: none;
    }
    padding-left: 0;
  }
`;

const StatValue = styled.div`
  font-size: 44px;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;

  @media (max-width: 680px) {
    font-size: 34px;
  }
`;

const StatLabel = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #7d7368;
  font-weight: 600;
`;

const HeroRight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
`;

const SparkWrap = styled.div`
  position: absolute;
  left: 6%;
  top: 12%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Spark = styled.div`
  width: ${({ small }) => (small ? "28px" : "40px")};
  height: ${({ small }) => (small ? "28px" : "40px")};
  background: #111111;
  clip-path: polygon(
    50% 0%,
    62% 38%,
    100% 50%,
    62% 62%,
    50% 100%,
    38% 62%,
    0% 50%,
    38% 38%
  );
`;

const HeroVisual = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  height: 100%;
  min-height: 430px;
`;

const PackageBack = styled.div`
  position: absolute;
  top: 0;
  right: 2%;
  width: 240px;
  height: 280px;
  background: linear-gradient(180deg, #f5382a 0%, #d82119 100%);
  border-radius: 18px 18px 12px 12px;
  box-shadow: 0 26px 50px rgba(102, 41, 21, 0.18);
  transform: rotate(-3deg);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 52px;
    border-radius: 18px 18px 0 0;
    background: rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 680px) {
    width: 190px;
    height: 220px;
  }
`;

const PackageBackInner = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PackageBackTitle = styled.div`
  font-size: 108px;
  font-weight: 900;
  color: #111111;
  line-height: 1;
  text-shadow: 3px 3px 0 rgba(255, 255, 255, 0.16);

  @media (max-width: 680px) {
    font-size: 84px;
  }
`;

const PackageBackSub = styled.div`
  margin-top: 6px;
  font-size: 30px;
  font-weight: 800;
  color: #ffffff;

  @media (max-width: 680px) {
    font-size: 24px;
  }
`;

const BowlArea = styled.div`
  position: absolute;
  right: 8%;
  bottom: 10px;
  width: 430px;
  height: 290px;

  @media (max-width: 680px) {
    width: 320px;
    height: 220px;
  }
`;

const BowlOuter = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #3f2f29 0%, #261914 100%);
  border-radius: 50% 50% 42% 42% / 24% 24% 76% 76%;
  box-shadow: 0 28px 50px rgba(54, 37, 24, 0.28);
`;

const BowlInner = styled.div`
  position: absolute;
  left: 5%;
  right: 5%;
  top: 9%;
  height: 55%;
  background: radial-gradient(circle at center, #ffbf69 0%, #ff9f34 48%, #ef7c12 100%);
  border-radius: 50%;
  overflow: hidden;
`;

const Noodle = styled.div`
  position: absolute;
  inset: 10% 8%;
  border-radius: 50%;
  background:
    repeating-radial-gradient(circle at 50% 50%, rgba(255, 187, 82, 0.15) 0 4px, transparent 4px 8px),
    repeating-linear-gradient(
      0deg,
      rgba(232, 149, 39, 0.9) 0 4px,
      rgba(255, 189, 78, 0.96) 4px 8px
    );
  filter: saturate(1.08);
`;

const Topping = styled.div`
  position: absolute;
  width: ${({ red }) => (red ? "22px" : "34px")};
  height: ${({ red, white }) => (red ? "48px" : white ? "30px" : "30px")};
  border-radius: ${({ red }) => (red ? "14px" : "999px")};
  background: ${({ green, white, red }) => {
    if (green) return "#7cc94d";
    if (white) return "#f4f0df";
    if (red) return "#dd2d1f";
    return "#ffffff";
  }};
  top: ${({ green, white, red }) => {
    if (green) return "26%";
    if (white) return "34%";
    if (red) return "28%";
    return "30%";
  }};
  left: ${({ green, white, red }) => {
    if (green) return "40%";
    if (white) return "56%";
    if (red) return "50%";
    return "30%";
  }};
  transform: ${({ red }) => (red ? "rotate(18deg)" : "rotate(-8deg)")};
  opacity: 0.95;
`;

const BrandBar = styled.section`
  width: 100%;
  background: #000000;
`;

const BrandInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  min-height: 92px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;

  @media (max-width: 980px) {
    justify-content: center;
    padding: 18px 20px;
  }
`;

const BrandBadge = styled.div`
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  opacity: 0.92;

  @media (max-width: 680px) {
    font-size: 18px;
  }
`;

const ContentSection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 70px 40px 20px;

  @media (max-width: 980px) {
    padding: 54px 20px 12px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 34px;
`;

const SectionTitle = styled.h2`
  font-size: 58px;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;

  @media (max-width: 680px) {
    font-size: 40px;
  }
`;

const SectionSub = styled.p`
  margin-top: 10px;
  color: #7a7166;
  font-size: 15px;
  line-height: 1.7;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1160px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: transparent;
`;

const Thumb = styled.div`
  height: 330px;
  border-radius: 24px;
  background: ${({ tone }) => tone};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;

  @media (max-width: 680px) {
    height: 280px;
  }
`;

const Package = styled.div`
  width: 72%;
  aspect-ratio: 0.8 / 1;
  border-radius: 20px;
  background: ${({ color }) => color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 28px rgba(25, 25, 25, 0.12);
`;

const PackageMain = styled.div`
  font-size: 44px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.05;
  letter-spacing: -0.03em;
`;

const PackageSub = styled.div`
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
`;

const Meta = styled.div`
  padding: 14px 6px 0;
`;

const ProductName = styled.h3`
  min-height: 48px;
  font-size: 18px;
  line-height: 1.45;
  font-weight: 700;
  color: #111111;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const Stars = styled.span`
  color: #ffb400;
  font-size: 13px;
  letter-spacing: 1px;
`;

const RatingText = styled.span`
  font-size: 13px;
  color: #8b8175;
  font-weight: 600;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

const CurrentPrice = styled.span`
  font-size: 34px;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;

  @media (max-width: 680px) {
    font-size: 28px;
  }
`;

const OriginalPrice = styled.span`
  font-size: 24px;
  color: #9f9589;
  text-decoration: line-through;
  font-weight: 700;

  @media (max-width: 680px) {
    font-size: 20px;
  }
`;

const DiscountBadge = styled.span`
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f6dcdc;
  color: #c95d5d;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
`;

const CenterButton = styled.button`
  display: block;
  margin: 34px auto 0;
  min-width: 166px;
  height: 50px;
  border-radius: 999px;
  border: 1px solid #ddd2c4;
  background: transparent;
  color: #111111;
  font-size: 14px;
  font-weight: 700;
`;

const DividerLine = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  height: 1px;
  background: #e3ddd4;
`;

const SalesSection = styled.section`
  max-width: 1440px;
  margin: 0 auto;
  padding: 78px 40px 100px;

  @media (max-width: 980px) {
    padding: 56px 20px 70px;
  }
`;

const SalesGrid = styled.div`
  background: #e8e8e8;
  border-radius: 34px;
  padding: 34px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const SalesCard = styled.article`
  grid-column: ${({ $size }) => {
    if ($size === "large") return "span 6";
    if ($size === "wide") return "span 7";
    return "span 5";
  }};
  min-height: ${({ $size }) => ($size === "large" ? "390px" : "300px")};
  border-radius: 24px;
  background: ${({ tone }) => tone};
  padding: 18px;
  position: relative;
  overflow: hidden;

  @media (max-width: 980px) {
    grid-column: auto;
    min-height: 280px;
  }
`;

const SalesLabel = styled.div`
  position: relative;
  z-index: 2;
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
`;

const SalesDesc = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.94);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);
`;

const SalesVisual = styled.div`
  position: absolute;
  right: 20px;
  bottom: 18px;
  left: 20px;
  top: 72px;
  border-radius: 22px;
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 35%),
    linear-gradient(145deg, ${({ color }) => color} 0%, rgba(255,255,255,0.08) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SalesVisualInner = styled.div`
  width: min(72%, 280px);
  aspect-ratio: 0.9 / 1;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SalesVisualText = styled.div`
  font-size: 34px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.04em;
  text-align: center;
`;

const BottomInfoSection = styled.section`
  background: #f7f3ec;
  border-top: 1px solid #ede4d7;
`;

const BottomInfoInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 70px 40px 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 980px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 56px 20px 64px;
  }
`;

const BottomTextBlock = styled.div`
  max-width: 760px;
`;

const BottomEyebrow = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #8b8175;
  letter-spacing: 0.02em;
`;

const BottomTitle = styled.h3`
  margin-top: 12px;
  font-size: 48px;
  line-height: 1.2;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.04em;

  @media (max-width: 680px) {
    font-size: 34px;
  }
`;

const BottomDesc = styled.p`
  margin-top: 16px;
  color: #6f675d;
  font-size: 16px;
  line-height: 1.75;
`;

const BottomActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;