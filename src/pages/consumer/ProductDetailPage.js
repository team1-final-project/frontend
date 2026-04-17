import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Minus,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import * as S from "./ProductDetailPageStyles.js";
import shinramyunImg from "../../assets/shinramyeon.jpg";

const PRODUCT_IMAGE = shinramyunImg;
const DETAIL_IMAGE_TOP = shinramyunImg;
const DETAIL_IMAGE_BOTTOM = shinramyunImg;

const REVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80",
];

const TABS = ["상품상세", "상품평(788,617)", "상품문의", "교환/반품 안내"];

const PRICE_TREND_POINTS = [24, 23, 31, 34, 46];
const PRICE_TREND_LABELS = ["4주전", "3주전", "2주전", "1주전", "현재"];

const BUY_TIMING_DATA = [
  { label: "오늘", value: 4150, status: "추천" },
  { label: "3일 후", value: 4280, status: "보통" },
  { label: "7일 후", value: 4410, status: "상승 가능성" },
];

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

function buildLinePoints(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const y = 42 - ((value - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function ProductDetailPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("상품상세");
  const [currentPage, setCurrentPage] = useState(1);

  const reviews = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, index) => ({
        id: index + 1,
        author: "김하* (hari***@naver.com)",
        date: "Posted on August 14, 2023",
        body: "라면을 워낙 좋아하는 터라 여러 종류의 라면을 구비해 두고 즐기는데요. 신라면만의 진한 표고 버섯 풍미와 매콤한 맛이 가장 손이 자주 갑니다. 특유의 감칠맛과 국물 밸런스가 좋아 무난하게 먹기 좋고, 전체적으로는 꾸준히 찾게 되는 제품이에요.",
      })),
    [],
  );

  const pages = Array.from({ length: 10 }, (_, i) => i + 1);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const linePoints = buildLinePoints(PRICE_TREND_POINTS);

  return (
    <S.Page>
      <S.Content>
        <S.Breadcrumb>
          <span>Home</span>
          <S.Divider>›</S.Divider>
          <span>라면</span>
          <S.Divider>›</S.Divider>
          <S.CurrentCategory>농심 신라면</S.CurrentCategory>
        </S.Breadcrumb>

        <S.HeroSection>
          <S.ImagePanel>
            <S.ImagePanelInner>
              <S.ProductImage src={PRODUCT_IMAGE} alt="농심 신라면" />
            </S.ImagePanelInner>
          </S.ImagePanel>

          <S.InfoPanel>
            <S.Title>농심 신라면, 120g, 5개</S.Title>

            <S.RatingRow>
              <S.Stars>★★★★★</S.Stars>
              <S.RatingText>4.5/5</S.RatingText>
            </S.RatingRow>

            <S.PriceRow>
              <S.CurrentPrice>4,150원</S.CurrentPrice>
              <S.OriginalPrice>5,000원</S.OriginalPrice>
              <S.DiscountBadge>-17%</S.DiscountBadge>
            </S.PriceRow>

            <S.AIBadgeRow>
              <S.AIBadge $tone="primary">AI 추천</S.AIBadge>
              <S.AIBadge $tone="accent">최저가 근접</S.AIBadge>
            </S.AIBadgeRow>

            <S.AISummaryCard>
              <S.AISummaryTitle>AI 구매 추천</S.AISummaryTitle>
              <S.AISummaryHeadline>지금 구매 추천</S.AISummaryHeadline>
              <S.AISummaryText>
                최근 7일 평균 대비 가격이 충분히 낮고, 다음 주에는 소폭 상승
                가능성이 있어 지금 구매하는 편이 유리해요.
              </S.AISummaryText>
            </S.AISummaryCard>

            <S.SpecGrid>
              <S.SpecCard>
                <S.SpecLabel>현재가</S.SpecLabel>
                <S.SpecValue>4,150원</S.SpecValue>
              </S.SpecCard>
              <S.SpecCard>
                <S.SpecLabel>최근 최저가</S.SpecLabel>
                <S.SpecValue>3,980원</S.SpecValue>
              </S.SpecCard>
              <S.SpecCard>
                <S.SpecLabel>예상 최저가 시점</S.SpecLabel>
                <S.SpecValue>이번 주</S.SpecValue>
              </S.SpecCard>
            </S.SpecGrid>

            <S.Specs>
              <li>중량 : 120g</li>
              <li>칼로리 : 500kcal</li>
              <li>소비기한 : 6개월</li>
              <li>출시년도 : 1986.10</li>
            </S.Specs>

            <S.ActionArea>
              <S.QuantityBox>
                <S.QtyButton type="button" onClick={decreaseQuantity}>
                  <Minus size={15} strokeWidth={2.3} />
                </S.QtyButton>
                <S.QtyValue>{quantity}</S.QtyValue>
                <S.QtyButton type="button" onClick={increaseQuantity}>
                  <Plus size={15} strokeWidth={2.3} />
                </S.QtyButton>
              </S.QuantityBox>

              <S.SecondaryButton type="button">
                <Bell size={16} />
                가격 알림
              </S.SecondaryButton>

              <S.CartButton type="button">장바구니 담기</S.CartButton>
            </S.ActionArea>
          </S.InfoPanel>
        </S.HeroSection>

        <S.AnalysisSection>
          <S.AnalysisGrid>
            <S.AnalysisCard>
              <S.AnalysisCardTitle>최근 가격 추이</S.AnalysisCardTitle>
              <S.AnalysisCardSub>
                최근 4주 기준으로 현재 가격이 가장 낮은 구간에 가까워요.
              </S.AnalysisCardSub>

              <S.SimpleTrendChart>
                <S.SimpleTrendSvg
                  viewBox="0 0 100 48"
                  preserveAspectRatio="none"
                >
                  <polyline
                    fill="none"
                    stroke="#2f6fd6"
                    strokeWidth="2.5"
                    points={linePoints}
                  />
                  {PRICE_TREND_POINTS.map((_, index) => {
                    const x =
                      PRICE_TREND_POINTS.length === 1
                        ? 0
                        : (index / (PRICE_TREND_POINTS.length - 1)) * 100;

                    const min = Math.min(...PRICE_TREND_POINTS);
                    const max = Math.max(...PRICE_TREND_POINTS);
                    const range = Math.max(max - min, 1);
                    const y =
                      42 - ((PRICE_TREND_POINTS[index] - min) / range) * 28;

                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="1.8"
                        fill="#ffffff"
                        stroke="#2f6fd6"
                        strokeWidth="1.4"
                      />
                    );
                  })}
                </S.SimpleTrendSvg>
              </S.SimpleTrendChart>

              <S.TrendLabelRow>
                {PRICE_TREND_LABELS.map((label) => (
                  <S.TrendLabel key={label}>{label}</S.TrendLabel>
                ))}
              </S.TrendLabelRow>
            </S.AnalysisCard>

            <S.AnalysisCard>
              <S.AnalysisCardTitle>구매 타이밍 예측</S.AnalysisCardTitle>
              <S.AnalysisCardSub>
                AI 분석 기준으로 이번 주 구매가 가장 유리할 가능성이 높아요.
              </S.AnalysisCardSub>

              <S.TimingList>
                {BUY_TIMING_DATA.map((item) => (
                  <S.TimingItem key={item.label}>
                    <S.TimingLabelWrap>
                      <S.TimingLabel>{item.label}</S.TimingLabel>
                      <S.TimingStatus $status={item.status}>
                        {item.status}
                      </S.TimingStatus>
                    </S.TimingLabelWrap>
                    <S.TimingPrice>
                      {item.value.toLocaleString()}원
                    </S.TimingPrice>
                  </S.TimingItem>
                ))}
              </S.TimingList>
            </S.AnalysisCard>
          </S.AnalysisGrid>
        </S.AnalysisSection>

        <S.TabBar>
          {TABS.map((tab) => (
            <S.TabButton
              key={tab}
              type="button"
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </S.TabButton>
          ))}
        </S.TabBar>

        {activeTab === "상품상세" && (
          <S.DetailSection>
            <S.DetailImageHero>
              <S.DetailHeroImage
                src={DETAIL_IMAGE_TOP}
                alt="신라면 메인 이미지"
              />
            </S.DetailImageHero>

            <S.BrandStorySection>
              <S.BrandStoryEyebrow>Brand Story</S.BrandStoryEyebrow>
              <S.BrandStoryTitle>
                신라면
                <br />
                브랜드 이야기
              </S.BrandStoryTitle>

              <S.BrandStoryGrid>
                <S.BrandStoryImageWrap>
                  <S.BrandStoryImage
                    src={DETAIL_IMAGE_BOTTOM}
                    alt="신라면 브랜드 이미지"
                  />
                </S.BrandStoryImageWrap>

                <S.BrandStoryTextWrap>
                  <S.BrandStoryHeadline>
                    Spicy Happiness In Noodles
                  </S.BrandStoryHeadline>

                  <S.BrandStoryText>
                    1986년 한국인의 입맛에 맞춘 매운맛 라면으로 시작한 신라면은
                    진한 소고기 육수와 깊은 양념의 조화로 전 세계인의 입맛까지
                    사로잡은 K-푸드 대표 아이콘입니다.
                  </S.BrandStoryText>

                  <S.BrandStoryText>
                    이제 신라면 한 그릇이 전하는 매콤하지만 행복한 순간을 담아,
                    <strong> SHIN : Spicy Happiness In Noodles</strong>라는
                    슬로건으로 그 가치를 새롭게 이야기합니다.
                  </S.BrandStoryText>

                  <S.BrandStoryText>
                    전 세계 100여 국가에서 사랑받는 신라면.
                    <br />
                    <strong>Spicy Happiness In Noodles.</strong>
                    <br />
                    그리고, 당신의 입맛을 맛있게.
                  </S.BrandStoryText>
                </S.BrandStoryTextWrap>
              </S.BrandStoryGrid>
            </S.BrandStorySection>

            <S.CheckPointSection>
              <S.CheckPointEyebrow>Check Point</S.CheckPointEyebrow>
              <S.CheckPointTitle>
                신라면
                <br />
                특별한 매력
              </S.CheckPointTitle>

              <S.CheckPointCardGrid>
                <S.CheckPointCard>
                  <S.CheckPointCardTitle>진한 국물 맛</S.CheckPointCardTitle>
                  <S.CheckPointCardText>
                    소고기 육수와 버섯 풍미가 더해져 깊고 균형감 있는 국물 맛을
                    느낄 수 있어요.
                  </S.CheckPointCardText>
                </S.CheckPointCard>

                <S.CheckPointCard>
                  <S.CheckPointCardTitle>꾸준한 인기</S.CheckPointCardTitle>
                  <S.CheckPointCardText>
                    오랜 시간 사랑받아온 대표 라면으로, 호불호 적고 만족도가
                    높은 제품이에요.
                  </S.CheckPointCardText>
                </S.CheckPointCard>

                <S.CheckPointCard>
                  <S.CheckPointCardTitle>
                    AI 추천 구매 구간
                  </S.CheckPointCardTitle>
                  <S.CheckPointCardText>
                    현재 가격은 최근 하락 구간에 위치해 있어 재구매용으로도
                    부담이 적은 편이에요.
                  </S.CheckPointCardText>
                </S.CheckPointCard>
              </S.CheckPointCardGrid>
            </S.CheckPointSection>
          </S.DetailSection>
        )}

        {activeTab === "상품평(788,617)" && (
          <>
            <S.ReviewGrid>
              {reviews.map((review) => (
                <S.ReviewCard key={review.id}>
                  <S.ReviewTop>
                    <S.ReviewHeaderLeft>
                      <S.ReviewStars>★★★★★</S.ReviewStars>
                      <S.AuthorRow>
                        <S.Author>{review.author}</S.Author>
                        <S.VerifiedIcon>
                          <BadgeCheck size={14} strokeWidth={2.2} />
                        </S.VerifiedIcon>
                      </S.AuthorRow>
                    </S.ReviewHeaderLeft>

                    <S.MoreButton type="button">
                      <MoreHorizontal size={16} />
                    </S.MoreButton>
                  </S.ReviewTop>

                  <S.ThumbGrid>
                    {REVIEW_IMAGES.map((image, index) => (
                      <S.ThumbWrap key={`${review.id}-${index}`}>
                        <S.ThumbImage src={image} alt={`review-${index}`} />
                        {index === REVIEW_IMAGES.length - 1 && (
                          <S.ThumbOverlay>
                            <ChevronRight size={12} />
                          </S.ThumbOverlay>
                        )}
                      </S.ThumbWrap>
                    ))}
                  </S.ThumbGrid>

                  <S.ReviewBody>{review.body}</S.ReviewBody>
                  <S.ReviewDate>{review.date}</S.ReviewDate>
                </S.ReviewCard>
              ))}
            </S.ReviewGrid>

            <S.Pagination>
              <S.PageNavButton type="button">
                <ChevronsLeft size={12} />
              </S.PageNavButton>
              <S.PageNavButton type="button">
                <ChevronLeft size={12} />
              </S.PageNavButton>

              {pages.map((page) => (
                <S.PageNumberButton
                  key={page}
                  type="button"
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </S.PageNumberButton>
              ))}

              <S.PageNavButton type="button">
                <ChevronRight size={12} />
              </S.PageNavButton>
              <S.PageNavButton type="button">
                <ChevronsRight size={12} />
              </S.PageNavButton>
            </S.Pagination>
          </>
        )}

        {activeTab === "상품문의" && (
          <>
            <S.InquiryList>
              {PRODUCT_INQUIRIES.map((item) => (
                <S.InquiryCard key={item.id}>
                  <S.InquiryRowTop>
                    <S.QuestionMeta>
                      <S.QuestionBadge>질문</S.QuestionBadge>
                      <S.QuestionAuthorWrap>
                        <S.QuestionAuthor>{item.author}</S.QuestionAuthor>
                        <S.VerifiedIcon>
                          <BadgeCheck size={14} strokeWidth={2.2} />
                        </S.VerifiedIcon>
                      </S.QuestionAuthorWrap>
                    </S.QuestionMeta>

                    <S.MoreButton type="button">
                      <MoreHorizontal size={16} />
                    </S.MoreButton>
                  </S.InquiryRowTop>

                  <S.InquiryQuestionText>
                    {item.question.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </S.InquiryQuestionText>

                  <S.InquiryDate>{item.questionDate}</S.InquiryDate>

                  <S.AnswerBox>
                    <S.AnswerHeaderRow>
                      <S.AnswerHeaderLeft>
                        <S.AnswerBadge>답변</S.AnswerBadge>
                        <S.AnswerAuthor>Stock+er Manager</S.AnswerAuthor>
                      </S.AnswerHeaderLeft>

                      <S.MoreButton type="button">
                        <MoreHorizontal size={16} />
                      </S.MoreButton>
                    </S.AnswerHeaderRow>

                    <S.AnswerText>{item.answer}</S.AnswerText>
                    <S.InquiryDate>{item.answerDate}</S.InquiryDate>
                  </S.AnswerBox>
                </S.InquiryCard>
              ))}
            </S.InquiryList>

            <S.Pagination>
              <S.PageNavButton type="button">
                <ChevronsLeft size={12} />
              </S.PageNavButton>
              <S.PageNavButton type="button">
                <ChevronLeft size={12} />
              </S.PageNavButton>

              {pages.map((page) => (
                <S.PageNumberButton
                  key={page}
                  type="button"
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </S.PageNumberButton>
              ))}

              <S.PageNavButton type="button">
                <ChevronRight size={12} />
              </S.PageNavButton>
              <S.PageNavButton type="button">
                <ChevronsRight size={12} />
              </S.PageNavButton>
            </S.Pagination>
          </>
        )}

        {activeTab === "교환/반품 안내" && (
          <S.ReturnSection>
            <S.ReturnTitle>반품/교환 정보</S.ReturnTitle>

            <S.ReturnTable>
              <tbody>
                {RETURN_INFO_ROWS.map((row) => (
                  <tr key={row.label}>
                    <S.ReturnTh>{row.label}</S.ReturnTh>
                    <S.ReturnTd>{row.value}</S.ReturnTd>
                  </tr>
                ))}
              </tbody>
            </S.ReturnTable>

            <S.ReturnSubTitle>반품/교환 기준</S.ReturnSubTitle>

            <S.ReturnParagraph>
              상품 수령 후 7일 이내에 신청하실 수 있습니다. 단, 제품이 표시·광고
              내용과 다르거나, 계약과 다르게 이행된 경우는 제품 수령일로부터
              3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에
              교환/반품이 가능합니다.
              <br />
              ㆍ추가적으로 다음에 해당하는 반품/교환은 신청이 불가능할 수
              있습니다.
            </S.ReturnParagraph>

            <S.ReturnBulletTitle>공통</S.ReturnBulletTitle>
            <S.ReturnBulletList>
              {RETURN_COMMON_RULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </S.ReturnBulletList>

            <S.ReturnBulletTitle>저온/신선 상품</S.ReturnBulletTitle>
            <S.ReturnBulletList>
              {RETURN_DENIED_RULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </S.ReturnBulletList>

            <S.ReturnBottomLine />
          </S.ReturnSection>
        )}
      </S.Content>
    </S.Page>
  );
}
