import React from "react";

const CLIENT_KEY = "test_ck_Z61JOxRQVEo5X7ARDwm28W0X9bAq";
const ORDER_ID = "ORDER-20260406-0001";
const AMOUNT = 15000;

function TossPayTestPage() {
  const handlePay = async function () {
    try {
      if (!window.TossPayments) {
        alert("토스 SDK가 로드되지 않았습니다.");
        return;
      }

      const tossPayments = window.TossPayments(CLIENT_KEY);

      const payment = tossPayments.payment({
        customerKey: "user-001-test"
      });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: AMOUNT
        },
        orderId: ORDER_ID,
        orderName: "토스 테스트 주문",
        successUrl: window.location.origin + "/toss/success",
        failUrl: window.location.origin + "/toss/fail"
      });
    } catch (error) {
      console.error("결제창 호출 실패:", error);
      alert("결제창 호출 실패");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>토스 테스트 결제</h2>
      <p>orderId: {ORDER_ID}</p>
      <p>amount: {AMOUNT}</p>
      <button onClick={handlePay}>결제하기</button>
    </div>
  );
}

export default TossPayTestPage;