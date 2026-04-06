import React from "react";

function TossFailPage() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const message = params.get("message");

  return (
    <div style={{ padding: 24 }}>
      <h2>결제 실패</h2>
      <p>code: {code}</p>
      <p>message: {message}</p>
    </div>
  );
}

export default TossFailPage;