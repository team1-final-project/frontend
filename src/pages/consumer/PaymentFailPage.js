import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function PaymentFailPage() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const message = params.get("message");

  return (
    <Page>
      <Card>
        <IconWrap>
          <AlertCircle size={46} />
        </IconWrap>

        <Title>결제가 완료되지 않았습니다</Title>
        <Description>
          결제 과정에서 문제가 발생했어요.
          <br />
          아래 정보를 확인한 뒤 다시 시도해주세요.
        </Description>

        <InfoBox>
          <InfoRow>
            <InfoLabel>에러 코드</InfoLabel>
            <InfoValue>{code || "-"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>메시지</InfoLabel>
            <InfoValue>{message || "-"}</InfoValue>
          </InfoRow>
        </InfoBox>

        <ButtonRow>
          <SecondaryButton type="button" onClick={() => navigate("/cart")}>
            장바구니로 이동
          </SecondaryButton>
          <PrimaryButton type="button" onClick={() => navigate(-1)}>
            다시 시도하기
          </PrimaryButton>
        </ButtonRow>
      </Card>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f7f4ee;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 600px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 36px 24px;
  text-align: center;
`;

const IconWrap = styled.div`
  width: 82px;
  height: 82px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #fff1f1;
  color: #d14a4a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #666;
`;

const InfoBox = styled.div`
  margin-top: 24px;
  border: 1px solid #f0e4e4;
  background: #fffafa;
  border-radius: 18px;
  padding: 18px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f4eaea;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: #777;
  font-size: 14px;
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: #111;
  font-size: 14px;
  font-weight: 700;
  text-align: right;
  word-break: break-all;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const BaseButton = styled.button`
  flex: 1;
  height: 54px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
`;

const PrimaryButton = styled(BaseButton)`
  background: #111;
  color: #fff;
`;

const SecondaryButton = styled(BaseButton)`
  background: #ece6dc;
  color: #111;
`;