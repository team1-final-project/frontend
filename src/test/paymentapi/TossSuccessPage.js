import React, { useEffect, useState } from "react";

const EXPECTED_ORDER_ID = "ORDER-20260406-0001";
const EXPECTED_AMOUNT = 15000;

function TossSuccessPage() {
  const [result, setResult] = useState("처리 중...");

  useEffect(function () {
    const run = async function () {
      const params = new URLSearchParams(window.location.search);

      const paymentKey = params.get("paymentKey");
      const orderId = params.get("orderId");
      const amount = Number(params.get("amount"));

      if (!paymentKey || !orderId || !amount) {
        setResult("successUrl 파라미터가 없습니다.");
        return;
      }

      if (orderId !== EXPECTED_ORDER_ID) {
        setResult("orderId 불일치: " + orderId);
        return;
      }

      if (amount !== EXPECTED_AMOUNT) {
        setResult("amount 불일치: " + amount);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/payments/toss/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paymentKey: paymentKey,
            orderId: orderId,
            amount: amount
          })
        });

        const text = await response.text();

        setResult(
          "status: " + response.status + "\n\n" +
          "paymentKey: " + paymentKey + "\n" +
          "orderId: " + orderId + "\n" +
          "amount: " + amount + "\n\n" +
          text
        );
      } catch (error) {
        setResult("백엔드 호출 실패: " + String(error));
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>결제 성공</h2>
      <pre>{result}</pre>
    </div>
  );
}

export default TossSuccessPage;