import React from "react";
import LoginTestForm from "./LoginTestForm";
import SignupTestForm from "./SignupTestForm";

export default function AuthTestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 8 }}>회원 인증 테스트 페이지</h1>
        <p style={{ marginTop: 0, marginBottom: 24, color: "#6b7280" }}>
          로그인, 회원가입, 이메일 인증, 소셜로그인 연결 테스트용 화면
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <LoginTestForm />
          <SignupTestForm />
        </div>
      </div>
    </div>
  );
}