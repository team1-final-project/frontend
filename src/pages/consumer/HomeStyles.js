import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.div`
  width: 100%;
  background: #efefef;
`;

export const HeroSection = styled.section`
  width: 100%;
  background: #e7dccd;
  overflow: hidden;
  height: 450px;
`;

export const HeroCanvas = styled.div`
  position: relative;
  width: 100%;
  max-width: 1265px;
  margin: 0 auto;
`;

export const HeroBaseImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  pointer-events: none;
`;

export const HeroOverlay = styled.div`
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

export const HeroTitle = styled.h1`
  font-size: clamp(18px, 3vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.06em;
  font-weight: 900;
  color: #111111;
`;

export const HeroButton = styled.button`
  width: clamp(74px, 9vw, 138px);
  height: clamp(28px, 3vw, 44px);
  margin-top: clamp(14px, 2.2vw, 36px);
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: clamp(8px, 1vw, 13px);
  font-weight: 700;
`;

export const StatsRow = styled.div`
  margin-top: clamp(20px, 4.1vw, 56px);
  display: flex;
  align-items: flex-start;
  gap: clamp(10px, 1.5vw, 22px);

  @media (max-width: 560px) {
    display: none;
  }
`;

export const StatBlock = styled.div`
  min-width: 0;
`;

export const StatValue = styled.div`
  font-size: clamp(16px, 2vw, 42px);
  line-height: 1;
  letter-spacing: -0.05em;
  font-weight: 900;
  color: #111111;
  white-space: nowrap;
`;

export const StatLabel = styled.div`
  margin-top: 4px;
  font-size: clamp(7px, 0.72vw, 12px);
  font-weight: 600;
  color: #7d7368;
  white-space: nowrap;
`;

export const StatDivider = styled.div`
  width: 1px;
  height: clamp(24px, 3vw, 52px);
  background: rgba(17, 17, 17, 0.12);
  margin-top: 1px;
`;

const marqueeMove = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

export const BrandBar = styled.section`
  width: 100%;
  background: #000000;
`;

export const BrandCanvas = styled.div`
  width: 100%;
  max-width: 1265px;
  height: 81px;
  margin: 0 auto;
  overflow: hidden;
  background: #000000;
`;

export const BrandTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${marqueeMove} 20s linear infinite;
  will-change: transform;

  &:hover {
    animation-play-state: paused;
  }
`;

export const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 46px;
  padding: 0 23px;
  height: 81px;
  flex-shrink: 0;
`;

export const BrandLogoItem = styled.div`
  width: 124px;
  height: 81px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const BrandLogo = styled.img`
  display: block;
  max-width: 100%;
  max-height: 40px;
  object-fit: contain;
  transform: scale(${({ $scale }) => $scale || 1});
  transform-origin: center;
`;

export const MainSection = styled.section`
  max-width: 950px;
  margin: 0 auto;
  padding: 26px 20px 18px;
`;

export const MainSectionTitle = styled.h2`
  text-align: center;
  font-size: 22px;
  line-height: 1;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.05em;
  margin-bottom: 50px;
  margin-top: 50px;

  @media (max-width: 900px) {
    font-size: 30px;
    margin-bottom: 22px;
  }

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-size: 30px;
  line-height: 1;
  font-weight: 900;
  color: #111111;
  letter-spacing: -0.05em;
  margin-bottom: 42px;
  margin-top: 22px;

  @media (max-width: 900px) {
    font-size: 42px;
    margin-bottom: 26px;
  }

  @media (max-width: 640px) {
    font-size: 34px;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCardWrap = styled.article``;

export const ProductThumb = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
`;

export const ProductImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  object-fit: contain;
  transform: scale(${({ $scale }) => $scale || 1});
  transform-origin: center;
`;

export const ProductName = styled(Link)`
  display: block;
  margin-top: 9px;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 700;
  color: #111111;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

export const StarsWrap = styled.div`
  position: relative;
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.5px;
`;

export const StarsBase = styled.span`
  color: #c7c7c7;
`;

export const StarsFill = styled.span`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $width }) => `${$width}%`};
  overflow: hidden;
  color: #ffbf1a;
  white-space: nowrap;
`;

export const RatingText = styled.span`
  color: #8d857b;
  font-size: 10px;
  font-weight: 600;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  flex-wrap: wrap;
`;

export const CurrentPrice = styled.span`
  font-size: 13px;
  font-weight: 900;
  color: #111111;
`;

export const OriginalPrice = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #999189;
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  height: 18px;
  padding: 0 8px;
  border-radius: 999px;
  background: ${({ $positive }) => ($positive ? "#dfeeff" : "#f5dddd")};
  color: ${({ $positive }) => ($positive ? "#2f6fd6" : "#c66a6a")};
  font-size: 8px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
`;

export const ViewAllButton = styled.button`
  display: block;
  width: 150px;
  height: 40px;
  margin: 24px auto 28px;
  border-radius: 999px;
  border: 1px solid #d7cfc4;
  background: transparent;
  color: #111111;
  font-size: 11px;
  font-weight: 500;
`;

export const SectionDivider = styled.div`
  max-width: 800px;
  height: 1px;
  margin: 0 auto;
  background: #dfd9d1;
`;

export const SalesSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 26px 20px 56px;
`;

export const SalesPanel = styled.div`
  border-radius: 24px;
  background: #dddddd;
  padding: 18px;

  @media (max-width: 640px) {
    padding: 12px;
  }
`;

export const SalesTopRow = styled.div`
  display: grid;
  grid-template-columns: 0.74fr 1.26fr;
  gap: 10px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const SalesBottomRow = styled.div`
  display: grid;
  grid-template-columns: 1.36fr 0.84fr;
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const SalesImageCardBase = styled.article`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #e9dece;
`;

export const SalesImageCard = styled(SalesImageCardBase)`
  height: 350px;
`;

export const SalesWideImageCard = styled(SalesImageCardBase)`
  height: 280px;
`;

export const SalesSmallImageCard = styled(SalesImageCardBase)`
  height: 280px;
`;

export const SalesImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ $variant }) => {
    switch ($variant) {
      case "shin":
        return "50% -28%";
      case "hetban":
        return "50% 0%";
      case "curry":
        return "50% -28%";
      case "cokezero":
        return "50% 0%";
      default:
        return "center center";
    }
  }};
  transform: ${({ $variant }) => {
    switch ($variant) {
      case "shin":
        return "scale(1.08)";
      case "hetban":
        return "scale(1.05)";
      case "curry":
        return "scale(1.06)";
      case "cokezero":
        return "scale(1.03)";
      default:
        return "scale(1)";
    }
  }};
  transform-origin: center center;
`;
