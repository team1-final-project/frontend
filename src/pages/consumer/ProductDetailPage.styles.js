import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
  color: #111111;
`;

export const Content = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 22px 54px 110px;

  @media (max-width: 1024px) {
    padding: 22px 28px 80px;
  }
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 22px;
  padding-left: 2px;
  font-size: 12px;
  font-weight: 500;
  color: #9b9b9b;
`;

export const Divider = styled.span`
  color: #b5b5b5;
`;

export const CurrentCategory = styled.span`
  color: #767676;
`;

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 520px minmax(0, 1fr);
  gap: 66px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 420px minmax(0, 1fr);
    gap: 40px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ImagePanel = styled.div`
  width: 100%;
  border-radius: 18px;
  background: #f1f1f1;
  padding: 32px;
`;

export const ImagePanelInner = styled.div`
  height: 392px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #f1f1f1;

  @media (max-width: 1200px) {
    height: 340px;
  }
`;

export const ProductImage = styled.img`
  width: 238px;
  height: auto;
  object-fit: contain;
  display: block;
`;

export const InfoPanel = styled.div`
  padding-top: 2px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 34px;
  line-height: 1.18;
  letter-spacing: -0.04em;
  font-weight: 800;
  color: #111111;

  @media (max-width: 1200px) {
    font-size: 30px;
  }
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

export const Stars = styled.div`
  color: #ffc533;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 1px;
`;

export const RatingText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #666666;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const CurrentPrice = styled.span`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #111111;
`;

export const OriginalPrice = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #d0d0d0;
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: #ffe8e8;
  color: #ff6d6d;
  font-size: 10px;
  font-weight: 700;
`;

export const Description = styled.div`
  margin-top: 16px;
  max-width: 560px;
  color: #777777;
  font-size: 12px;
  line-height: 1.5;

  p {
    margin: 0 0 2px;
  }
`;

export const Specs = styled.ul`
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
  color: #777777;
  font-size: 12px;
  line-height: 1.5;

  li {
    margin-bottom: 1px;
  }
`;

export const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e6e6e6;
`;

export const QuantityBox = styled.div`
  width: 96px;
  height: 44px;
  padding: 0 13px;
  border-radius: 999px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const QtyButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #444444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #ffffff;
  }
`;

export const QtyValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #222222;
`;

export const CartButton = styled.button`
  min-width: 224px;
  height: 44px;
  padding: 0 28px;
  border: none;
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.92;
  }
`;

export const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 44px;
  border-bottom: 1px solid #e5e5e5;
`;

export const TabButton = styled.button`
  position: relative;
  height: 48px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#111111" : "#444444")};
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -1px;
    width: ${({ $active }) => ($active ? "172px" : "0")};
    height: 2px;
    background: #000000;
    transform: translateX(-50%);
    transition: width 0.18s ease;
  }
`;

export const DetailSection = styled.section`
  margin-top: 46px;
`;

export const DetailTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 800;
  color: #111111;
`;

export const DetailPlaceholder = styled.div`
  min-height: 280px;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  background: #ffffff;
  padding: 28px;
  color: #777777;
  font-size: 14px;
  line-height: 1.7;
`;

export const ReviewGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 46px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.article`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 14px 18px 16px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
`;

export const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ReviewHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ReviewStars = styled.div`
  color: #ffc533;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 1px;
`;

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Author = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #111111;
`;

export const VerifiedIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
`;

export const MoreButton = styled.button`
  border: none;
  background: transparent;
  color: #666666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 10px;
`;

export const ThumbWrap = styled.div`
  position: relative;
  height: 50px;
  overflow: hidden;
  border-radius: 7px;
  background: #f3f3f3;
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ThumbOverlay = styled.div`
  position: absolute;
  top: 50%;
  right: 3px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ReviewBody = styled.p`
  margin: 10px 0 0;
  min-height: 96px;
  color: #666666;
  font-size: 12px;
  line-height: 1.52;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ReviewDate = styled.p`
  margin: 18px 0 0;
  color: #777777;
  font-size: 12px;
  font-weight: 500;
`;

export const InquiryList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 46px;
`;

export const InquiryCard = styled.article`
  background: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 18px;
  padding: 18px 18px 16px;
`;

export const InquiryRowTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const QuestionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 20px;
  padding: 0 9px;
  border-radius: 999px;
  background: #f2f2f2;
  color: #555555;
  font-size: 12px;
  font-weight: 700;
`;

export const QuestionAuthorWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const QuestionAuthor = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #111111;
`;

export const InquiryQuestionText = styled.div`
  margin-top: 12px;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1.65;

  p {
    margin: 0;
  }
`;

export const InquiryDate = styled.p`
  margin: 12px 0 0;
  color: #9a9a9a;
  font-size: 12px;
  font-weight: 500;
`;

export const AnswerBox = styled.div`
  margin-top: 14px;
`;

export const AnswerHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AnswerHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AnswerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 20px;
  padding: 0 9px;
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
`;

export const AnswerAuthor = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #111111;
`;

export const AnswerText = styled.p`
  margin: 10px 0 0;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1.7;
`;

export const ReturnSection = styled.section`
  margin-top: 46px;
`;

export const ReturnTitle = styled.h3`
  margin: 0 0 14px;
  color: #111111;
  font-size: 18px;
  font-weight: 800;
`;

export const ReturnTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  margin-bottom: 28px;

  tr {
    border: 1px solid #dddddd;
  }
`;

export const ReturnTh = styled.th`
  width: 180px;
  padding: 14px 16px;
  background: #f3f3f3;
  color: #555555;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  border-right: 1px solid #dddddd;
`;

export const ReturnTd = styled.td`
  padding: 14px 16px;
  color: #555555;
  font-size: 13px;
  line-height: 1.6;
`;

export const ReturnSubTitle = styled.h4`
  margin: 0 0 14px;
  color: #111111;
  font-size: 18px;
  font-weight: 800;
`;

export const ReturnParagraph = styled.p`
  margin: 0 0 18px;
  color: #666666;
  font-size: 13px;
  line-height: 1.9;
`;

export const ReturnBulletTitle = styled.h5`
  margin: 20px 0 10px;
  color: #444444;
  font-size: 14px;
  font-weight: 800;
`;

export const ReturnBulletList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #666666;
  font-size: 13px;
  line-height: 1.9;

  li {
    margin-bottom: 2px;
  }
`;

export const ReturnBottomLine = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid #e5e5e5;
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 54px;
`;

export const PageNavButton = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #dfdfdf;
  border-radius: 6px;
  background: #ffffff;
  color: #b0b0b0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const PageNumberButton = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: 1px solid ${({ $active }) => ($active ? "#000000" : "#dfdfdf")};
  background: ${({ $active }) => ($active ? "#000000" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#555555")};
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
`;
