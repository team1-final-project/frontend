import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Minus,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import shinramyunImg from "../../assets/shinramyeon.jpg";

const PRODUCT_IMAGE = shinramyunImg;

const REVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80",
];

const TABS = ["상품상세", "상품평(788,617)", "상품문의", "교환/반품 안내"];

const PRODUCT_INQUIRIES = Array.from({ length: 4 }).map((_, index) => ({
  id: index + 1,
  author: "김하* (hari***@naver.com)",
  questionDate: "2026/04/02 09:24:09",
  answerDate: "2026/04/02 10:30:30",
  question:
    "5개들이 멀티팩이 20개 필요해요.\n50개를 구매하면 멀티팩이 10개인가요?\n하나씩 낱개포장인가요?\n빠른답변 바랍니다^^",
  answer:
    "안녕하세요. 해당 상품은 5개들이 멀티팩 10개로 총 50개가 발송됩니다. 낱개 포장이 아닌 멀티팩 형태로 제공되니 참고 부탁드립니다. 감사합니다.",
}));

const RETURN_INFO_ROWS = [
  {
    label: "반품/교환 배송비",
    value:
      "(구매자귀책) 3,000원 / 6,000원 초기도배송비 무료시 반품배송비 부과방법 : 편도",
  },
  {
    label: "반품/교환지 주소",
    value: "충청남도 천안시 동남구 대흥로 215 7층, 8층",
  },
  {
    label: "반품/교환 안내",
    value: "상품상세설명 참조",
  },
];

const RETURN_COMMON_RULES = [
  "소비자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우 (단, 상품 확인을 위한 포장 훼손 제외)",
  "소비자의 사용 또는 소비에 의해 상품 등의 가치가 현저히 감소한 경우",
  "시간 경과에 의해 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우",
  "복제가 가능한 상품 등의 포장을 훼손한 경우",
  "소비자의 주문에 따라 개별적으로 생산되는 상품이 제작에 들어간 경우",
];

const RETURN_DENIED_RULES = [
  "고객 귀책 사유 (단순 변심, 주소 오기재, 주문 착오, 보관 부주의 및 상품 사용으로 가치 하락한 경우 등)",
  "소비자의 사용 또는 소비에 의해 상품 등의 가치가 현저히 감소한 경우",
  "다른 옵션 상품으로 교환을 요청하는 경우",
  "슈팅셀러 상품의 배송완료 후 24시간 이내에 사진 포함 반품(교환) 신청이 누락된 경우",
  "슈팅셀러 상품의 반품(교환) 신청 후 72시간 이내에 연락이 닿지 않은 경우",
  "슈팅셀러 상품의 배송 받은 아이스박스, 냉매제, 상품을 임의로 폐기한 경우",
  "슈팅배송 상품의 교환을 요청하는 경우",
];

export default function ProductDetailPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("상품평(788,617)");
  const [currentPage, setCurrentPage] = useState(1);

  const reviews = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, index) => ({
        id: index + 1,
        author: "김하* (hari***@naver.com)",
        date: "Posted on August 14, 2023",
        body: "라면을 워낙 좋아하는 터라 여러 종류의 라면을 구비해 두고 즐기는데요. 신라면만의 진한 표고 버섯 풍미와 매콤한 맛이 가장 손이 자주 갑니다. 특유의 감칠맛과 국물 밸런스가 좋아 무난하게 먹기 좋고, 가끔 느끼하다는 의견도 있지만 전체적으로는 꾸준히 찾게 되는 제품이에요. 신라면 본연의 맛이 오래 유지되었으면 좋겠습니다!",
      })),
    [],
  );

  const pages = Array.from({ length: 10 }, (_, i) => i + 1);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  return (
    <Page>
      <Content>
        <Breadcrumb>
          <span>Home</span>
          <Divider>›</Divider>
          <CurrentCategory>스낵</CurrentCategory>
        </Breadcrumb>

        <HeroSection>
          <ImagePanel>
            <ImagePanelInner>
              <ProductImage src={PRODUCT_IMAGE} alt="농심 신라면" />
            </ImagePanelInner>
          </ImagePanel>

          <InfoPanel>
            <Title>농심 신라면, 120g, 5개</Title>

            <RatingRow>
              <Stars>★★★★★</Stars>
              <RatingText>4.5/5</RatingText>
            </RatingRow>

            <PriceRow>
              <CurrentPrice>4,150원</CurrentPrice>
              <OriginalPrice>5,000원</OriginalPrice>
              <DiscountBadge>- 40%</DiscountBadge>
            </PriceRow>

            <Description>
              <p>Spicy happiness In Noodles</p>
              <p>
                1986년 한국인의 입맛에 맞춘 매운맛 라면으로 시작한 신라면은 진한
                소고기 육수와 깊은 버섯의 조화로 전 세계인의 입맛까지 사로잡은
                K-푸드 대표 아이콘입니다.
              </p>
              <p>
                SHIN : Spicy happiness In Noodles라는 슬로건으로 그 가치를
                새롭게 이야기 합니다.
              </p>
              <p>전 세계 100여 국가에서 사랑받는 신라면.</p>
              <p>Spicy happiness In Noodles.</p>
              <p>그리고, 당신의 입맛을 맛있게.</p>
            </Description>

            <Specs>
              <li>중량 : 120g</li>
              <li>칼로리 : 500kcal</li>
              <li>소비기한 : 6개월</li>
              <li>출시년도 : 1986.10</li>
            </Specs>

            <ActionArea>
              <QuantityBox>
                <QtyButton type="button" onClick={decreaseQuantity}>
                  <Minus size={15} strokeWidth={2.3} />
                </QtyButton>
                <QtyValue>{quantity}</QtyValue>
                <QtyButton type="button" onClick={increaseQuantity}>
                  <Plus size={15} strokeWidth={2.3} />
                </QtyButton>
              </QuantityBox>

              <CartButton type="button">Add to Cart</CartButton>
            </ActionArea>
          </InfoPanel>
        </HeroSection>

        <TabBar>
          {TABS.map((tab) => (
            <TabButton
              key={tab}
              type="button"
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabButton>
          ))}
        </TabBar>

        {activeTab === "상품상세" && (
          <DetailSection>
            <DetailTitle>상품상세</DetailTitle>
            <DetailPlaceholder>
              상품상세 본문은 추후 연결하면 됩니다.
            </DetailPlaceholder>
          </DetailSection>
        )}

        {activeTab === "상품평(788,617)" && (
          <>
            <ReviewGrid>
              {reviews.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewTop>
                    <ReviewHeaderLeft>
                      <ReviewStars>★★★★★</ReviewStars>
                      <AuthorRow>
                        <Author>{review.author}</Author>
                        <VerifiedIcon>
                          <BadgeCheck size={14} strokeWidth={2.2} />
                        </VerifiedIcon>
                      </AuthorRow>
                    </ReviewHeaderLeft>

                    <MoreButton type="button">
                      <MoreHorizontal size={16} />
                    </MoreButton>
                  </ReviewTop>

                  <ThumbGrid>
                    {REVIEW_IMAGES.map((image, index) => (
                      <ThumbWrap key={`${review.id}-${index}`}>
                        <ThumbImage src={image} alt={`review-${index}`} />
                        {index === REVIEW_IMAGES.length - 1 && (
                          <ThumbOverlay>
                            <ChevronRight size={12} />
                          </ThumbOverlay>
                        )}
                      </ThumbWrap>
                    ))}
                  </ThumbGrid>

                  <ReviewBody>{review.body}</ReviewBody>
                  <ReviewDate>{review.date}</ReviewDate>
                </ReviewCard>
              ))}
            </ReviewGrid>

            <Pagination>
              <PageNavButton type="button">
                <ChevronsLeft size={12} />
              </PageNavButton>
              <PageNavButton type="button">
                <ChevronLeft size={12} />
              </PageNavButton>

              {pages.map((page) => (
                <PageNumberButton
                  key={page}
                  type="button"
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageNumberButton>
              ))}

              <PageNavButton type="button">
                <ChevronRight size={12} />
              </PageNavButton>
              <PageNavButton type="button">
                <ChevronsRight size={12} />
              </PageNavButton>
            </Pagination>
          </>
        )}

        {activeTab === "상품문의" && (
          <>
            <InquiryList>
              {PRODUCT_INQUIRIES.map((item) => (
                <InquiryCard key={item.id}>
                  <InquiryRowTop>
                    <QuestionMeta>
                      <QuestionBadge>질문</QuestionBadge>
                      <QuestionAuthorWrap>
                        <QuestionAuthor>{item.author}</QuestionAuthor>
                        <VerifiedIcon>
                          <BadgeCheck size={14} strokeWidth={2.2} />
                        </VerifiedIcon>
                      </QuestionAuthorWrap>
                    </QuestionMeta>

                    <MoreButton type="button">
                      <MoreHorizontal size={16} />
                    </MoreButton>
                  </InquiryRowTop>

                  <InquiryQuestionText>
                    {item.question.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </InquiryQuestionText>

                  <InquiryDate>{item.questionDate}</InquiryDate>

                  <AnswerBox>
                    <AnswerHeaderRow>
                      <AnswerHeaderLeft>
                        <AnswerBadge>답변</AnswerBadge>
                        <AnswerAuthor>Stock+er Manager</AnswerAuthor>
                      </AnswerHeaderLeft>

                      <MoreButton type="button">
                        <MoreHorizontal size={16} />
                      </MoreButton>
                    </AnswerHeaderRow>

                    <AnswerText>{item.answer}</AnswerText>
                    <InquiryDate>{item.answerDate}</InquiryDate>
                  </AnswerBox>
                </InquiryCard>
              ))}
            </InquiryList>

            <Pagination>
              <PageNavButton type="button">
                <ChevronsLeft size={12} />
              </PageNavButton>
              <PageNavButton type="button">
                <ChevronLeft size={12} />
              </PageNavButton>

              {pages.map((page) => (
                <PageNumberButton
                  key={page}
                  type="button"
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageNumberButton>
              ))}

              <PageNavButton type="button">
                <ChevronRight size={12} />
              </PageNavButton>
              <PageNavButton type="button">
                <ChevronsRight size={12} />
              </PageNavButton>
            </Pagination>
          </>
        )}

        {activeTab === "교환/반품 안내" && (
          <ReturnSection>
            <ReturnTitle>반품/교환 정보</ReturnTitle>

            <ReturnTable>
              <tbody>
                {RETURN_INFO_ROWS.map((row) => (
                  <tr key={row.label}>
                    <ReturnTh>{row.label}</ReturnTh>
                    <ReturnTd>{row.value}</ReturnTd>
                  </tr>
                ))}
              </tbody>
            </ReturnTable>

            <ReturnSubTitle>반품/교환 기준</ReturnSubTitle>

            <ReturnParagraph>
              상품 수령 후 7일 이내에 신청하실 수 있습니다. 단, 제품이 표시·광고
              내용과 다르거나, 계약과 다르게 이행된 경우는 제품 수령일로부터
              3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에
              교환/반품이 가능합니다.
              <br />
              ㆍ추가적으로 다음에 해당하는 반품/교환은 신청이 불가능할 수
              있습니다.
            </ReturnParagraph>

            <ReturnBulletTitle>공통</ReturnBulletTitle>
            <ReturnBulletList>
              {RETURN_COMMON_RULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ReturnBulletList>

            <ReturnBulletTitle>저온/신선 상품</ReturnBulletTitle>
            <ReturnBulletList>
              {RETURN_DENIED_RULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ReturnBulletList>

            <ReturnBottomLine />
          </ReturnSection>
        )}
      </Content>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
  color: #111111;
`;

const Content = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 22px 54px 110px;

  @media (max-width: 1024px) {
    padding: 22px 28px 80px;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 22px;
  padding-left: 2px;
  font-size: 12px;
  font-weight: 500;
  color: #9b9b9b;
`;

const Divider = styled.span`
  color: #b5b5b5;
`;

const CurrentCategory = styled.span`
  color: #767676;
`;

const HeroSection = styled.section`
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

const ImagePanel = styled.div`
  width: 100%;
  border-radius: 18px;
  background: #f1f1f1;
  padding: 32px;
`;

const ImagePanelInner = styled.div`
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

const ProductImage = styled.img`
  width: 238px;
  height: auto;
  object-fit: contain;
  display: block;
`;

const InfoPanel = styled.div`
  padding-top: 2px;
`;

const Title = styled.h1`
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

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const Stars = styled.div`
  color: #ffc533;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 1px;
`;

const RatingText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #666666;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const CurrentPrice = styled.span`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #111111;
`;

const OriginalPrice = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #d0d0d0;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
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

const Description = styled.div`
  margin-top: 16px;
  max-width: 560px;
  color: #777777;
  font-size: 12px;
  line-height: 1.5;

  p {
    margin: 0 0 2px;
  }
`;

const Specs = styled.ul`
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

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e6e6e6;
`;

const QuantityBox = styled.div`
  width: 96px;
  height: 44px;
  padding: 0 13px;
  border-radius: 999px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QtyButton = styled.button`
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

const QtyValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #222222;
`;

const CartButton = styled.button`
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

const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 44px;
  border-bottom: 1px solid #e5e5e5;
`;

const TabButton = styled.button`
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

const DetailSection = styled.section`
  margin-top: 46px;
`;

const DetailTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 800;
  color: #111111;
`;

const DetailPlaceholder = styled.div`
  min-height: 280px;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  background: #ffffff;
  padding: 28px;
  color: #777777;
  font-size: 14px;
  line-height: 1.7;
`;

const ReviewGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 46px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.article`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 14px 18px 16px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
`;

const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ReviewHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReviewStars = styled.div`
  color: #ffc533;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 1px;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Author = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #111111;
`;

const VerifiedIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
`;

const MoreButton = styled.button`
  border: none;
  background: transparent;
  color: #666666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 10px;
`;

const ThumbWrap = styled.div`
  position: relative;
  height: 50px;
  overflow: hidden;
  border-radius: 7px;
  background: #f3f3f3;
`;

const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ThumbOverlay = styled.div`
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

const ReviewBody = styled.p`
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

const ReviewDate = styled.p`
  margin: 18px 0 0;
  color: #777777;
  font-size: 12px;
  font-weight: 500;
`;

const InquiryList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 46px;
`;

const InquiryCard = styled.article`
  background: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 18px;
  padding: 18px 18px 16px;
`;

const InquiryRowTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuestionBadge = styled.span`
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

const QuestionAuthorWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const QuestionAuthor = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #111111;
`;

const InquiryQuestionText = styled.div`
  margin-top: 12px;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1.65;

  p {
    margin: 0;
  }
`;

const InquiryDate = styled.p`
  margin: 12px 0 0;
  color: #9a9a9a;
  font-size: 12px;
  font-weight: 500;
`;

const AnswerBox = styled.div`
  margin-top: 14px;
`;

const AnswerHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AnswerHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AnswerBadge = styled.span`
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

const AnswerAuthor = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #111111;
`;

const AnswerText = styled.p`
  margin: 10px 0 0;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1.7;
`;

const ReturnSection = styled.section`
  margin-top: 46px;
`;

const ReturnTitle = styled.h3`
  margin: 0 0 14px;
  color: #111111;
  font-size: 18px;
  font-weight: 800;
`;

const ReturnTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  margin-bottom: 28px;

  tr {
    border: 1px solid #dddddd;
  }
`;

const ReturnTh = styled.th`
  width: 180px;
  padding: 14px 16px;
  background: #f3f3f3;
  color: #555555;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  border-right: 1px solid #dddddd;
`;

const ReturnTd = styled.td`
  padding: 14px 16px;
  color: #555555;
  font-size: 13px;
  line-height: 1.6;
`;

const ReturnSubTitle = styled.h4`
  margin: 0 0 14px;
  color: #111111;
  font-size: 18px;
  font-weight: 800;
`;

const ReturnParagraph = styled.p`
  margin: 0 0 18px;
  color: #666666;
  font-size: 13px;
  line-height: 1.9;
`;

const ReturnBulletTitle = styled.h5`
  margin: 20px 0 10px;
  color: #444444;
  font-size: 14px;
  font-weight: 800;
`;

const ReturnBulletList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #666666;
  font-size: 13px;
  line-height: 1.9;

  li {
    margin-bottom: 2px;
  }
`;

const ReturnBottomLine = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid #e5e5e5;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 54px;
`;

const PageNavButton = styled.button`
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

const PageNumberButton = styled.button`
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
