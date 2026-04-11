import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Receipt, ShoppingBag } from "lucide-react";

export default function OrderCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderNo = location.state?.orderNo || "-";
  const paidAt = location.state?.paidAt || null;
  const amount = location.state?.amount || 0;
  const orderName = location.state?.orderName || "주문 상품";

  const formattedPaidAt = paidAt
    ? new Date(paidAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <Page>
      <Inner>
        <HeroCard>
          <HeroIconWrap>
            <Check size={42} strokeWidth={3} />
          </HeroIconWrap>

          <HeroTitle>주문이 완료되었습니다</HeroTitle>
          <HeroDescription>
            결제가 정상적으로 완료되었어요.
            <br />
            주문 정보를 아래에서 확인할 수 있습니다.
          </HeroDescription>
        </HeroCard>

        <InfoCard>
          <InfoHeader>
            <Receipt size={18} />
            <InfoTitle>주문 정보</InfoTitle>
          </InfoHeader>

          <InfoTable>
            <InfoRow>
              <InfoLabel>주문번호</InfoLabel>
              <InfoValue>{orderNo}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>주문상품</InfoLabel>
              <InfoValue>{orderName}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>결제금액</InfoLabel>
              <InfoValue>{amount.toLocaleString()}원</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>결제시각</InfoLabel>
              <InfoValue>{formattedPaidAt}</InfoValue>
            </InfoRow>
          </InfoTable>
        </InfoCard>

        <ButtonRow>
          <SecondaryButton type="button" onClick={() => navigate("/cart")}>
            <ShoppingBag size={18} />
            장바구니 보기
          </SecondaryButton>

          <PrimaryButton type="button" onClick={() => navigate("/")}>
            홈으로 가기
          </PrimaryButton>
        </ButtonRow>
      </Inner>
    </Page>
  );
}

const Page = styled.div`
  min-height: calc(100vh - 68px);
  background: #f5f1ea;
  padding: 52px 24px 96px;
`;

const Inner = styled.div`
  max-width: 980px;
  margin: 0 auto;
`;

const HeroCard = styled.section`
  background: #ffffff;
  border: 1px solid #ece5db;
  border-radius: 28px;
  padding: 40px 24px 54px;
  text-align: center;
  margin-bottom: 26px;
`;

const HeroIconWrap = styled.div`
  width: 86px;
  height: 86px;
  margin: 0 auto 22px;
  border-radius: 50%;
  background: #eaf3ea;
  color: #1f8f45;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroTitle = styled.h1`
  font-size: 44px;
  line-height: 1.2;
  font-weight: 900;
  color: #111111;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    font-size: 34px;
  }
`;

const HeroDescription = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #7b756d;
`;

const InfoCard = styled.section`
  background: #ffffff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 28px 24px;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  color: #111;
`;

const InfoTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
`;

const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  min-height: 64px;
  border-bottom: 1px solid #f0ebe4;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #7b756d;
`;

const InfoValue = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: #111111;
  text-align: right;
  word-break: break-word;
`;

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 28px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BaseButton = styled.button`
  height: 62px;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PrimaryButton = styled(BaseButton)`
  background: #111111;
  color: #ffffff;
`;

const SecondaryButton = styled(BaseButton)`
  background: #e9e2d7;
  color: #111111;
`;