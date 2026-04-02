import React, { useState } from "react";
import {
  getGoogleLoginUrl,
  getKakaoLoginUrl,
  getNaverLoginUrl,
  sendEmailVerification,
  signup,
  verifyEmailCode,
} from "../api/auth";

const boxStyle = {
  width: "100%",
  maxWidth: 520,
  padding: 24,
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 14,
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "none",
  backgroundColor: "#111827",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

export default function SignupTestForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    code: "",
  });

  const [message, setMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    setMessage("");

    try {
      const data = await sendEmailVerification(form.email);
      setMessage(data?.message || "인증코드 발송 요청 완료");
    } catch (error) {
      console.error(error);
      setMessage(error?.response?.data?.detail || "인증코드 발송 실패");
    }
  };

  const handleVerifyCode = async () => {
    setMessage("");

    try {
      const data = await verifyEmailCode({
        email: form.email,
        code: form.code,
      });
      setIsEmailVerified(true);
      setMessage(data?.message || "이메일 인증 완료");
    } catch (error) {
      console.error(error);
      setIsEmailVerified(false);
      setMessage(error?.response?.data?.detail || "이메일 인증 실패");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone || null,
        is_email_verified: isEmailVerified,
      };

      const data = await signup(payload);
      setMessage(data?.message || "회원가입 성공");
    } catch (error) {
      console.error(error);
      setMessage(error?.response?.data?.detail || "회원가입 실패");
    }
  };

  return (
    <div style={boxStyle}>
      <h2 style={{ marginTop: 0 }}>회원가입 테스트</h2>

      <form onSubmit={handleSignup} style={{ display: "grid", gap: 12 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>이메일</label>
          <input
            style={inputStyle}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 8 }}>
          <input
            style={inputStyle}
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="인증코드 입력"
          />
          <button
            type="button"
            onClick={handleSendCode}
            style={{ ...buttonStyle, backgroundColor: "#2563eb" }}
          >
            코드 발송
          </button>
        </div>

        <button
          type="button"
          onClick={handleVerifyCode}
          style={{ ...buttonStyle, backgroundColor: "#0f766e" }}
        >
          이메일 인증 확인
        </button>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>비밀번호</label>
          <input
            style={inputStyle}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>비밀번호 확인</label>
          <input
            style={inputStyle}
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 다시 입력"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>이름</label>
          <input
            style={inputStyle}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름 입력"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>휴대폰 번호</label>
          <input
            style={inputStyle}
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="01012345678"
          />
        </div>

        <button type="submit" style={buttonStyle}>
          회원가입
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        <p style={{ marginBottom: 8, fontWeight: 700 }}>소셜 로그인 테스트</p>
        <div style={{ display: "grid", gap: 8 }}>
          <a href={getGoogleLoginUrl()} style={{ textDecoration: "none" }}>
            <button type="button" style={{ ...buttonStyle, backgroundColor: "#ffffff", color: "#111827", border: "1px solid #d1d5db" }}>
              구글 로그인
            </button>
          </a>
          <a href={getKakaoLoginUrl()} style={{ textDecoration: "none" }}>
            <button type="button" style={{ ...buttonStyle, backgroundColor: "#FEE500", color: "#191919" }}>
              카카오 로그인
            </button>
          </a>
          <a href={getNaverLoginUrl()} style={{ textDecoration: "none" }}>
            <button type="button" style={{ ...buttonStyle, backgroundColor: "#03C75A" }}>
              네이버 로그인
            </button>
          </a>
        </div>
      </div>

      {message && (
        <p style={{ marginTop: 16, color: "#111827", fontSize: 14 }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: 12, fontSize: 13, color: isEmailVerified ? "#0f766e" : "#6b7280" }}>
        이메일 인증 상태: {isEmailVerified ? "완료" : "미완료"}
      </p>
    </div>
  );
}