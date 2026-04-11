import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { confirmTossPayment } from "../../api/payment";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("결제 승인 처리 중입니다...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);

      const paymentKey = params.get("paymentKey");
      const orderId = params.get("orderId");
      const amount = Number(params.get("amount"));

      if (!paymentKey || !orderId || !amount) {
        setIsError(true);
        setMessage("결제 성공 파라미터가 올바르지 않습니다.");
        return;
      }

      try {
        const result = await confirmTossPayment({
          paymentKey,
          orderId,
          amount,
        });

        navigate("/order-complete", {
            replace: true,
            state: {
                orderNo: result.order_no,
                paymentStatus: result.payment_status,
                paidAt: result.paid_at,
                amount,
                orderName: result.order_name || "주문 상품",
            },
            });
      } catch (error) {
        console.error(error);
        setIsError(true);
        setMessage(
          error?.response?.data?.detail || "결제 승인 처리에 실패했습니다."
        );
      }
    };

    run();
  }, [navigate]);

  return (
    <Page>
      <Card>
        <Title>{isError ? "결제 처리 실패" : "결제 승인 처리 중"}</Title>
        <Description>{message}</Description>

        {isError && (
          <ButtonRow>
            <SecondaryButton type="button" onClick={() => navigate("/cart")}>
              장바구니로 이동
            </SecondaryButton>
            <PrimaryButton type="button" onClick={() => navigate("/")}>
              홈으로 가기
            </PrimaryButton>
          </ButtonRow>
        )}
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
  max-width: 560px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 24px;
  padding: 36px 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #666;
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